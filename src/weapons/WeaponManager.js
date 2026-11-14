import { Rifle } from './Rifle.js';
import { Pistol } from './Pistol.js';

export class WeaponManager {
  constructor(camera) {
    this.camera = camera;
    this.weapons = {
      rifle: { view: new Rifle(camera), ammo: 30, maxAmmo: 30, reserve: 90, reloadTime: 2.2, fireRate: 0.095, damage: 24 },
      pistol: { view: new Pistol(camera), ammo: 12, maxAmmo: 12, reserve: 36, reloadTime: 1.5, fireRate: 0.25, damage: 45 }
    };
    this.currentKey = 'rifle';
    this.reloading = false;
    this.reloadEnd = 0;
    this.reloadStart = 0;
    this.lastShot = 0;
    this.weapons.pistol.view.group.visible = false;
  }

  get current() { return this.weapons[this.currentKey]; }

  switchWeapon(key) {
    if (!this.weapons[key] || key === this.currentKey || this.reloading) return false;
    this.current.view.group.visible = false;
    this.currentKey = key;
    this.current.view.group.visible = true;
    return true;
  }

  update(dt) {
    for (const weapon of Object.values(this.weapons)) weapon.view.update(dt);

    if (this.reloading) {
      const now = performance.now() / 1000;
      const duration = this.current.reloadTime;
      const progress = Math.min(1, Math.max(0, (now - this.reloadStart) / duration));
      const dip = Math.sin(progress * Math.PI) * 0.22;
      this.current.view.group.position.y -= dip * Math.min(1, dt * 20);

      if (now >= this.reloadEnd) {
        this.reloading = false;
        const missing = this.current.maxAmmo - this.current.ammo;
        const toLoad = Math.min(missing, this.current.reserve);
        this.current.ammo += toLoad;
        this.current.reserve -= toLoad;
      }
    }
  }

  shoot() {
    if (this.reloading) return false;
    const now = performance.now() / 1000;
    if (now - this.lastShot < this.current.fireRate) return false;
    if (this.current.ammo <= 0) {
      this.startReload();
      return false;
    }
    this.lastShot = now;
    this.current.ammo--;
    this.current.view.fire();
    if (this.current.ammo === 0) this.startReload();
    return true;
  }

  startReload() {
    if (this.reloading || this.current.ammo === this.current.maxAmmo || this.current.reserve <= 0) return;
    this.reloading = true;
    this.reloadStart = performance.now() / 1000;
    this.reloadEnd = this.reloadStart + this.current.reloadTime;
  }

  setAiming(aiming) {
    this.current.view.setAiming(aiming);
  }

  dispose() {
    for (const weapon of Object.values(this.weapons)) weapon.view.dispose();
  }
}