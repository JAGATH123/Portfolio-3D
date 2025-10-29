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

    // CSS3D scenes (Main Monitor uses canvas texture instead)
    // this.cssMainMonitorScene = this.experience.cssMainMonitorScene; // Not used
    this.cssMonitor2Scene = this.experience.cssMonitor2Scene;
    this.cssMonitor3Scene = this.experience.cssMonitor3Scene;
    this.cssMonitor4Scene = this.experience.cssMonitor4Scene;
    this.cssMonitor5Scene = this.experience.cssMonitor5Scene;
    this.cssMonitor6Scene = this.experience.cssMonitor6Scene;
    this.cssMonitor7Scene = this.experience.cssMonitor7Scene;

    // CSS3D DOM containers
    // this.cssMainMonitor = this.experience.cssMainMonitor; // Not used
    this.cssMonitor2 = this.experience.cssMonitor2;
    this.cssMonitor3 = this.experience.cssMonitor3;
    this.cssMonitor4 = this.experience.cssMonitor4;
    this.cssMonitor5 = this.experience.cssMonitor5;
    this.cssMonitor6 = this.experience.cssMonitor6;
    this.cssMonitor7 = this.experience.cssMonitor7;

    this.setInstance();
    // this.setCSS3DRenderers(); // Disabled - no CSS3D renderers needed for now
  }

  setInstance() {
    this.instance = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    });
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(this.sizes.pixelRatio);
    this.instance.shadowMap.enabled = true;
    this.instance.shadowMap.type = THREE.PCFSoftShadowMap;
    this.instance.toneMapping = THREE.ACESFilmicToneMapping;
    this.instance.toneMappingExposure = 1;
  }

  setCSS3DRenderers() {
    // Main Monitor uses canvas texture - no CSS3D renderer needed
    // this.cssMainMonitorInstance = new CSS3DRenderer();
    // this.cssMainMonitorInstance.setSize(this.sizes.width, this.sizes.height);
    // this.cssMainMonitorInstance.domElement.style.position = 'absolute';
    // this.cssMainMonitorInstance.domElement.style.top = '0px';
    // this.cssMainMonitorInstance.domElement.style.pointerEvents = 'none';
    // this.cssMainMonitor.appendChild(this.cssMainMonitorInstance.domElement);

    // Monitor 2 CSS3D Renderer
    this.cssMonitor2Instance = new CSS3DRenderer();
    this.cssMonitor2Instance.setSize(this.sizes.width, this.sizes.height);
    this.cssMonitor2Instance.domElement.style.position = 'absolute';
    this.cssMonitor2Instance.domElement.style.top = '0px';
    this.cssMonitor2Instance.domElement.style.pointerEvents = 'none';
    this.cssMonitor2.appendChild(this.cssMonitor2Instance.domElement);

    // Monitor 3 CSS3D Renderer
    this.cssMonitor3Instance = new CSS3DRenderer();
    this.cssMonitor3Instance.setSize(this.sizes.width, this.sizes.height);
    this.cssMonitor3Instance.domElement.style.position = 'absolute';
    this.cssMonitor3Instance.domElement.style.top = '0px';
    this.cssMonitor3Instance.domElement.style.pointerEvents = 'none';
    this.cssMonitor3.appendChild(this.cssMonitor3Instance.domElement);

    // Monitor 4 CSS3D Renderer
    this.cssMonitor4Instance = new CSS3DRenderer();
    this.cssMonitor4Instance.setSize(this.sizes.width, this.sizes.height);
    this.cssMonitor4Instance.domElement.style.position = 'absolute';
    this.cssMonitor4Instance.domElement.style.top = '0px';
    this.cssMonitor4Instance.domElement.style.pointerEvents = 'none';
    this.cssMonitor4.appendChild(this.cssMonitor4Instance.domElement);

    // Monitor 5 CSS3D Renderer
    this.cssMonitor5Instance = new CSS3DRenderer();
    this.cssMonitor5Instance.setSize(this.sizes.width, this.sizes.height);
    this.cssMonitor5Instance.domElement.style.position = 'absolute';
    this.cssMonitor5Instance.domElement.style.top = '0px';
    this.cssMonitor5Instance.domElement.style.pointerEvents = 'none';
    this.cssMonitor5.appendChild(this.cssMonitor5Instance.domElement);

    // Monitor 6 CSS3D Renderer
    this.cssMonitor6Instance = new CSS3DRenderer();
    this.cssMonitor6Instance.setSize(this.sizes.width, this.sizes.height);
    this.cssMonitor6Instance.domElement.style.position = 'absolute';
    this.cssMonitor6Instance.domElement.style.top = '0px';
    this.cssMonitor6Instance.domElement.style.pointerEvents = 'none';
    this.cssMonitor6.appendChild(this.cssMonitor6Instance.domElement);

    // Monitor 7 CSS3D Renderer
    this.cssMonitor7Instance = new CSS3DRenderer();
    this.cssMonitor7Instance.setSize(this.sizes.width, this.sizes.height);
    this.cssMonitor7Instance.domElement.style.position = 'absolute';
    this.cssMonitor7Instance.domElement.style.top = '0px';
    this.cssMonitor7Instance.domElement.style.pointerEvents = 'none';
    this.cssMonitor7.appendChild(this.cssMonitor7Instance.domElement);
  }

  resize() {
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(this.sizes.pixelRatio);

    // Resize CSS3D renderers - ALL DISABLED
    // this.cssMainMonitorInstance.setSize(this.sizes.width, this.sizes.height); // Not used
    // this.cssMonitor2Instance.setSize(this.sizes.width, this.sizes.height);
    // this.cssMonitor3Instance.setSize(this.sizes.width, this.sizes.height);
    // this.cssMonitor4Instance.setSize(this.sizes.width, this.sizes.height);
    // this.cssMonitor5Instance.setSize(this.sizes.width, this.sizes.height);
    // this.cssMonitor6Instance.setSize(this.sizes.width, this.sizes.height);
    // this.cssMonitor7Instance.setSize(this.sizes.width, this.sizes.height);
  }

  update() {
    // Render WebGL scene only
    this.instance.render(this.scene, this.camera.instance);

    // CSS3D rendering - ALL DISABLED
    // Main Monitor uses canvas texture, others not positioned yet
    /*
    this.cssMainMonitorInstance.render(
      this.cssMainMonitorScene,
      this.camera.instance
    );
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
