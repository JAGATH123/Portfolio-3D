import * as THREE from 'three';
import Experience from '../Experience.js';

export default class Raycaster {
  constructor() {
    this.experience = new Experience();
    this.camera = this.experience.camera;
    this.scene = this.experience.scene;
    this.canvas = this.experience.canvas;

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.clickHandlers = new Map();

    this.setupEvents();
  }

  setupEvents() {
    this.canvas.addEventListener('click', (event) => {
      this.onMouseClick(event);
    });
  }

  onMouseClick(event) {
    // Calculate mouse position in normalized device coordinates
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Update raycaster
    this.raycaster.setFromCamera(this.mouse, this.camera.instance);

    // Check for intersections
    const intersects = this.raycaster.intersectObjects(this.scene.children, true);

    if (intersects.length > 0) {
      const clickedObject = intersects[0].object;
      console.log('Clicked object:', clickedObject.name);

      // Find the root object or named parent
      let targetObject = clickedObject;
      while (targetObject.parent && !this.clickHandlers.has(targetObject.name)) {
        targetObject = targetObject.parent;
        if (targetObject === this.scene) break;
      }

      // Execute click handler if registered
      if (this.clickHandlers.has(targetObject.name)) {
        this.clickHandlers.get(targetObject.name)(targetObject, intersects[0]);
      }
    }
  }

  registerClickHandler(objectName, handler) {
    this.clickHandlers.set(objectName, handler);
    console.log(`✓ Registered click handler for: ${objectName}`);
  }

  unregisterClickHandler(objectName) {
    this.clickHandlers.delete(objectName);
  }
}
