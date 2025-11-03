import * as THREE from 'three';
import Experience from '../Experience.js';

export default class MainMonitorScreen {
  constructor(monitorModel) {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.camera = this.experience.camera;
    this.monitorModel = monitorModel;
    this.screenMesh = null;
    this.canvas = null;
    this.canvasTexture = null;
    this.isZoomedIn = false;

    this.findScreenMesh();
    this.setupScreen();
    this.setupInteraction();
  }

  findScreenMesh() {
    console.log('🔍 Searching for screen mesh in Main Monitor...');

    // Look for Main_Monitor - the curved screen (in UV file)
    // or polySurface1077 (in original file)
    this.monitorModel.traverse((child) => {
      if (child.isMesh && (child.name === 'Main_Monitor' || child.name === 'polySurface1077')) {
        console.log('✓ Found Main Monitor screen mesh:', child.name);
        this.screenMesh = child;
      }
    });

    if (!this.screenMesh) {
      console.error('❌ Screen mesh not found in Main Monitor!');
      console.log('Available meshes:');
      this.monitorModel.traverse((child) => {
        if (child.isMesh) {
          console.log(`  - ${child.name}`);
        }
      });
    }
  }

  setupScreen() {
    if (!this.screenMesh) {
      console.error('❌ Cannot setup screen - mesh not found');
      return;
    }

    console.log('🎨 Setting up Canvas Texture for Main Monitor curved screen...');
    console.log('📐 Screen mesh geometry:', this.screenMesh.geometry);
    console.log('📐 Has UVs:', !!this.screenMesh.geometry.attributes.uv);

    // Create canvas with proper UV unwrapping
    this.canvas = document.createElement('canvas');
    this.canvas.width = 1024;
    this.canvas.height = 512;

    const ctx = this.canvas.getContext('2d');

    // Flip canvas horizontally to fix mirrored text
    ctx.translate(this.canvas.width, 0);
    ctx.scale(-1, 1);

    // Fill entire canvas with dark background
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Fill with dark background
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Visible area: Cell 3 (yellow) - middle row, left column
    // Cell 3 position: X: 0-341, Y: 171-341
    // Center of cell 3: X: 170, Y: 256
    const cellW = this.canvas.width / 3;
    const cellH = this.canvas.height / 3;

    const visibleX = cellW / 2; // Center of left column (170)
    const visibleY = cellH + (cellH / 2); // Center of middle row (256)

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Portfolio content in cell 3 (yellow area) - smaller to fit
    ctx.fillStyle = '#ff4757';
    ctx.font = 'bold 28px Arial';
    ctx.fillText('PORTFOLIO', visibleX, visibleY - 45);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px Arial';
    ctx.fillText('3D Experience', visibleX, visibleY);

    ctx.fillStyle = '#2ed573';
    ctx.font = '18px Arial';
    ctx.fillText('Click to Explore', visibleX, visibleY + 40);

    // Create Three.js texture from canvas
    this.canvasTexture = new THREE.CanvasTexture(this.canvas);
    this.canvasTexture.needsUpdate = true;

    // Flip texture vertically since it's upside down
    this.canvasTexture.flipY = true; // Flip to correct orientation
    this.canvasTexture.wrapS = THREE.ClampToEdgeWrapping;
    this.canvasTexture.wrapT = THREE.ClampToEdgeWrapping;

    // Store original material for reference
    console.log('📐 Original material:', this.screenMesh.material);

    // Apply texture to screen mesh with emissive for visibility
    this.screenMesh.material = new THREE.MeshBasicMaterial({
      map: this.canvasTexture,
      side: THREE.DoubleSide,
    });

    console.log('✓ Canvas texture applied!');

    console.log('✓ Canvas texture applied to curved screen!');
    console.log('✓ Texture size:', this.canvas.width, 'x', this.canvas.height);
  }

  setupInteraction() {
    if (!this.monitorModel) return;

    // Register click handler for the entire main monitor model
    this.experience.raycaster.registerClickHandler('Main_Monitor_1', () => {
      this.toggleZoom();
    });

    console.log('✓ Main Monitor click handler registered');
  }

  toggleZoom() {
    if (!this.monitorModel) return;

    if (!this.isZoomedIn) {
      // Zoom to monitor
      console.log('🎯 Zooming to Main Monitor...');
      this.camera.transition.zoomToObject(this.monitorModel, 0.8);
      this.isZoomedIn = true;
    } else {
      // Zoom back out
      console.log('🔙 Zooming out from Main Monitor...');
      this.camera.transition.reset();
      this.isZoomedIn = false;
    }
  }

  // Method to update canvas content (can be called to change what's displayed)
  updateContent(drawFunction) {
    if (!this.canvas) return;

    const ctx = this.canvas.getContext('2d');

    // Clear canvas
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Call custom draw function
    drawFunction(ctx, this.canvas.width, this.canvas.height);

    // Update texture
    this.canvasTexture.needsUpdate = true;
  }
}
