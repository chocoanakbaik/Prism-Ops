import * as THREE from 'three';
import { PLAYER_CFG, CAMERA_CFG } from '../constants.js';

export class Player {
  constructor(camera, collision, weaponManager) {
    this.camera = camera;
    this.collision = collision;
    this.weapons = weaponManager;
    this.pos = new THREE.Vector3(0, PLAYER_CFG.height, 30);
    this.vel = new THREE.Vector3();
    this.yaw = Math.PI;
    this.pitch = 0;
    this.hp = PLAYER_CFG.maxHP;
    this.kills = 0;
    this.deaths = 0;
    this.recoil = 0;
    this.onGround = true;
    this._syncCamera();
  }

  update(dt, input) {
    if (this.hp <= 0) return;

    const lookSpeed = CAMERA_CFG.arrowLookSpeed;
    if (input.keys['arrowleft']) this.yaw += lookSpeed * dt;
    if (input.keys['arrowright']) this.yaw -= lookSpeed * dt;
    if (input.keys['arrowup']) this.pitch += lookSpeed * dt;
    if (input.keys['arrowdown']) this.pitch -= lookSpeed * dt;
    this.pitch = Math.max(-Math.PI / 2 + 0.05, Math.min(Math.PI / 2 - 0.05, this.pitch));

    let forward = 0;
    let right = 0;
    if (input.keys['w']) forward += 1;
    if (input.keys['s']) forward -= 1;
    if (input.keys['d']) right += 1;
    if (input.keys['a']) right -= 1;
    if (input.joystick.active) {
      forward += -input.joystick.dy / 60;
      right += input.joystick.dx / 60;
    }

    const len = Math.hypot(forward, right);
    if (len > 1) {
      forward /= len;
      right /= len;
    }

    const forwardVec = new THREE.Vector3(-Math.sin(this.yaw), 0, -Math.cos(this.yaw));
    const rightVec = new THREE.Vector3(Math.cos(this.yaw), 0, -Math.sin(this.yaw));
    const sprinting = input.keys['shift'] && forward > 0.1;
    const speed = PLAYER_CFG.speed * (sprinting ? PLAYER_CFG.sprintMultiplier : 1);
    const moveX = (forward * forwardVec.x + right * rightVec.x) * speed * dt;
    const moveZ = (forward * forwardVec.z + right * rightVec.z) * speed * dt;

    const resolved = this.collision.resolveMove(this.pos.x, this.pos.z, moveX, moveZ, PLAYER_CFG.radius);
    this.pos.x = resolved.x;
    this.pos.z = resolved.z;

    if ((input.keys[' '] || input.touchButtons.jump) && this.onGround) {
      this.vel.y = PLAYER_CFG.jumpForce;
      this.onGround = false;
      if (input.touchButtons.jump) input.touchButtons.jump = false;
    }

    if (!this.onGround) {
      this.vel.y -= PLAYER_CFG.gravity * dt;
      this.pos.y += this.vel.y * dt;
      if (this.pos.y <= PLAYER_CFG.height) {
        this.pos.y = PLAYER_CFG.height;
        this.vel.y = 0;
        this.onGround = true;
      }
    }

    this.recoil *= Math.pow(0.001, dt);
    this._syncCamera();
  }

  _syncCamera() {
    this.camera.position.copy(this.pos);
    this.camera.rotation.set(this.pitch + this.recoil, this.yaw, 0, 'YXZ');
  }

  takeDamage(amount) {
    if (this.hp <= 0) return;
    this.hp -= amount;
    if (this.hp <= 0) {
      this.hp = 0;
      this.deaths++;
    }
  }

  respawn() {
    this.hp = PLAYER_CFG.maxHP;
    this.pos.set((Math.random() - 0.5) * 40, PLAYER_CFG.height, 30);
    this.vel.set(0, 0, 0);
    this.onGround = true;
    this.yaw = Math.PI;
    this.pitch = 0;
    this.recoil = 0;
    this._syncCamera();
  }
}