import * as THREE from 'three';
import { WEAPON_CFG } from '../constants.js';

export class Rifle {
  constructor(camera) {
    this.camera = camera;
    this.group = new THREE.Group();
    this.muzzleFlash = null;
    this.muzzleLight = null;
    this.basePosition = new THREE.Vector3(0.28, -0.24, -0.55);
    this.aimPosition = new THREE.Vector3(0.0, -0.14, -0.4);
    this.recoilOffset = 0;
    this.aiming = false;
    this._build();
    this.camera.add(this.group);
  }

  _build() {
    this.group.position.copy(this.basePosition);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x2a2a35, roughness: 0.5, metalness: 0.7 });
    const barrelMat = new THREE.MeshStandardMaterial({ color: 0x1a1a20, roughness: 0.3, metalness: 0.9 });
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.12, 0.5), bodyMat);
    body.position.set(0, 0, -0.15);
    this.group.add(body);
    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.35, 8), barrelMat);
    barrel.rotation.x = Math.PI / 2;
    barrel.position.set(0, 0.02, -0.4);
    this.group.add(barrel);
    const mag = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.18, 0.08), bodyMat);
    mag.position.set(0, -0.13, -0.1);
    this.group.add(mag);
    const grip = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.14, 0.08), bodyMat);
    grip.position.set(0, -0.1, 0.08);
    grip.rotation.x = -0.3;
    this.group.add(grip);
    const sight = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.02, 0.02), new THREE.MeshStandardMaterial({ color: 0x00ff88, emissive: 0x00ff88, emissiveIntensity: 0.5 }));
    sight.position.set(0, 0.08, -0.3);
    this.group.add(sight);
    this.muzzleFlash = new THREE.Mesh(new THREE.SphereGeometry(0.08, 6, 6), new THREE.MeshBasicMaterial({ color: 0xffff88, transparent: true, opacity: 0 }));
    this.muzzleFlash.position.set(0, 0.02, -0.6);
    this.group.add(this.muzzleFlash);
    this.muzzleLight = new THREE.PointLight(0xffaa00, 0, 6);
    this.muzzleLight.position.copy(this.muzzleFlash.position);
    this.group.add(this.muzzleLight);
  }

  fire() {
    this.muzzleFlash.material.opacity = 1;
    this.muzzleLight.intensity = 3;
    this.recoilOffset = WEAPON_CFG.recoil;
  }

  setAiming(aiming) { this.aiming = aiming; }

  update(dt) {
    this.recoilOffset *= Math.pow(0.001, dt);
    if (this.muzzleFlash.material.opacity > 0) {
      this.muzzleFlash.material.opacity -= dt * 20;
      this.muzzleLight.intensity = Math.max(0, this.muzzleLight.intensity - dt * 30);
    }
    const target = this.aiming ? this.aimPosition : this.basePosition;
    this.group.position.x += (target.x - this.group.position.x) * Math.min(1, dt * 15);
    this.group.position.y += (target.y - this.group.position.y + this.recoilOffset * 1.5) * Math.min(1, dt * 15);
    this.group.position.z = target.z + this.recoilOffset * 2;
  }

  dispose() {
    this.camera.remove(this.group);
    this.group.traverse(o => {
      if (o.geometry) o.geometry.dispose();
      if (o.material) {
        if (Array.isArray(o.material)) o.material.forEach(m => m.dispose());
        else o.material.dispose();
      }
    });
  }
}
