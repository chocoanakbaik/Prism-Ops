// ============================================
// Game Orchestrator — Batch 4 (Playable)
// ============================================

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
import { Rifle } from '../weapons/Rifle.js';
import { arena01 } from '../world/maps/arena01.js';
import { GRAPHICS_PRESETS, WEAPON_CFG } from '../constants.js';

export class Game {
  constructor(root) {
    this.root = root;
    this.state = 'boot';
    this.graphicsPreset = 'medium';
    
    this.scene = null;
    this.arena = null;
    this.collision = null;
    this.player = null;
    this.rifle = null;
    this.bots = [];
    this.hud = null;
    this.loop = null;
    this.input = null;
    this.audio = null;
    
    this.botCount = 3;
    this.botDifficulty = 2;
    
    this._fpsEl = null;
    this._firing = false;
    this._firedThisPress = false;
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
    this._startMatch();
    
    this.loop.start();
  }

  _createScene() { this.scene = new Scene(this.root, this.graphicsPreset); }

  _createArena() {
    this.collision = new CollisionWorld();
    this.arena = new Arena(this.scene.scene, this.collision);
    this.arena.build(arena01, GRAPHICS_PRESETS[this.graphicsPreset]);
  }

  _createEntities() {
    this.player = new Player(this.scene.camera, this.collision);
    this.rifle = new Rifle(this.scene.camera);
    this.player.rifle = this.rifle;
    this.hud = new HUD();
    this.bots = [];
  }

  _createInput() {
    this.input = new Input(this.scene.renderer.domElement);
    
    // Mouse look
    this.input.onLook = (dx, dy) => {
      if (!this.input.pointerLocked) return;
      const sens = 0.0022;
      this.player.yaw -= dx * sens;
      this.player.pitch -= dy * sens;
      this.player.pitch = Math.max(-Math.PI/2+0.05, Math.min(Math.PI/2-0.05, this.player.pitch));
    };

    // Keyboard shoot
    this.input.onKey = (key, isDown) => {
      if (key === 'j' || key === ' ') {
        this._firing = isDown;
        if (isDown) this._firedThisPress = false;
      }
      if (key === 'r') this.player.startReload();
    };

    // Mouse shoot
    this.input.onShoot = () => {
      this._firing = true;
      this._firedThisPress = false;
    };
    document.addEventListener('mouseup', e => {
      if (e.button === 0) this._firing = false;
    });
    
    // Touch shoot (nanti disambung dari UI)
    this.input.onPause = () => { /* pause menu nanti */ };
  }

  _createAudio() { this.audio = new Audio(); }
  _createLoop() { this.loop = new Loop(dt => this._tick(dt)); }

  _addFPS() {
    const fps = document.createElement('div');
    fps.style.cssText = 'position:fixed;top:8px;left:8px;font-size:12px;color:#fff;font-family:monospace;z-index:1000;pointer-events:none;';
    fps.textContent = 'BOOTING…';
    document.body.appendChild(fps);
    this._fpsEl = fps;
  }

  _startMatch() {
    this.player.respawn();
    this.player.kills = 0;
    this.player.deaths = 0;
    
    // Spawn Bots
    this.bots.forEach(b => this.scene.scene.remove(b.mesh));
    this.bots = [];
    const spawns = this.arena.getSpawns();
    
    for (let i = 0; i < this.botCount; i++) {
      const sp = spawns[Math.floor(Math.random() * spawns.length)];
      const bot = new Bot(this.scene.scene, this.collision, new THREE.Vector3(sp.x, 0, sp.z), this.botDifficulty);
      this.bots.push(bot);
    }

    // Lock pointer (kalau PC)
    if (!this.input.isTouch) {
      this.scene.renderer.domElement.requestPointerLock();
    }
  }

  _tick(dt) {
    if (this.state === 'playing') {
      // Player
      this.player.update(dt, this.input, this.audio);
      this.rifle.update(dt);

      // Bots
      for (const bot of this.bots) {
        bot.update(dt, this.player, this.audio);
      }

      // Shooting logic (Auto fire)
      if (this._firing && this.player.hp > 0) {
        if (this.input.pointerLocked || this.input.isTouch) {
          const shot = this.player.shoot();
          if (shot) {
            this.audio.play('gunshot', 0.2);
            this._doRaycast();
          }
        }
      }

      // Respawn logic
      if (this.player.hp <= 0) {
        setTimeout(() => {
          if (this.player.hp <= 0) {
            this.player.respawn();
            this._startMatch();
          }
        }, 2000);
      }

      // Update HUD
      this.hud.update(this.player);
      
      // Cleanup dead bots
      for (let i = this.bots.length - 1; i >= 0; i--) {
        if (!this.bots[i].alive) {
          this.scene.scene.remove(this.bots[i].mesh);
          this.bots.splice(i, 1);
          this.player.kills++;
        }
      }
    }

    this.scene.render();
    if (this._fpsEl && this.loop) this._fpsEl.textContent = `${this.loop.fps} FPS`;
  }

  _doRaycast() {
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(0, 0), this.scene.camera);
    raycaster.far = WEAPON_CFG.range;

    // Kumpulin target (bot meshes + wall meshes)
    const targets = [...this.collision.meshes];
    for (const bot of this.bots) targets.push(bot.mesh);

    const hits = raycaster.intersectObjects(targets, true);
    if (hits.length > 0) {
      const hit = hits[0];
      // Cek apakah kena bot
      for (const bot of this.bots) {
        let obj = hit.object;
        while (obj) {
          if (obj === bot.mesh) {
            bot.takeDamage(WEAPON_CFG.damage);
            this.audio.play('hit', 0.1);
            return;
          }
          obj = obj.parent;
        }
      }
    }
  }

  destroy() {
    this.loop?.stop();
    this.input?.destroy();
    this.rifle?.dispose();
    this.scene?.destroy();
  }
}
