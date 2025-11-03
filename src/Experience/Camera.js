import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Experience from './Experience.js';
import CameraTransition from './Utils/CameraTransition.js';

export default class Camera {
  constructor() {
    this.experience = new Experience();
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.canvas = this.experience.canvas;

    this.setInstance();
    this.setControls();
    this.setTransition();
  }

  setTransition() {
    this.transition = new CameraTransition(this.instance, this.controls);
  }

  setInstance() {
    this.instance = new THREE.PerspectiveCamera(
      45,
      this.sizes.width / this.sizes.height,
      0.1,
      1000
    );
    // Position camera for full room view - centered, higher up, and much further back
    this.instance.position.set(0, 15, 35);
    this.scene.add(this.instance);
    console.log('✓ Camera positioned at (0, 15, 35) for zoomed out full room view');
  }

  setControls() {
    this.controls = new OrbitControls(this.instance, this.canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.minDistance = 10;
    this.controls.maxDistance = 100;

    // Restrict horizontal rotation - very tight limits to lock left and right sides
    this.controls.minAzimuthAngle = -Math.PI / 6; // -30 degrees
    this.controls.maxAzimuthAngle = Math.PI / 6;  // +30 degrees

    // Restrict vertical rotation - prevent looking too far up or down
    this.controls.minPolarAngle = Math.PI / 6;    // 30 degrees (limit looking up)
    this.controls.maxPolarAngle = Math.PI / 2.5;  // ~72 degrees (limit looking down)

    console.log('✓ Camera rotation locked to front view only (±30° horizontal, 30°-72° vertical)');
    console.log('✓ Zoom limits: 10-100 units');
  }

  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height;
    this.instance.updateProjectionMatrix();
  }

  update() {
    this.controls.update();
  }
}
