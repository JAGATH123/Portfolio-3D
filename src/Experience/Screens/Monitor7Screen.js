import * as THREE from "three";
import Experience from "../Experience.js";
import { logAllMeshes } from "../Utils/DebugMeshes.js";

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
    console.log("🔍 Searching for screen mesh in Monitor 7...");
    logAllMeshes(this.monitorModel, "Monitor_7");

    // Look for meshes with "screen" or "display" in the name first
    let screenMesh = null;
    this.monitorModel.traverse((child) => {
      if (child.isMesh) {
        const name = child.name.toLowerCase();
        if (
          name.includes("screen") ||
          name.includes("display") ||
          name.includes("monitor")
        ) {
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
        console.log(
          `✓ Found Monitor 7 screen mesh (largest): ${largestMesh.name} (${largestVertexCount} vertices)`
        );
        this.screenMesh = largestMesh;
      } else {
        console.warn("⚠ No screen mesh found in Monitor 7!");
      }
    } else {
      console.log(`✓ Using named screen mesh: ${screenMesh.name}`);
      this.screenMesh = screenMesh;
    }
  }

  setupScreen() {
    if (!this.screenMesh) {
      console.error("❌ Cannot setup screen - mesh not found");
      return;
    }

    console.log("🎨 Setting up canvas texture for Monitor 7 screen...");

    // Create a high-resolution canvas for the System Status screen
    const canvas = document.createElement("canvas");
    canvas.width = 1920;
    canvas.height = 1080;
    const ctx = canvas.getContext("2d");

    // System Status Terminal Screen
    // Dark blue background
    ctx.fillStyle = "#0a0e27";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Green border
    ctx.strokeStyle = "#00ff41";
    ctx.lineWidth = 20;
    ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);

    // Title
    ctx.fillStyle = "#00ff41";
    ctx.font = "bold 180px 'Courier New'";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.shadowColor = "#00ff41";
    ctx.shadowBlur = 30;
    ctx.fillText("SYSTEM STATUS", canvas.width / 2, 150);
    ctx.shadowBlur = 0;

    // Terminal content
    ctx.textAlign = "left";
    ctx.font = "bold 90px 'Courier New'";
    const padding = 150;
    let yPos = 450;
    const lineHeight = 120;

    ctx.fillText("$ npm run portfolio", padding, yPos);
    yPos += lineHeight;
    ctx.fillText("Loading system...", padding, yPos);
    yPos += lineHeight + 40;

    // Status - highlighted
    ctx.fillStyle = "#00ff00";
    ctx.font = "bold 110px 'Courier New'";
    ctx.shadowBlur = 20;
    ctx.fillText("STATUS: ONLINE", padding, yPos);
    ctx.shadowBlur = 0;
    yPos += lineHeight + 40;

    // System info
    ctx.fillStyle = "#00ff41";
    ctx.font = "bold 80px 'Courier New'";
    ctx.fillText("Uptime: 99.9%", padding, yPos);
    yPos += lineHeight;
    ctx.fillText("Projects: 15+", padding, yPos);
    yPos += lineHeight;
    ctx.fillText("Coffee: ∞", padding, yPos);
    yPos += lineHeight + 50;

    // Cursor
    ctx.font = "bold 90px 'Courier New'";
    ctx.fillText("$ _", padding, yPos);

    console.log("Canvas drawing complete for Monitor 7");

    // Create texture from canvas
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;

    // Set anisotropy if renderer is available
    if (this.renderer && this.renderer.instance) {
      texture.anisotropy =
        this.renderer.instance.capabilities.getMaxAnisotropy();
      console.log("Texture anisotropy set:", texture.anisotropy);
    }

    console.log("Texture created from canvas");

    // Hide original mesh (has bad UVs - only shows borders)
    this.screenMesh.visible = false;

    // Get bounding box for size
    this.screenMesh.geometry.computeBoundingBox();
    const bbox = this.screenMesh.geometry.boundingBox;
    const width = bbox.max.x - bbox.min.x;
    const height = bbox.max.y - bbox.min.y;

    // Get world position of original mesh
    const worldPos = new THREE.Vector3();
    const worldQuat = new THREE.Quaternion();
    this.screenMesh.getWorldPosition(worldPos);
    this.screenMesh.getWorldQuaternion(worldQuat);

    console.log("📐 Original mesh world position:", worldPos);

    // Create NEW plane with perfect UVs (reduced size)
    const planeGeometry = new THREE.PlaneGeometry(width * 0.03, height * 0.03);
    const planeMaterial = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide,
      toneMapped: false,
    });

    const newScreen = new THREE.Mesh(planeGeometry, planeMaterial);
    this.scene.add(newScreen);

    // ⭐ ADJUST THESE VALUES TO POSITION THE SCREEN ⭐
    const xOffset = 5; // Move left (-) or right (+)
    const yOffset = 23.1; // Move down (-) or up (+)
    const zOffset = -14.3; // Move back (-) or forward (+)

    newScreen.position.set(
      worldPos.x + xOffset,
      worldPos.y + yOffset,
      worldPos.z + zOffset
    );

    newScreen.setRotationFromQuaternion(worldQuat);

    // ⭐ ADJUST THESE VALUES TO TILT/ROTATE THE SCREEN IN 3D ⭐
    const xRotation = 0; // Tilt up (-) or down (+) in radians
    const yRotation = 0; // Rotate left (-) or right (+) in radians
    const zRotation = 0; // Roll left (-) or right (+) in radians

    // Apply additional rotation (Math.PI = 180°, Math.PI/2 = 90°, Math.PI/4 = 45°)
    newScreen.rotation.x += xRotation;
    newScreen.rotation.y += yRotation;
    newScreen.rotation.z += zRotation;

    this.newScreenMesh = newScreen;

    console.log("✓ New screen created at position:", newScreen.position);
    console.log("✓ Screen rotation:", newScreen.rotation);
    console.log("💡 Edit xOffset, yOffset, zOffset to adjust position!");
    console.log("💡 Edit xRotation, yRotation, zRotation to tilt the screen!");
  }
}
