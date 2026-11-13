import * as THREE from 'three';

export class CollisionWorld {
  constructor() {
    this.boxes = [];
    this.meshes = [];
  }

  addBox(center, size, mesh = null) {
    const half = size.clone().multiplyScalar(0.5);
    const min = center.clone().sub(half);
    const max = center.clone().add(half);
    const entry = { min, max };
    this.boxes.push(entry);
    if (mesh) this.meshes.push(mesh);
    return entry;
  }

  circleHits(x, z, radius) {
    for (const b of this.boxes) {
      const cx = Math.max(b.min.x, Math.min(x, b.max.x));
      const cz = Math.max(b.min.z, Math.min(z, b.max.z));
      const dx = x - cx;
      const dz = z - cz;
      if (dx * dx + dz * dz < radius * radius) return true;
    }
    return false;
  }

  resolveMove(x, z, dx, dz, radius) {
    let nx = x + dx;
    let nz = z + dz;
    if (this.circleHits(nx, z, radius)) nx = x;
    if (this.circleHits(nx, nz, radius)) nz = z;
    return { x: nx, z: nz };
  }

  raycast(origin, direction, far = 200) {
    const raycaster = new THREE.Raycaster(origin, direction, 0.01, far);
    const hits = raycaster.intersectObjects(this.meshes, true);
    return hits.length > 0 ? hits[0] : null;
  }

  hasLineOfSight(from, to) {
    const dir = to.clone().sub(from);
    const dist = dir.length();
    if (dist < 0.01) return true;
    dir.normalize();
    const hit = this.raycast(from, dir, dist - 0.1);
    return !hit;
  }

  clear() {
    this.boxes = [];
    this.meshes = [];
  }
}
