import * as THREE from 'three';
import Sizes from './Utils/Sizes.js';
import Time from './Utils/Time.js';
import Camera from './Camera.js';
import Renderer from './Renderer.js';
import World from './World/World.js';
import Resources from './Utils/Resources.js';
import Raycaster from './Utils/Raycaster.js';
import sources from './sources.js';

let instance = null;

export default class Experience {
  constructor(canvas) {
    // Singleton pattern
    if (instance) {
      return instance;
    }
    instance = this;

    // Global access
    window.experience = this;

    // Options
    this.canvas = canvas;

    // Setup
    this.sizes = new Sizes();
    this.time = new Time();
    this.scene = new THREE.Scene();

    // Create CSS3D scenes for monitors
    this.cssMainMonitorScene = new THREE.Scene(); // CSS3D for Main Monitor
    this.cssMonitor7Scene = new THREE.Scene(); // CSS3D for Monitor 7

    // Get DOM containers for CSS3D renderers
    this.cssMainMonitor = document.querySelector('.css-main-monitor');
    this.cssMonitor7 = document.querySelector('.css-monitor-7');

    this.resources = new Resources(sources);
    this.camera = new Camera();
    this.renderer = new Renderer();
    this.raycaster = new Raycaster();
    this.world = new World();

    // Resize event
    this.sizes.on('resize', () => {
      this.resize();
    });

    // Time tick event
    this.time.on('tick', () => {
      this.update();
    });
  }

  resize() {
    this.camera.resize();
    this.renderer.resize();
  }

  update() {
    this.camera.update();
    this.world.update();
    this.renderer.update();
  }

  destroy() {
    this.sizes.off('resize');
    this.time.off('tick');

    // Traverse the whole scene
    this.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();

        for (const key in child.material) {
          const value = child.material[key];

          if (value && typeof value.dispose === 'function') {
            value.dispose();
          }
        }
      }
    });

    this.camera.controls.dispose();
    this.renderer.instance.dispose();
  }
}
