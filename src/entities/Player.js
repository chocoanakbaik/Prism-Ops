// ============================================
// Player — Movement, shooting, camera
// ============================================

import * as THREE from 'three';
import { PLAYER_CFG, WEAPON_CFG, CAMERA_CFG } from '../constants.js';

export class Player {
  constructor(camera, collision) {
    this.camera = camera;
    this.collision = collision;
    
    // Spawn point default
    this.pos = new THREE.Vector3(0, PLAYER_CFG.height, 30);
    this.vel = new THREE.Vector3();
    
    this.yaw = Math.PI; // ngadep ke tengah map
    this.pitch = 0;
    
    this.hp = PLAYER_CFG.maxHP;
    this.ammo = PLAYER_CFG.maxAmmo;
    this.kills = 0;
    this.deaths = 0;
    
    this.reloading = false;
    this.reloadEnd = 0;
    this.lastShot = 0;
    this.recoil = 0;
    this.onGround = true;
    
    this.rifle = null; // di-set dari Game.js
    
    this._syncCamera();
  }

  update(dt, input, audio) {
    if (this.hp <= 0) return; // mati

    // === 1. LOOK (Arrow Keys / Touch) ===
    const lookSpeed = CAMERA_CFG.arrowLookSpeed;
    if (input.keys['arrowleft']) this.yaw += lookSpeed * dt;
    if (input.keys['arrowright']) this.yaw -= lookSpeed * dt;
    if (input.keys['arrowup']) this.pitch += lookSpeed * dt;
    if (input.keys['arrowdown']) this.pitch -= lookSpeed * dt;
    this.pitch = Math.max(-Math.PI/2 + 0.05, Math.min(Math.PI/2 - 0.05, this.pitch));

    // === 2. MOVE (WASD / Joystick) ===
    let forward = 0, right = 0;
    if (input.keys['w']) forward += 1;
    if (input.keys['s']) forward -= 1;
    if (input.keys['d']) right += 1;
    if (input.keys['a']) right -= 1;
    
    if (input.joystick.active) {
      forward += -input.joystick.dy / 60;
      right += input.joystick.dx / 60;
    }
    
    // Normalize diagonal
    const len = Math.hypot(forward, right);
    if (len > 1) { forward /= len; right /= len; }

    const forwardVec = new THREE.Vector3(-Math.sin(this.yaw), 0, -Math.cos(this.yaw));
    const rightVec = new THREE.Vector3(Math.cos(this.yaw), 0, -Math.sin(this.yaw));
    
    const sprinting = input.keys['shift'] && forward > 0.1;
    const speed = PLAYER_CFG.speed * (sprinting ? PLAYER_CFG.sprintMultiplier : 1);
    
    const moveX = (forward * forwardVec.x + right * rightVec.x) * speed * dt;
    const moveZ = (forward * forwardVec.z + right * rightVec.z) * speed * dt;

    // Collision resolve
    const resolved = this.collision.resolveMove(this.pos.x, this.pos.z, moveX, moveZ, PLAYER_CFG.radius);
    this.pos.x = resolved.x;
    this.pos.z = resolved.z;

    // Jump & Gravity
    if (input.keys[' '] && this.onGround) {
      this.vel.y = PLAYER_CFG.jumpForce;
      this.onGround = false;
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

    // Recoil decay
    this.recoil *= Math.pow(0.001, dt);
    
    // Reload selesai?
    if (this.reloading && performance.now()/1000 > this.reloadEnd) {
      this.reloading = false;
      this.ammo = PLAYER_CFG.maxAmmo;
    }

    this._syncCamera();
  }

  _syncCamera() {
    this.camera.position.copy(this.pos);
    this.camera.rotation.set(this.pitch + this.recoil, this.yaw, 0, 'YXZ');
  }

  shoot() {
    if (this.reloading || this.hp <= 0) return false;
    const now = performance.now() / 1000;
    if (now - this.lastShot < WEAPON_CFG.fireRate) return false;
    if (this.ammo <= 0) {
      this.startReload();
      return false;
    }

    this.lastShot = now;
    this.ammo--;
    this.pitch += WEAPON_CFG.spread * 6;
    this.recoil = 0.04;
    
    if (this.rifle) this.rifle.fire();

    // Auto reload if empty
    if (this.ammo === 0) this.startReload();
    
    return true;
  }

  startReload() {
    if (this.reloading || this.ammo === PLAYER_CFG.maxAmmo) return;
    this.reloading = true;
    this.reloadEnd = performance.now()/1000 + WEAPON_CFG.reloadTime;
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
    this.ammo = PLAYER_CFG.maxAmmo;
    this.reloading = false;
    this.pos.set((Math.random()-0.5)*40, PLAYER_CFG.height, 30);
    this.yaw = Math.PI;
    this.pitch = 0;
    this._syncCamera();
  }
}
