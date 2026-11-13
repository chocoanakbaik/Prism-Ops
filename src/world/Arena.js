import * as THREE from 'three';
import { CollisionWorld } from './Collision.js';

export class Arena {
  constructor(scene, collisionWorld) {
    this.scene = scene;
    this.collision = collisionWorld;
    this.group = new THREE.Group();
    this.scene.add(this.group);
    this.mapData = null;
  }

  build(mapData, graphics) {
    this.clear();
    this.mapData = mapData;
    this.scene.background = new THREE.Color(mapData.bgColor);
    this.scene.fog = new THREE.Fog(mapData.fogColor, mapData.fogNear, graphics.fogFar);
    this._buildGround(mapData);
    this._buildPerimeter(mapData, graphics);
    this._buildCovers(mapData, graphics);
    this._buildDecorations(mapData);
  }

  _buildGround(mapData) {
    const size = mapData.perimeter.size;
    const geo = new THREE.PlaneGeometry(size, size);
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#' + mapData.groundColor.toString(16).padStart(6, '0');
    ctx.fillRect(0, 0, 512, 512);
    ctx.strokeStyle = 'rgba(0, 255, 136, 0.06)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 16; i++) {
      const p = i * 32;
      ctx.beginPath(); ctx.moveTo(p, 0); ctx.lineTo(p, 512); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, p); ctx.lineTo(512, p); ctx.stroke();
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(12, 12);
    tex.anisotropy = 4;
    const mat = new THREE.MeshStandardMaterial({ color: 0xffffff, map: tex, roughness: 0.9, metalness: 0.05 });
    const floor = new THREE.Mesh(geo, mat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.group.add(floor);
  }

  _buildPerimeter(mapData, graphics) {
    const { size, height, color, thickness } = mapData.perimeter;
    const half = size / 2;
    const walls = [
      { x: 0, z: -half, w: size, d: thickness },
      { x: 0, z:  half, w: size, d: thickness },
      { x: -half, z: 0, w: thickness, d: size },
      { x:  half, z: 0, w: thickness, d: size }
    ];
    for (const w of walls) {
      this._makeBox(new THREE.Vector3(w.x, height / 2, w.z), new THREE.Vector3(w.w, height, w.d), color, graphics);
    }
  }

  _buildCovers(mapData, graphics) {
    for (const c of mapData.covers) {
      this._makeBox(new THREE.Vector3(c.x, c.y, c.z), new THREE.Vector3(c.w, c.h, c.d), c.color ?? 0x3a4a5a, graphics);
    }
  }

  _makeBox(center, size, color, graphics) {
    const geo = new THREE.BoxGeometry(size.x, size.y, size.z);
    const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.85, metalness: 0.1 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.copy(center);
    mesh.castShadow = graphics.shadows;
    mesh.receiveShadow = graphics.shadows;
    this.group.add(mesh);
    this.collision.addBox(center, size, mesh);
    return mesh;
  }

  _buildDecorations(mapData) {
    for (const d of mapData.decorations) {
      const geo = new THREE.CylinderGeometry(0.4, 0.4, d.height, 8);
      const mat = new THREE.MeshStandardMaterial({ color: d.color, emissive: d.color, emissiveIntensity: 0.8, roughness: 0.4 });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(d.x, d.height / 2, d.z);
      this.group.add(mesh);
      const light = new THREE.PointLight(d.color, 1.5, 15);
      light.position.set(d.x, d.height / 2, d.z);
      this.group.add(light);
    }
  }

  clear() {
    while (this.group.children.length > 0) {
      const child = this.group.children.pop();
      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        if (Array.isArray(child.material)) child.material.forEach(m => m.dispose());
        else child.material.dispose();
      }
      this.group.remove(child);
    }
    this.collision.clear();
  }

  getSpawns() {
    return this.mapData?.spawns || [{ x: 0, z: 0 }];
  }
}
