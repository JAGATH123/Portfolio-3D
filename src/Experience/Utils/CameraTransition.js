import * as THREE from 'three';

export default class CameraTransition {
  constructor(camera, controls) {
    this.camera = camera;
    this.controls = controls;
    this.isAnimating = false;
    this.originalPosition = new THREE.Vector3();
    this.originalTarget = new THREE.Vector3();
  }

  animateToTarget(targetPosition, targetLookAt, duration = 1000, onComplete = null) {
    if (this.isAnimating) return;

    this.isAnimating = true;

    // Save original position
    this.originalPosition.copy(this.camera.position);
    this.originalTarget.copy(this.controls.target);

    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (smooth in-out)
      const eased = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      // Interpolate position
      this.camera.position.lerpVectors(this.originalPosition, targetPosition, eased);
      this.controls.target.lerpVectors(this.originalTarget, targetLookAt, eased);
      this.controls.update();

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        this.isAnimating = false;
        if (onComplete) onComplete();
      }
    };

    animate();
  }

  zoomToObject(object, paddingFactor = 1.5) {
    // Calculate bounding box
    const box = new THREE.Box3().setFromObject(object);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    // Calculate camera distance
    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = this.camera.fov * (Math.PI / 180);
    let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
    cameraZ *= paddingFactor;

    // Position camera in front of object
    const targetPosition = new THREE.Vector3(
      center.x,
      center.y,
      center.z + cameraZ
    );

    this.animateToTarget(targetPosition, center, 1000);
  }

  reset() {
    this.animateToTarget(this.originalPosition, this.originalTarget, 1000);
  }
}
