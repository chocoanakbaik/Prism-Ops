import * as THREE from 'three';
import { Loop } from './Loop.js';
import { Input } from './Input.js';
import { Audio } from './Audio.js';
import { Scene } from '../world/Scene.js';
import { Arena } from '../world/Arena.js';
import { CollisionWorld } from '../world/Collision.js';
import { Player } from '../entities/Player.js';
import { Bot } from '../entities/Bot.js';
import { HUD } from '../ui/HUD.js';
import { TouchControls } from '../ui/TouchControls.js';
import { WeaponManager } from '../weapons/WeaponManager.js';
import { arena01 } from '../world/maps/arena01.js';
import { GRAPHICS_PRESETS } from '../constants.js';

export class Game {
  constructor(root) {
    this.root = root;
    this.state = 'boot';
    this.graphicsPreset = 'medium';
    this.scene = null;
    this.arena = null;
    this.collision = null;
    this.player = null;
    this.weapons = null;
    this.bots = [];
    this.hud = null;
    this.touch = null;
    this.loop = null;
    this.input = null;
    this.audio = null;
    this.botCount = 1;
    this.botDifficulty = 1;
    this._fpsEl = null;
    this._firing = false;
    this._tracers = [];
    this._respawnTimer = null;
  }

  async boot() {
    this._createScene();
    this._createArena();
    this._createEntities();
    this._createInput();
    this._createAudio();
    this._createLoop();
    this._addFPS();
    this.state = 'playing';
    this.hud.show();
    if (this.input.isTouch) {
      this.touch = new TouchControls(this.input);
      this.touch.show();
    }
    this._startMatch();
    this.loop.start();
  }

  _createScene() {
    this.scene = new Scene(this.root, this.graphicsPreset);
  }

  _createArena() {
    this.collision = new CollisionWorld();
    this.arena = new Arena(this.scene.scene, this.collision);
    this.arena.build(arena01, GRAPHICS_PRESETS[this.graphicsPreset]);
    this.scene.renderer.toneMappingExposure = 1.2;
  }

  _createEntities() {
    this.weapons = new WeaponManager(this.scene.camera);
    this.player = new Player(this.scene.camera, this.collision, this.weapons);
    this.hud = new HUD();
    this.bots = [];
  }

