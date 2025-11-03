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

    console.log("🎨 Monitor 7 screen setup - waiting for instructions...");

    // Screen setup will be implemented here based on new approach
  }
}
