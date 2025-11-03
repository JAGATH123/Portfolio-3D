import * as THREE from 'three';
import { CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import Experience from './Experience.js';

export default class Renderer {
  constructor() {
    this.experience = new Experience();
    this.canvas = this.experience.canvas;
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.camera = this.experience.camera;

    // CSS3D scenes
    this.cssMainMonitorScene = this.experience.cssMainMonitorScene;
    this.cssMonitor7Scene = this.experience.cssMonitor7Scene;

    // CSS3D DOM containers
    this.cssMainMonitor = this.experience.cssMainMonitor;
    this.cssMonitor7 = this.experience.cssMonitor7;

    this.setInstance();
    this.setCSS3DRenderers();
  }

  setInstance() {
    // Dispose of old renderer if it exists (from HMR reloads)
    if (this.instance) {
      this.instance.dispose();
      this.instance.forceContextLoss();
    }

    this.instance = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: false,
    });
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(this.sizes.pixelRatio);
    this.instance.setClearColor('#1a1a1a'); // Dark gray background instead of black
    this.instance.shadowMap.enabled = true;
    this.instance.shadowMap.type = THREE.PCFSoftShadowMap;
    this.instance.toneMapping = THREE.ACESFilmicToneMapping;
    this.instance.toneMappingExposure = 1;

    console.log('✓ WebGL Renderer initialized');
    console.log('  - Size:', this.sizes.width, 'x', this.sizes.height);
    console.log('  - Pixel Ratio:', this.sizes.pixelRatio);
    console.log('  - Clear Color:', '#1a1a1a');
  }

  setCSS3DRenderers() {
    // Main Monitor CSS3D Renderer
    if (this.cssMainMonitor) {
      // Clear any existing CSS3D elements (from HMR reloads)
      while (this.cssMainMonitor.firstChild) {
        this.cssMainMonitor.removeChild(this.cssMainMonitor.firstChild);
      }

      this.cssMainMonitorInstance = new CSS3DRenderer();
      this.cssMainMonitorInstance.setSize(this.sizes.width, this.sizes.height);
      this.cssMainMonitorInstance.domElement.style.position = 'absolute';
      this.cssMainMonitorInstance.domElement.style.top = '0px';
      this.cssMainMonitorInstance.domElement.style.pointerEvents = 'none';
      this.cssMainMonitor.appendChild(this.cssMainMonitorInstance.domElement);
      console.log('✓ CSS3D renderer created for Main Monitor');
    }

    // Monitor 7 CSS3D Renderer
    if (this.cssMonitor7) {
      // Clear any existing CSS3D elements (from HMR reloads)
      while (this.cssMonitor7.firstChild) {
        this.cssMonitor7.removeChild(this.cssMonitor7.firstChild);
      }

      this.cssMonitor7Instance = new CSS3DRenderer();
      this.cssMonitor7Instance.setSize(this.sizes.width, this.sizes.height);
      this.cssMonitor7Instance.domElement.style.position = 'absolute';
      this.cssMonitor7Instance.domElement.style.top = '0px';
      this.cssMonitor7Instance.domElement.style.pointerEvents = 'none';
      this.cssMonitor7.appendChild(this.cssMonitor7Instance.domElement);
      console.log('✓ CSS3D renderer created for Monitor 7');
    }
  }

  resize() {
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(this.sizes.pixelRatio);

    // Resize CSS3D renderers
    if (this.cssMainMonitorInstance) {
      this.cssMainMonitorInstance.setSize(this.sizes.width, this.sizes.height);
    }
    if (this.cssMonitor7Instance) {
      this.cssMonitor7Instance.setSize(this.sizes.width, this.sizes.height);
    }
  }

  update() {
    // Render WebGL scene
    this.instance.render(this.scene, this.camera.instance);

    // Render CSS3D scenes
    if (this.cssMainMonitorInstance && this.cssMainMonitorScene) {
      this.cssMainMonitorInstance.render(
        this.cssMainMonitorScene,
        this.camera.instance
      );
    }

    if (this.cssMonitor7Instance && this.cssMonitor7Scene) {
      this.cssMonitor7Instance.render(
        this.cssMonitor7Scene,
        this.camera.instance
      );
    }

    // Other monitors disabled for now
    /*
    this.cssMonitor2Instance.render(
      this.cssMonitor2Scene,
      this.camera.instance
    );
    this.cssMonitor3Instance.render(
      this.cssMonitor3Scene,
      this.camera.instance
    );
    this.cssMonitor4Instance.render(
      this.cssMonitor4Scene,
      this.camera.instance
    );
    this.cssMonitor5Instance.render(
      this.cssMonitor5Scene,
      this.camera.instance
    );
    this.cssMonitor6Instance.render(
      this.cssMonitor6Scene,
      this.camera.instance
    );
    this.cssMonitor7Instance.render(
      this.cssMonitor7Scene,
      this.camera.instance
    );
    */
  }
}
