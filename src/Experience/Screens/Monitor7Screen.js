import * as THREE from 'three';
import Experience from '../Experience.js';
import { logAllMeshes } from '../Utils/DebugMeshes.js';

export default class Monitor7Screen {
  constructor(monitorModel) {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.renderer = this.experience.renderer;
    this.monitorModel = monitorModel;
    this.screenMesh = null;

    this.findScreenMesh();
    this.setupScreen();
  }

  findScreenMesh() {
    // Log ALL meshes to help find the screen mesh
    console.log('🔍 Searching for screen mesh in Monitor 7...');
    logAllMeshes(this.monitorModel, 'Monitor_7');

    // Try to find the largest mesh as the screen (same approach as Main Monitor)
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
      console.log(`✓ Found Monitor 7 screen mesh: ${largestMesh.name} (${largestVertexCount} vertices)`);
      this.screenMesh = largestMesh;
    } else {
      console.warn('⚠ No screen mesh found in Monitor 7!');
    }
  }

  setupScreen() {
    if (!this.screenMesh) {
      console.error('❌ Cannot setup screen - mesh not found');
      return;
    }

    console.log('🎨 Setting up canvas texture for Monitor 7 screen...');

    // Create a high-resolution canvas for the System Status screen
    const canvas = document.createElement('canvas');
    canvas.width = 1920;
    canvas.height = 1080;
    const ctx = canvas.getContext('2d');

    // Draw System Status screen (terminal style)
    ctx.fillStyle = '#0a0e27'; // Dark blue background
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Title
    ctx.fillStyle = '#00ff41'; // Green text
    ctx.font = 'bold 80px "Courier New"';
    ctx.textAlign = 'center';
    ctx.shadowColor = '#00ff41';
    ctx.shadowBlur = 10;
    ctx.fillText('SYSTEM STATUS', canvas.width / 2, 150);
    ctx.shadowBlur = 0;

    // Terminal box
    const boxX = 200;
    const boxY = 250;
    const boxWidth = canvas.width - 400;
    const boxHeight = 700;

    ctx.strokeStyle = '#00ff41';
    ctx.lineWidth = 3;
    ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

    // Terminal content
    ctx.fillStyle = '#00ff41';
    ctx.font = '40px "Courier New"';
    ctx.textAlign = 'left';

    let yPos = boxY + 80;
    const lineHeight = 70;

    ctx.fillText('$ npm run portfolio', boxX + 50, yPos);
    yPos += lineHeight;
    ctx.fillText('Loading portfolio system...', boxX + 50, yPos);
    yPos += lineHeight;

    ctx.fillStyle = '#00ff00'; // Brighter green for status
    ctx.fillText('Status: ONLINE', boxX + 50, yPos);
    yPos += lineHeight;

    ctx.fillStyle = '#00ff41';
    ctx.fillText('Uptime: 99.9%', boxX + 50, yPos);
    yPos += lineHeight;
    ctx.fillText('Projects: 15+', boxX + 50, yPos);
    yPos += lineHeight;
    ctx.fillText('Coffee consumed: ∞', boxX + 50, yPos);
    yPos += lineHeight + 30;

    // Cursor
    ctx.fillText('$ _', boxX + 50, yPos);

    console.log('✓ Canvas drawing complete for Monitor 7');

    // Create texture from canvas
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;

    // Set anisotropy if renderer is available
    if (this.renderer && this.renderer.instance) {
      texture.anisotropy = this.renderer.instance.capabilities.getMaxAnisotropy();
      console.log('✓ Texture anisotropy set:', texture.anisotropy);
    }

    console.log('✓ Texture created from canvas');

    // Apply texture to the screen mesh
    this.screenMesh.material = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide,
      toneMapped: false
    });

    console.log('✓ Material applied to Monitor 7 screen mesh:', this.screenMesh.name);
    console.log('✓ Material has map:', !!this.screenMesh.material.map);

    // Make screen mesh visible
    this.screenMesh.visible = true;

    console.log('✓ Monitor 7 canvas screen setup complete!');
  }
}
