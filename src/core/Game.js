import * as THREE from 'three';
import { Loop } from './Loop.js';
import { Input } from './Input.js';
import { Audio } from './Audio.js';
import { Scene } from '../world/Scene.js';
import { Arena } from '../world/Arena.js';
import { CollisionWorld } from '../world/Collision.js';
import { Rifle } from '../weapons/Rifle.js';
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
    this.rifle = null;
    this.loop = null;
    this.input = null;
    this.audio = null;
    this.orbit = {
      yaw: Math.PI, pitch: -0.25, distance: 20,
      target: new THREE.Vector3(0, 1, 0),
      dragging: false, lastX: 0, lastY: 0
    };
    this._fpsEl = null;
    this._hintEl = null;
  }

  async boot() {
    this._createScene();
    this._createArena();
    this._createRifle();
    this._createInput();
    this._createAudio();
    this._createLoop();
    this._addHUD();
    this.rifle.group.visible = false;
    this.state = 'preview';
    console.log('[Game] booted — preview mode');
    this.loop.start();
  }

  _createScene() { this.scene = new Scene(this.root, this.graphicsPreset); }

  _createArena() {
    this.collision = new CollisionWorld();
    this.arena = new Arena(this.scene.scene, this.collision);
    this.arena.build(arena01, GRAPHICS_PRESETS[this.graphicsPreset]);
    this._updatePreviewCamera();
  }

  _createRifle() { this.rifle = new Rifle(this.scene.camera); }

  _createInput() {
    this.input = new Input(this.scene.renderer.domElement);
    const canvas = this.scene.renderer.domElement;
    const startDrag = (x, y) => { this.orbit.dragging = true; this.orbit.lastX = x; this.orbit.lastY = y; };
    const moveDrag = (x, y) => {
      if (!this.orbit.dragging) return;
      const dx = x - this.orbit.lastX;
      const dy = y - this.orbit.lastY;
      this.orbit.lastX = x;
      this.orbit.lastY = y;
      this.orbit.yaw -= dx * 0.005;
      this.orbit.pitch = Math.max(-1.2, Math.min(0.4, this.orbit.pitch - dy * 0.005));
      this._updatePreviewCamera();
    };
    const endDrag = () => { this.orbit.dragging = false; };
    canvas.addEventListener('mousedown', e => startDrag(e.clientX, e.clientY));
    canvas.addEventListener('mousemove', e => moveDrag(e.clientX, e.clientY));
    canvas.addEventListener('mouseup', endDrag);
    canvas.addEventListener('mouseleave', endDrag);
    canvas.addEventListener('wheel', e => {
      e.preventDefault();
      this.orbit.distance = Math.max(8, Math.min(60, this.orbit.distance + e.deltaY * 0.02));
      this._updatePreviewCamera();
    }, { passive: false });
    canvas.addEventListener('touchstart', e => { if (e.touches.length === 1) startDrag(e.touches[0].clientX, e.touches[0].clientY); }, { passive: true });
    canvas.addEventListener('touchmove', e => { if (e.touches.length === 1) moveDrag(e.touches[0].clientX, e.touches[0].clientY); }, { passive: true });
    canvas.addEventListener('touchend', endDrag);
  }

  _createAudio() { this.audio = new Audio(); }
  _createLoop() { this.loop = new Loop(dt => this._tick(dt)); }

  _addHUD() {
    const fps = document.createElement('div');
    fps.style.cssText = 'position:fixed;top:8px;left:8px;font-size:12px;color:#00ff88;font-family:monospace;z-index:1000;pointer-events:none;text-shadow:0 0 6px rgba(0,255,136,0.6);';
    fps.textContent = 'BOOTING…';
    document.body.appendChild(fps);
    this._fpsEl = fps;
    const banner = document.createElement('div');
    banner.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);padding:10px 20px;background:rgba(0,0,0,0.7);border:1px solid rgba(0,255,136,0.4);border-radius:8px;color:#00ff88;font-size:12px;letter-spacing:2px;font-family:monospace;z-index:1000;pointer-events:none;white-space:nowrap;';
    banner.textContent = 'PRISM OPS · BATCH 3 · PREVIEW MAP';
    document.body.appendChild(banner);
    const hint = document.createElement('div');
    hint.style.cssText = 'position:fixed;top:30px;left:50%;transform:translateX(-50%);padding:8px 16px;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.15);border-radius:6px;color:#aaa;font-size:11px;letter-spacing:1px;z-index:1000;pointer-events:none;';
    hint.textContent = '🖱 Drag untuk orbit · Scroll untuk zoom · 📱 1 finger drag';
    document.body.appendChild(hint);
    this._hintEl = hint;
  }

  _updatePreviewCamera() {
    const cam = this.scene.camera;
    const { yaw, pitch, distance, target } = this.orbit;
    cam.position.x = target.x + distance * Math.sin(yaw) * Math.cos(pitch);
    cam.position.y = target.y + distance * Math.sin(pitch) + 6;
    cam.position.z = target.z + distance * Math.cos(yaw) * Math.cos(pitch);
    cam.lookAt(target);
  }

  _tick(dt) {
    this.rifle?.update(dt);
    if (this.scene) this.scene.render();
    if (this._fpsEl && this.loop) this._fpsEl.textContent = `${this.loop.fps} FPS`;
  }

  destroy() {
    this.loop?.stop();
    this.input?.destroy();
    this.rifle?.dispose();
    this.scene?.destroy();
  }
}