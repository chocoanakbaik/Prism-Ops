import * as THREE from 'three';
import { BOT_NAMES, BOT_DIFFICULTY, BOT_STATES } from '../constants.js';

export class Bot {
  constructor(scene, collision, spawnPos, difficulty = 2) {
    this.scene = scene;
    this.collision = collision;
    this.cfg = BOT_DIFFICULTY[difficulty];
    this.pos = spawnPos.clone();
    this.pos.y = 0;
    this.alive = true;
    this.hp = this.cfg.hp;
    this.name = BOT_NAMES[Math.floor(Math.random() * BOT_NAMES.length)];
    this.state = BOT_STATES.PATROL;
    this.target = this._randomWaypoint();
    this.lastFire = 0;
    this.lastSeenTime = 0;
    this.reactionTimer = 0;
    this.mesh = null;
    this.parts = {};
    this.muzzleFlash = null;
    this._walkTime = 0;
    this._buildMesh();
  }

  _buildMesh() {
    this.mesh = new THREE.Group();
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.8 });
    const headMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 });
    const gunMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.4, metalness: 0.8 });

    this.parts.torso = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.8, 0.3), bodyMat);
    this.parts.torso.position.y = 1.2;
    this.mesh.add(this.parts.torso);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 10), headMat);
    head.position.y = 1.8;
    this.mesh.add(head);

    this.parts.legL = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.8, 0.2), bodyMat);
    this.parts.legL.position.set(-0.2, 0.4, 0);
    this.mesh.add(this.parts.legL);

    this.parts.legR = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.8, 0.2), bodyMat);
    this.parts.legR.position.set(0.2, 0.4, 0);
    this.mesh.add(this.parts.legR);

    this.parts.armL = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.6, 0.15), bodyMat);
    this.parts.armL.position.set(-0.4, 1.3, 0);
    this.mesh.add(this.parts.armL);

    this.parts.armR = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.6, 0.15), bodyMat);
    this.parts.armR.position.set(0.4, 1.3, 0);
    this.mesh.add(this.parts.armR);

    const gun = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.6), gunMat);
    gun.position.set(0.4, 1.2, 0.3);
    this.mesh.add(gun);

    this.muzzleFlash = new THREE.Mesh(
      new THREE.SphereGeometry(0.15, 6, 6),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 })
    );
    this.muzzleFlash.position.set(0.4, 1.2, 0.6);
    this.mesh.add(this.muzzleFlash);
    this.mesh.position.copy(this.pos);
    this.scene.add(this.mesh);
  }

  _randomWaypoint() {
    for (let i = 0; i < 20; i++) {
      const x = (Math.random() - 0.5) * 80;
      const z = (Math.random() - 0.5) * 80;
      if (!this.collision.circleHits(x, z, 1)) return new THREE.Vector3(x, 0, z);
    }
    return new THREE.Vector3(0, 0, 0);
  }

  update(dt, player, audio) {
    if (!this.alive) return;
    const now = performance.now() / 1000;
    const distToPlayer = this.pos.distanceTo(player.pos);
    const hasLOS = this._checkLOS(player);

    if (hasLOS && distToPlayer < this.cfg.viewRange) {
      this.lastSeenTime = now;
      if (this.state !== BOT_STATES.ATTACK) {
        this.reactionTimer = this.cfg.reactionTime + 0.4;
        this.state = BOT_STATES.ATTACK;
      }
    } else if (this.state === BOT_STATES.ATTACK && now - this.lastSeenTime > 1.5) {
      this.state = BOT_STATES.HUNT;
    } else if (this.state === BOT_STATES.HUNT && now - this.lastSeenTime > 6) {
      this.state = BOT_STATES.PATROL;
      this.target = this._randomWaypoint();
    }

    this._walkTime += dt * this.cfg.speed * 3;
    const isMoving = this.state !== BOT_STATES.ATTACK || distToPlayer > 15;
    if (isMoving) {
      const swing = Math.sin(this._walkTime) * 0.5;
      this.parts.legL.rotation.x = swing;
      this.parts.legR.rotation.x = -swing;
      this.parts.armL.rotation.x = -swing * 0.65;
      this.parts.armR.rotation.x = swing * 0.65;
      this.parts.torso.position.y = 1.2 + Math.abs(Math.sin(this._walkTime)) * 0.05;
    } else {
      this.parts.legL.rotation.x = 0;
      this.parts.legR.rotation.x = 0;
      this.parts.armL.rotation.x = 0;
      this.parts.armR.rotation.x = 0;
      this.parts.torso.position.y = 1.2;
    }

    if (this.state === BOT_STATES.PATROL) {
      if (this._moveToward(this.target, dt)) this.target = this._randomWaypoint();
    } else if (this.state === BOT_STATES.HUNT) {
      this._moveToward(player.pos, dt);
    } else if (this.state === BOT_STATES.ATTACK) {
      if (distToPlayer > 15) {
        this._moveToward(player.pos, dt);
      } else {
        const dir = new THREE.Vector3().subVectors(player.pos, this.pos).normalize();
        const perp = new THREE.Vector3(-dir.z, 0, dir.x);
        const moveX = perp.x * this.cfg.speed * 0.5 * dt;
        const moveZ = perp.z * this.cfg.speed * 0.5 * dt;
        const res = this.collision.resolveMove(this.pos.x, this.pos.z, moveX, moveZ, 0.5);
        this.pos.x = res.x;
        this.pos.z = res.z;
      }

      if (this.reactionTimer > 0) {
        this.reactionTimer -= dt;
      } else if (hasLOS && now - this.lastFire > this.cfg.fireRate) {
        this.lastFire = now;
        this._fireEffect(audio);
        const hitChance = (this.cfg.accuracy * 0.6) * Math.max(0.15, 1 - distToPlayer / this.cfg.viewRange);
        if (Math.random() < hitChance) {
          player.takeDamage(Math.floor(this.cfg.damage * 0.5));
          if (audio) audio.play('hit', 0.1);
        }
      }
    }

    this.mesh.position.copy(this.pos);
    const lookDir = new THREE.Vector3().subVectors(player.pos, this.pos);
    this.mesh.rotation.y = Math.atan2(lookDir.x, lookDir.z);
    if (this.muzzleFlash.material.opacity > 0) {
      this.muzzleFlash.material.opacity = Math.max(0, this.muzzleFlash.material.opacity - dt * 15);
    }
  }

  _fireEffect(audio) {
    if (audio) audio.play('gunshot', 0.05);
    this.muzzleFlash.material.opacity = 1;
  }

  _moveToward(target, dt) {
    const dir = new THREE.Vector3(target.x - this.pos.x, 0, target.z - this.pos.z);
    const dist = dir.length();
    if (dist < 0.5) return true;
    dir.normalize();
    const step = this.cfg.speed * dt;
    const res = this.collision.resolveMove(this.pos.x, this.pos.z, dir.x * step, dir.z * step, 0.5);
    this.pos.x = res.x;
    this.pos.z = res.z;
    return false;
  }

  _checkLOS(player) {
    const start = new THREE.Vector3(this.pos.x, 1.7, this.pos.z);
    const end = new THREE.Vector3(player.pos.x, player.pos.y, player.pos.z);
    return this.collision.hasLineOfSight(start, end);
  }

  takeDamage(amount) {
    if (!this.alive) return;
    this.hp -= amount;
    if (this.hp <= 0) {
      this.alive = false;
      this.mesh.visible = false;
    }
  }
}