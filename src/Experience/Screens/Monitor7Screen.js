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

    // Look for meshes with "screen" or "display" in the name first
    let screenMesh = null;
    this.monitorModel.traverse((child) => {
      if (child.isMesh) {
        const name = child.name.toLowerCase();
        if (name.includes('screen') || name.includes('display') || name.includes('monitor')) {
          console.log(`🎯 Found mesh with screen-like name: ${child.name}`);
          screenMesh = child;
        }
      }
    });

    // If no named screen found, try to find the largest mesh
    if (!screenMesh) {
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
        console.log(`✓ Found Monitor 7 screen mesh (largest): ${largestMesh.name} (${largestVertexCount} vertices)`);
        this.screenMesh = largestMesh;
      } else {
        console.warn('⚠ No screen mesh found in Monitor 7!');
      }
    } else {
      console.log(`✓ Using named screen mesh: ${screenMesh.name}`);
      this.screenMesh = screenMesh;
    }
  }

  setupScreen() {
    if (!this.screenMesh) {
      console.error('❌ Cannot setup screen - mesh not found');
      return;
    }

    console.log('🎨 Setting up canvas texture for Monitor 7 screen...');

    // Get the screen mesh's world position and rotation
    this.screenMesh.geometry.computeBoundingBox();
    const bbox = this.screenMesh.geometry.boundingBox;

    // Calculate dimensions
    const width = bbox.max.x - bbox.min.x;
    const height = bbox.max.y - bbox.min.y;
    const depth = bbox.max.z - bbox.min.z;

    console.log('📐 Original mesh dimensions:', { width, height, depth });

    // Determine which dimensions to use for the plane
    let planeWidth, planeHeight;
    if (width >= height && width >= depth) {
      if (height >= depth) {
        planeWidth = width;
        planeHeight = height;
        console.log('📐 Using XY plane for new screen');
      } else {
        planeWidth = width;
        planeHeight = depth;
        console.log('📐 Using XZ plane for new screen');
      }
    } else {
      planeWidth = height;
      planeHeight = depth;
      console.log('📐 Using YZ plane for new screen');
    }

    // Create a high-resolution canvas for the System Status screen
    const canvas = document.createElement('canvas');
    canvas.width = 1920;
    canvas.height = 1080;
    const ctx = canvas.getContext('2d');

    // SUPER SIMPLE TEST - Just colors and giant text
    // Black background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Giant red border to verify full canvas is visible
    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = 50;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    // MASSIVE text that's impossible to miss
    ctx.fillStyle = '#00ff00'; // Bright green
    ctx.font = 'bold 300px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Draw text with thick black outline for contrast
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 15;
    ctx.strokeText('ONLINE', canvas.width / 2, canvas.height / 2);
    ctx.fillText('ONLINE', canvas.width / 2, canvas.height / 2);

    console.log('✓ Canvas drawing complete for Monitor 7');

    // Create texture from canvas
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;

    // Set anisotropy if renderer is available
    if (this.renderer && this.renderer.instance) {
      texture.anisotropy = this.renderer.instance.capabilities.getMaxAnisotropy();
      console.log('✓ Texture anisotropy set:', texture.anisotropy);
    }

    console.log('✓ Texture created from canvas');

    // SOLUTION: Replace the mesh geometry with a perfect PlaneGeometry
    // Save the old material for disposal
    const oldMaterial = this.screenMesh.material;

    // Get world position and rotation
    const worldPos = new THREE.Vector3();
    const worldQuat = new THREE.Quaternion();
    const worldScale = new THREE.Vector3();
    this.screenMesh.getWorldPosition(worldPos);
    this.screenMesh.getWorldQuaternion(worldQuat);
    this.screenMesh.getWorldScale(worldScale);

    console.log('📐 Screen world position:', worldPos);
    console.log('📐 Screen world rotation:', worldQuat);

    // Create a NEW plane with perfect UVs
    const newGeometry = new THREE.PlaneGeometry(planeWidth, planeHeight, 1, 1);

    // Replace the geometry
    const oldGeometry = this.screenMesh.geometry;
    this.screenMesh.geometry = newGeometry;

    console.log('✓ Replaced mesh geometry with PlaneGeometry');
    console.log('✓ New plane dimensions:', planeWidth, 'x', planeHeight);

    // Create material with canvas texture
    this.screenMesh.material = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide,
      toneMapped: false,
      transparent: false
    });

    console.log('✓ Material applied with canvas texture');

    // Dispose old resources
    if (oldGeometry.dispose) oldGeometry.dispose();
    if (oldMaterial.dispose) oldMaterial.dispose();

    // Make visible
    this.screenMesh.visible = true;

    console.log('✓ Monitor 7 canvas screen setup complete!');
    console.log('🎯 Look for test pattern: gradient colors, grid, corner labels, and "MONITOR 7" text');
  }
}