  _createInput() {
    this.input = new Input(this.scene.renderer.domElement);
    this.input.touchButtons.switch = false;

    const unlockAudio = () => {
      if (this.audio) {
        this.audio.init();
        this.audio.resume();
      }
      window.removeEventListener('mousedown', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };
    window.addEventListener('mousedown', unlockAudio);
    window.addEventListener('touchstart', unlockAudio, { passive: true });
    window.addEventListener('keydown', unlockAudio);

    this.input.onLook = (dx, dy) => {
      if (!this.input.pointerLocked && !this.input.isTouch) return;
      const sens = this.input.isTouch ? 0.004 : 0.0022;
      this.player.yaw -= dx * sens;
      this.player.pitch -= dy * sens;
      this.player.pitch = Math.max(-Math.PI / 2 + 0.05, Math.min(Math.PI / 2 - 0.05, this.player.pitch));
    };

    this.input.onKey = (key, isDown) => {
      if (key === 'j' || key === ' ') this._firing = isDown;
      if (isDown && key === 'r') this.weapons.startReload();
      if (isDown && key === '1') this.weapons.switchWeapon('rifle');
      if (isDown && key === '2') this.weapons.switchWeapon('pistol');
    };
    this.input.onShoot = () => { this._firing = true; };
    document.addEventListener('mouseup', e => {
      if (e.button === 0) this._firing = false;
    });
  }

  _createAudio() {
    this.audio = new Audio();
  }

  _createLoop() {
    this.loop = new Loop(dt => this._tick(dt));
  }

  _addFPS() {
    const fps = document.createElement('div');
    fps.style.cssText = 'position:fixed;top:8px;left:8px;font-size:12px;color:#fff;font-family:monospace;z-index:1000;pointer-events:none;';
    fps.textContent = 'BOOTING…';
    document.body.appendChild(fps);
    this._fpsEl = fps;
  }

  _startMatch() {
    this.player.respawn();
    this.bots.forEach(bot => this.scene.scene.remove(bot.mesh));
    this.bots = [];
    const spawns = this.arena.getSpawns();
    for (let i = 0; i < this.botCount; i++) {
      const spawn = spawns[Math.floor(Math.random() * spawns.length)];
      const bot = new Bot(
        this.scene.scene,
        this.collision,
        new THREE.Vector3(spawn.x, 0, spawn.z),
        this.botDifficulty
      );
      this.bots.push(bot);
    }
    if (!this.input.isTouch) this.scene.renderer.domElement.requestPointerLock();
  }

  _tick(dt) {
    for (let i = this._tracers.length - 1; i >= 0; i--) {
      const tracer = this._tracers[i];
      tracer.life -= dt;
      tracer.line.material.opacity = Math.max(0, tracer.life * 5);
      if (tracer.life <= 0) {
        this.scene.scene.remove(tracer.line);
        tracer.line.geometry.dispose();
        tracer.line.material.dispose();
        this._tracers.splice(i, 1);
      }
    }

    if (this.state === 'playing') {
      this.player.update(dt, this.input);
      this.weapons.update(dt);
      for (const bot of this.bots) bot.update(dt, this.player, this.audio);

      if (this.input.touchButtons.reload) {
        this.weapons.startReload();
        this.input.touchButtons.reload = false;
      }
      if (this.input.touchButtons.switch) {
        const next = this.weapons.currentKey === 'rifle' ? 'pistol' : 'rifle';
        this.weapons.switchWeapon(next);
        this.input.touchButtons.switch = false;
      }

      if ((this._firing || this.input.touchButtons.fire) && this.player.hp > 0) {
        if (this.weapons.shoot()) {
          this.audio.play('gunshot', 0.2);
          this._doRaycast();
        }
      }

      if (this.player.hp <= 0 && this._respawnTimer === null) {
        this._respawnTimer = setTimeout(() => {
          this._respawnTimer = null;
          if (this.player.hp <= 0) this._startMatch();
        }, 2000);
      }

      this.hud.update({
        hp: this.player.hp,
        ammo: this.weapons.current.ammo,
        reserve: this.weapons.current.reserve,
        maxAmmo: this.weapons.current.maxAmmo,
        reloading: this.weapons.reloading,
        kills: this.player.kills,
        deaths: this.player.deaths
      });

      for (let i = this.bots.length - 1; i >= 0; i--) {
        if (!this.bots[i].alive) {
          this.scene.scene.remove(this.bots[i].mesh);
          this.bots.splice(i, 1);
          this.player.kills++;
        }
      }
    }

    this.scene.render();
    if (this._fpsEl && this.loop) this._fpsEl.textContent = this.loop.fps + ' FPS';
  }

  _doRaycast() {
    const weapon = this.weapons.current;
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(0, 0), this.scene.camera);
    raycaster.far = 120;
    const targets = [...this.collision.meshes];
    for (const bot of this.bots) targets.push(bot.mesh);
    const hits = raycaster.intersectObjects(targets, true);
    let endPos;

    if (hits.length > 0) {
      endPos = hits[0].point.clone();
      for (const bot of this.bots) {
        let object = hits[0].object;
        while (object) {
          if (object === bot.mesh) {
            bot.takeDamage(weapon.damage);
            this.audio.play('hit', 0.1);
            break;
          }
          object = object.parent;
        }
      }
    } else {
      endPos = raycaster.ray.at(120, new THREE.Vector3());
    }

    this.scene.camera.updateMatrixWorld();
    const startPos = new THREE.Vector3(0.25, -0.2, -0.5).applyMatrix4(this.scene.camera.matrixWorld);
    const geometry = new THREE.BufferGeometry().setFromPoints([startPos, endPos]);
    const material = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 1 });
    const line = new THREE.Line(geometry, material);
    this.scene.scene.add(line);
    this._tracers.push({ line, life: 0.1 });
  }

  destroy() {
    this.loop?.stop();
    if (this._respawnTimer !== null) clearTimeout(this._respawnTimer);
    this.touch?.hide();
    this.input?.destroy();
    this.weapons?.dispose();
    this.scene?.destroy();
    if (this._fpsEl?.parentNode) this._fpsEl.parentNode.removeChild(this._fpsEl);
  }
}