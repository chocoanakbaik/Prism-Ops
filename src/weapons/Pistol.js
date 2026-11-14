import * as THREE from 'three';

export class Pistol {
  constructor(camera) {
    this.camera = camera;
    this.group = new THREE.Group();
    this.muzzleFlash = null;
    this.muzzleLight = null;
    this.basePosition = new THREE.Vector3(0.25, -0.25, -0.45);
    this.aimPosition = new THREE.Vector3(0.0, -0.15, -0.35);
    this.recoilOffset = 0;
    this.aiming = false;
    this._build();
    this.camera.add(this.group);
  }

  _build() {
    this.group.position.copy(this.basePosition);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.6, metalness: 0.5 });
    const slideMat = new THREE.MeshStandardMaterial({ color: 0x444444, roughness: 0.4, metalness: 0.8 });

    const slide = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.08, 0.3), slideMat);
    slide.position.set(0, 0.02, -0.1);
    this.group.add(slide);

    const grip = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.15, 0.08), bodyMat);
    grip.position.set(0, -0.1, 0.05);
    grip.rotation.x = -0.2;
    this.group.add(grip);

    this.muzzleFlash = new THREE.Mesh(
      new THREE.SphereGeometry(0.06, 6, 6),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 })
    );
    this.muzzleFlash.position.set(0, 0.02, -0.25);
    this.group.add(this.muzzleFlash);

    this.muzzleLight = new THREE.PointLight(0xffffff, 0, 5);
    this.muzzleLight.position.copy(this.muzzleFlash.position);
    this.group.add(this.muzzleLight);
  }

  fire() {
    this.muzzleFlash.material.opacity = 1;
    this.muzzleLight.intensity = 2;
    this.recoilOffset = 0.06;
  }

  setAiming(aiming) { this.aiming = aiming; }

  update(dt) {
    this.recoilOffset *= Math.pow(0.001, dt);
    if (this.muzzleFlash.material.opacity > 0) {
      this.muzzleFlash.material.opacity = Math.max(0, this.muzzleFlash.material.opacity - dt * 20);
      this.muzzleLight.intensity = Math.max(0, this.muzzleLight.intensity - dt * 30);
    }
    const target = this.aiming ? this.aimPosition : this.basePosition;
    const blend = Math.min(1, dt * 15);
    this.group.position.x += (target.x - this.group.position.x) * blend;
    this.group.position.y += (target.y - this.group.position.y + this.recoilOffset * 1.5) * blend;
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