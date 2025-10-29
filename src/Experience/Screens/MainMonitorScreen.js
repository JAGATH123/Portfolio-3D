import * as THREE from 'three';
import Experience from '../Experience.js';
import { logAllMeshes } from '../Utils/DebugMeshes.js';

export default class MainMonitorScreen {
  constructor(monitorModel) {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.renderer = this.experience.renderer;
    this.raycaster = this.experience.raycaster;
    this.camera = this.experience.camera;
    this.monitorModel = monitorModel;
    this.screenMesh = null;
    this.isZoomedIn = false;

    this.findScreenMesh();
    this.setupScreen();
    this.setupInteraction();
  }

  findScreenMesh() {
    // Log ALL meshes to help find the screen mesh
    console.log('🔍 Searching for screen mesh in Main Monitor...');
    logAllMeshes(this.monitorModel, 'Main_Monitor_1');

    // Find the polySurface1077 mesh which is the screen
    this.monitorModel.traverse((child) => {
      if (child.isMesh && child.name === 'polySurface1077') {
        this.screenMesh = child;
        console.log('✓ Found Main Monitor screen mesh:', child.name);
      }
    });

    if (!this.screenMesh) {
      console.warn('⚠ Screen mesh polySurface1077 not found in Main Monitor!');
      console.warn('⚠ Check the console output above to find the correct mesh name');

      // Try to find the largest mesh as a fallback
      let largestMesh = null;
      let largestVertexCount = 0;

      this.monitorModel.traverse((child) => {
        if (child.isMesh) {
          const vertexCount = child.geometry.attributes.position.count;
          if (vertexCount > largestVertexCount) {
            largestVertexCount = vertexCount;
            largestMesh = child;
          }
        }
      });

      if (largestMesh) {
        console.log(`📍 Using largest mesh as fallback: ${largestMesh.name} (${largestVertexCount} vertices)`);
        this.screenMesh = largestMesh;
      }
    }
  }

  setupScreen() {
    if (!this.screenMesh) {
      console.error('❌ Cannot setup screen - mesh not found');
      return;
    }

    console.log('🎨 Setting up canvas texture for curved monitor screen...');

    // Create a high-resolution canvas for the screen content
    const canvas = document.createElement('canvas');
    canvas.width = 1920;
    canvas.height = 1080;
    const ctx = canvas.getContext('2d');

    // Draw gradient background (Windows 11 style - same as viewer.html)
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#1e3a8a');
    gradient.addColorStop(0.5, '#2563eb');
    gradient.addColorStop(1, '#3b82f6');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add Windows logo in center
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const logoSize = 400;

    // Windows 4-square logo
    ctx.fillRect(centerX - logoSize/2 - 20, centerY - logoSize/2 - 20, logoSize/2 - 10, logoSize/2 - 10);
    ctx.fillRect(centerX + 20, centerY - logoSize/2 - 20, logoSize/2 - 10, logoSize/2 - 10);
    ctx.fillRect(centerX - logoSize/2 - 20, centerY + 20, logoSize/2 - 10, logoSize/2 - 10);
    ctx.fillRect(centerX + 20, centerY + 20, logoSize/2 - 10, logoSize/2 - 10);

    // Add welcome text
    ctx.fillStyle = 'white';
    ctx.font = 'bold 100px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Welcome to My Portfolio', canvas.width / 2, 200);

    ctx.font = '50px Arial';
    ctx.fillText('Full Stack Developer', canvas.width / 2, 900);

    // Taskbar at bottom
    const taskbarHeight = 72;
    ctx.fillStyle = 'rgba(20, 20, 20, 0.8)';
    ctx.fillRect(0, canvas.height - taskbarHeight, canvas.width, taskbarHeight);

    // Time
    ctx.fillStyle = 'white';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'right';
    ctx.fillText('12:00 PM', canvas.width - 30, canvas.height - 38);

    console.log('✓ Canvas drawing complete');

    // Create texture from canvas
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;

    // Set anisotropy if renderer is available
    if (this.renderer && this.renderer.instance) {
      texture.anisotropy = this.renderer.instance.capabilities.getMaxAnisotropy();
      console.log('✓ Texture anisotropy set:', texture.anisotropy);
    } else {
      console.warn('⚠ Renderer not available yet, skipping anisotropy');
    }

    console.log('✓ Texture created from canvas');

    // Store old material for debugging
    const oldMaterial = this.screenMesh.material;
    console.log('Old material type:', oldMaterial.type);
    console.log('Old material color:', oldMaterial.color);

    // Apply texture to the CURVED screen mesh
    // Using MeshBasicMaterial for maximum brightness (not affected by lights)
    this.screenMesh.material = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide,
      toneMapped: false
    });

    console.log('✓ New material applied to screen mesh:', this.screenMesh.name);
    console.log('✓ New material type:', this.screenMesh.material.type);
    console.log('✓ Material has map:', !!this.screenMesh.material.map);
    console.log('✓ Texture width x height:', texture.image.width, 'x', texture.image.height);

    // Dispose old material
    if (oldMaterial.dispose) {
      oldMaterial.dispose();
    }

    // Make screen mesh visible
    this.screenMesh.visible = true;

    // Force material update
    this.screenMesh.material.needsUpdate = true;

    // Store reference globally for debugging
    window.mainScreenMesh = this.screenMesh;
    window.mainScreenTexture = texture;
    console.log('💡 Debug tip: Access screen mesh via window.mainScreenMesh');
    console.log('💡 Debug tip: Access texture via window.mainScreenTexture');

    console.log('✓ Main Monitor canvas screen setup complete!');
  }

  // Test method to change material to solid color (for debugging)
  testSolidColor(color = 0xff0000) {
    if (!this.screenMesh) return;

    this.screenMesh.material = new THREE.MeshBasicMaterial({
      color: color,
      side: THREE.DoubleSide
    });
    console.log('🎨 Changed to solid color:', color);
  }

  setupInteraction() {
    if (!this.monitorModel) return;

    // Register click handler for the entire main monitor model
    this.raycaster.registerClickHandler('Main_Monitor_1', () => {
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

  // Optional: Update canvas content dynamically
  updateContent(updateFunction) {
    if (!this.screenMesh || !this.screenMesh.material.map) return;

    const canvas = this.screenMesh.material.map.image;
    const ctx = canvas.getContext('2d');

    if (updateFunction) {
      updateFunction(ctx, canvas);
    }

    this.screenMesh.material.map.needsUpdate = true;
  }
}
