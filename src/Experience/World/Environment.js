import * as THREE from 'three';
import Experience from '../Experience.js';

export default class Environment {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;

    this.setLights();
  }

  setLights() {
    // Ambient light
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(this.ambientLight);

    // Directional light
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    this.directionalLight.position.set(10, 20, 10);
    this.directionalLight.castShadow = true;
    this.directionalLight.shadow.camera.left = -50;
    this.directionalLight.shadow.camera.right = 50;
    this.directionalLight.shadow.camera.top = 50;
    this.directionalLight.shadow.camera.bottom = -50;
    this.directionalLight.shadow.mapSize.width = 2048;
    this.directionalLight.shadow.mapSize.height = 2048;
    this.scene.add(this.directionalLight);

    // Additional lights
    const light2 = new THREE.DirectionalLight(0xffffff, 0.6);
    light2.position.set(-10, 10, -10);
    this.scene.add(light2);

    const light3 = new THREE.DirectionalLight(0xffffff, 0.4);
    light3.position.set(0, -10, 0);
    this.scene.add(light3);
  }
}
