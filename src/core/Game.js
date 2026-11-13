// ============================================
// Game Orchestrator
// ============================================

import * as THREE from 'three';
import { Loop } from './Loop.js';
import { Input } from './Input.js';
import { Audio } from './Audio.js';
import { ARENA_CFG, GRAPHICS_PRESETS, CAMERA_CFG } from '../constants.js';

export class Game {
  constructor(root) {
    this.root = root;
    this.state = 'boot';
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.loop = null;
    this.input = null;
    this.audio = null;
    this.graphicsPreset = 'medium';
    this._placeholder = null;
    this._fpsEl = null;
    this._onResize = this._handleResize.bind(this);
  }

  async boot() {
    this._createRenderer();
    this._createScene();
    this._createInput();
    this._createAudio();
    this._createLoop();
    this._addPlaceholder();
    this._addHUD();
    window.addEventListener('resize', this._onResize);
    this.state = 'menu';
    console.log('[Game] booted');
    this.loop.start();
  }

  _createRenderer() {
    const preset = GRAPHICS_PRESETS[this.graphicsPreset];
    this.renderer = new THREE.WebGLRenderer({
      antialias: preset.antialias,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(preset.renderScale * window.devicePixelRatio, 4));
    this.renderer.shadowMap.enabled = preset.shadows;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    this.renderer.domElement.style.display = 'block';
    this.root.appendChild(this.renderer.domElement);
  }

  _createScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(ARENA_CFG.bgColor);
    this.scene.fog = new THREE.Fog(ARENA_CFG.bgColor, 10, GRAPHICS_PRESETS[this.graphicsPreset].fogFar);

    this.camera = new THREE.PerspectiveCamera(
      CAMERA_CFG.fov,
      window.innerWidth / window.innerHeight,
      CAMERA_CFG.near,
      CAMERA_CFG.far
    );
    this.camera.position.set(0, 5, 12);
    this.camera.lookAt(0, 0, 0);
    this.scene.add(this.camera);

    this.scene.add(new THREE.AmbientLight(0x506080, 1.2));
    this.scene.add(new THREE.HemisphereLight(0x88aaff, 0x202030, 0.8));
    const sun = new THREE.DirectionalLight(0xffffff, 1.4);
    sun.position.set(30, 50, 20);
    sun.castShadow = GRAPHICS_PRESETS[this.graphicsPreset].shadows;
    this.scene.add(sun);
  }

  _createInput() {
    this.input = new Input(this.renderer.domElement);
    this.input.onReload = () => this.audio?.play('reload', 0.2);
    this.input.onPause = () => console.log('[Input] pause pressed');
  }

  _createAudio() {
    this.audio = new Audio();
  }

  _createLoop() {
    this.loop = new Loop((dt) => this._tick(dt));
  }

  _addPlaceholder() {
    const grid = new THREE.GridHelper(100, 50, 0x00ff88, 0x2a3545);
    grid.material.opacity = 0.4;
    grid.material.transparent = true;
    this.scene.add(grid);

    const geo = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    const mat = new THREE.MeshStandardMaterial({
      color: 0x00ff88,
      emissive: 0x00ff88,
      emissiveIntensity: 0.4,
      metalness: 0.3,
      roughness: 0.4
    });
    this._placeholder = new THREE.Mesh(geo, mat);
    this._placeholder.position.set(0, 1.5, 0);
    this.scene.add(this._placeholder);
  }

  _addHUD() {
    const fps = document.createElement('div');
    fps.id = 'prism-fps';
    fps.style.cssText = 'position:fixed;top:8px;left:8px;font-size:12px;color:#00ff88;font-family:monospace;z-index:1000;pointer-events:none;text-shadow:0 0 6px rgba(0,255,136,0.6);';
    fps.textContent = 'BOOTING…';
    document.body.appendChild(fps);
    this._fpsEl = fps;

    const banner = document.createElement('div');
    banner.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);padding:10px 20px;background:rgba(0,0,0,0.7);border:1px solid rgba(0,255,136,0.4);border-radius:8px;color:#00ff88;font-size:12px;letter-spacing:2px;font-family:monospace;z-index:1000;pointer-events:none;';
    banner.textContent = 'PRISM OPS · BATCH 2 · CORE ENGINE OK';
    document.body.appendChild(banner);
  }

  _tick(dt) {
    if (this._placeholder) {
      this._placeholder.rotation.x += dt * 0.5;
      this._placeholder.rotation.y += dt * 0.7;
    }
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
    if (this._fpsEl && this.loop) {
      this._fpsEl.textContent = `${this.loop.fps} FPS`;
    }
  }

  _handleResize() {
    if (!this.renderer || !this.camera) return;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    const preset = GRAPHICS_PRESETS[this.graphicsPreset];
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(preset.renderScale * window.devicePixelRatio, 4));
  }

  destroy() {
    this.loop?.stop();
    this.input?.destroy();
    this.renderer?.dispose();
    window.removeEventListener('resize', this._onResize);
  }
}
