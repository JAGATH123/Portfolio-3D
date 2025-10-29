import * as THREE from 'three';
import { CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import Experience from '../Experience.js';

export default class Monitor4Screen {
  constructor(monitorModel) {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.cssScene = this.experience.cssMonitor4Scene;
    this.monitorModel = monitorModel;
    this.setupScreen();
  }

  setupScreen() {
    const container = document.createElement('div');
    container.style.width = '1920px';
    container.style.height = '1080px';
    container.style.background = 'black';

    const iframe = document.createElement('iframe');
    iframe.src = '/screens/monitor-4.html';
    iframe.style.width = '1920px';
    iframe.style.height = '1080px';
    iframe.style.border = 'none';
    container.appendChild(iframe);

    const css3DObject = new CSS3DObject(container);
    css3DObject.position.set(0, 2, 0);
    css3DObject.rotation.set(0, 0, 0);
    css3DObject.scale.set(0.001, 0.001, 0.001);
    this.cssScene.add(css3DObject);

    const geometry = new THREE.PlaneGeometry(1920, 1080);
    const material = new THREE.MeshLambertMaterial({
      color: 'black',
      opacity: 0,
      transparent: true,
      blending: THREE.NoBlending,
    });

    const screenPlane = new THREE.Mesh(geometry, material);
    screenPlane.position.copy(css3DObject.position);
    screenPlane.rotation.copy(css3DObject.rotation);
    screenPlane.scale.copy(css3DObject.scale);
    screenPlane.name = 'monitor4Screen';
    this.scene.add(screenPlane);
  }
}
