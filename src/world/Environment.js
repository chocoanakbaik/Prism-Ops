import * as THREE from 'three';

export class Environment {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.scene.add(this.group);
    this.clouds = [];
    this._materials = [];
    this._geometries = [];
    this._build();
  }

  _build() {
    const cloudMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.3,
      depthWrite: false
    });
    this._materials.push(cloudMat);

    const cloudGeo = new THREE.SphereGeometry(1, 7, 7);
    this._geometries.push(cloudGeo);

    for (let i = 0; i < 8; i++) {
      const cloud = new THREE.Group();

      for (let j = 0; j < 4; j++) {
        const sphere = new THREE.Mesh(cloudGeo, cloudMat);
        const scale = 2 + Math.random() * 3;
        sphere.scale.setScalar(scale);
        sphere.position.set(j * 3, Math.random() * 2, Math.random() * 2);
        cloud.add(sphere);
      }

      cloud.position.set(
        (Math.random() - 0.5) * 150,
        25 + Math.random() * 10,
        (Math.random() - 0.5) * 150
      );
      this.group.add(cloud);
      this.clouds.push(cloud);
    }

    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 1 });
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x444444, roughness: 0.9 });
    const bushMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 1 });
    this._materials.push(trunkMat, leafMat, bushMat);

    const trunkGeo = new THREE.CylinderGeometry(0.3, 0.4, 3, 7);
    const leafGeo = new THREE.ConeGeometry(2, 4, 6);
    const bushGeo = new THREE.DodecahedronGeometry(1.4, 0);
    this._geometries.push(trunkGeo, leafGeo, bushGeo);

    const spawnTree = (x, z) => {
      const tree = new THREE.Group();
      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.position.y = 1.5;
      tree.add(trunk);

      const leaves = new THREE.Mesh(leafGeo, leafMat);
      leaves.position.y = 4;
      tree.add(leaves);

      tree.position.set(x, 0, z);
      this.group.add(tree);
    };

    for (let i = 0; i < 20; i++) {
      const angle = (i / 20) * Math.PI * 2;
      const radius = 42 + Math.random() * 6;
      spawnTree(Math.cos(angle) * radius, Math.sin(angle) * radius);
    }

    // Semak kecil mengisi sela antarpohon di pinggiran arena.
    for (let i = 0; i < 28; i++) {
      const angle = ((i + 0.5) / 28) * Math.PI * 2;
      const radius = 39 + Math.random() * 8;
      const bush = new THREE.Mesh(bushGeo, bushMat);
      const scale = 0.55 + Math.random() * 0.55;
      bush.scale.set(scale * 1.4, scale * 0.7, scale);
      bush.position.set(Math.cos(angle) * radius, 0.65 * scale, Math.sin(angle) * radius);
      this.group.add(bush);
    }
  }

  update(dt) {
    for (const cloud of this.clouds) {
      cloud.position.x += dt * 0.5;
      if (cloud.position.x > 100) cloud.position.x = -100;
    }
  }

  dispose() {
    this.scene.remove(this.group);
    for (const geometry of this._geometries) geometry.dispose();
    for (const material of this._materials) material.dispose();
    this.clouds.length = 0;
  }
}
