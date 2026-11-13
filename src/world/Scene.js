import * as THREE from 'three';
import { CAMERA_CFG, GRAPHICS_PRESETS } from '../constants.js';

export class Scene {
  constructor(root, preset = 'medium') {
    this.root = root;
    this.preset = preset;
    this.gfx = GRAPHICS_PRESETS[preset];
    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.sun = null;
    this.ambient = null;
    this.hemi = null;
    this._createRenderer();
    this._createScene();
    this._createCamera();
    this._createLights();
    this._bindResize();
  }

  _createRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: this.gfx.antialias, powerPreference: 'high-performance' });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(this.gfx.renderScale * window.devicePixelRatio, 4));
    this.renderer.shadowMap.enabled = this.gfx.shadows;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    this.renderer.domElement.style.display = 'block';
    this.root.appendChild(this.renderer.domElement);
  }

  _createScene() {
    this.scene = new THREE.Scene();
  }

  _createCamera() {
    this.camera = new THREE.PerspectiveCamera(CAMERA_CFG.fov, window.innerWidth / window.innerHeight, CAMERA_CFG.near, CAMERA_CFG.far);
    this.camera.rotation.order = 'YXZ';
    this.camera.position.set(0, 5, 15);
    this.camera.lookAt(0, 0, 0);
    this.scene.add(this.camera);
  }

  _createLights() {
    this.ambient = new THREE.AmbientLight(0x506080, 1.2);
    this.scene.add(this.ambient);
    this.hemi = new THREE.HemisphereLight(0x88aaff, 0x202030, 0.8);
    this.scene.add(this.hemi);
    this.sun = new THREE.DirectionalLight(0xffffff, 1.4);
    this.sun.position.set(30, 50, 20);
    this.sun.castShadow = this.gfx.shadows;
    if (this.gfx.shadows) {
      this.sun.shadow.mapSize.width = 1024;
      this.sun.shadow.mapSize.height = 1024;
      this.sun.shadow.camera.left = -60;
      this.sun.shadow.camera.right = 60;
      this.sun.shadow.camera.top = 60;
      this.sun.shadow.camera.bottom = -60;
      this.sun.shadow.camera.far = 150;
    }
    this.scene.add(this.sun);
    this.scene.add(this.sun.target);
  }

  _bindResize() {
    this._onResize = () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(Math.min(this.gfx.renderScale * window.devicePixelRatio, 4));
    };
    window.addEventListener('resize', this._onResize);
  }

  setPreset(preset) {
    this.preset = preset;
    this.gfx = GRAPHICS_PRESETS[preset];
    this.renderer.setPixelRatio(Math.min(this.gfx.renderScale * window.devicePixelRatio, 4));
    this.renderer.shadowMap.enabled = this.gfx.shadows;
    this.sun.castShadow = this.gfx.shadows;
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    window.removeEventListener('resize', this._onResize);
    this.renderer.dispose();
    this.root.removeChild(this.renderer.domElement);
  }
}
