import * as THREE from "three";
import Experience from "../Experience.js";
import MainMonitorScreen from "../Screens/MainMonitorScreen.js";
import Monitor7Screen from "../Screens/Monitor7Screen.js";

export default class Models {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.time = this.experience.time;

    // Animation properties
    this.mixer = null;
    this.animations = {};

    this.setModels();
    this.setupScreens();
  }

  setModels() {
    // Room Window
    this.roomWindow = this.resources.items.roomWindow;
    this.roomWindow.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          child.material.side = THREE.DoubleSide;
        }
      }
    });
    this.scene.add(this.roomWindow);

    // Rolling Chair with Animation
    this.rollingChair = this.resources.items.rollingChair;

    // Setup animation mixer
    if (
      this.rollingChair.animations &&
      this.rollingChair.animations.length > 0
    ) {
      this.mixer = new THREE.AnimationMixer(this.rollingChair);

      console.log(
        "🎬 Found",
        this.rollingChair.animations.length,
        "animations in chair"
      );

      // Play all animations
      this.rollingChair.animations.forEach((clip, index) => {
        const action = this.mixer.clipAction(clip);
        action.play();
        console.log(
          `✓ Playing animation ${index + 1}:`,
          clip.name,
          `(${clip.duration.toFixed(2)}s)`
        );
      });
    } else {
      console.warn("⚠ No animations found in rolling chair");
    }

    // Apply materials and shadows
    this.rollingChair.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          child.material.side = THREE.DoubleSide;
        }
      }
    });

    // Scale down and position the chair inside the room
    // Reduce scale to match room proportions
    const chairScale = 0.03; // 1.5% of original size - perfect size
    this.rollingChair.scale.set(chairScale, chairScale, chairScale);

    // Position chair in front of Main Monitor
    // Main Monitor is at (0, 0, 0), so chair should be pulled back (negative Z)
    this.rollingChair.position.set(3, 0.03, -5); // x=0 (centered), y=-3 (on ground), z=-1.5 (in front of monitor)
    this.rollingChair.rotation.set(0, -1, 0);

    this.scene.add(this.rollingChair);
    console.log("Rolling chair added to scene");
    console.log("Position:", this.rollingChair.position);
    console.log("Rotation:", this.rollingChair.rotation);
    console.log("Scale:", this.rollingChair.scale);

    // Load CPU Animation
    this.cpuAnimation = this.resources.items.cpuAnimation;

    // Check if CPU model loaded successfully
    console.log("🔍 Checking CPU Animation from resources:", this.cpuAnimation);

    if (this.cpuAnimation) {
      console.log("✓ CPU Animation loaded successfully");
      console.log("📦 CPU Model structure:", {
        type: this.cpuAnimation.type,
        hasAnimations: !!(this.cpuAnimation.animations && this.cpuAnimation.animations.length > 0),
        animationCount: this.cpuAnimation.animations ? this.cpuAnimation.animations.length : 0,
        children: this.cpuAnimation.children.length
      });

      // Fix SkinnedMesh bones - CRITICAL for preventing matrixWorld error
      // testNew.fbx has SkinnedMeshes with valid bones but frustumCulled enabled
      let skinnedMeshCount = 0;
      let validSkinnedCount = 0;
      let convertedCount = 0;
      const meshesToConvert = [];

      this.cpuAnimation.traverse((child) => {
        if (child.isSkinnedMesh) {
          skinnedMeshCount++;
          console.log("🦴 Found SkinnedMesh:", child.name);

          // Check if skeleton has bones
          const hasBones = child.skeleton && child.skeleton.bones && child.skeleton.bones.length > 0;

          if (!hasBones) {
            // This SkinnedMesh has NO bones - it's broken!
            console.warn(`  ⚠️ SkinnedMesh has 0 bones - will convert to regular Mesh`);
            meshesToConvert.push(child);
          } else {
            // Valid SkinnedMesh with bones
            validSkinnedCount++;
            console.log(`  ✓ Valid skeleton with ${child.skeleton.bones.length} bone(s)`);

            // CRITICAL FIX: Disable frustum culling to prevent matrixWorld errors
            child.frustumCulled = false;
            console.log(`  ✓ Disabled frustum culling`);

            // Update skeleton
            child.skeleton.update();
          }
        }
      });

      // Convert broken SkinnedMeshes (with 0 bones) to regular Meshes
      meshesToConvert.forEach((skinnedMesh) => {
        console.log(`🔧 Converting ${skinnedMesh.name} to regular Mesh...`);

        // Create a regular Mesh with the same geometry and material
        const regularMesh = new THREE.Mesh(skinnedMesh.geometry, skinnedMesh.material);

        // Copy transform properties
        regularMesh.position.copy(skinnedMesh.position);
        regularMesh.rotation.copy(skinnedMesh.rotation);
        regularMesh.scale.copy(skinnedMesh.scale);
        regularMesh.name = skinnedMesh.name;

        // Copy other properties
        regularMesh.castShadow = skinnedMesh.castShadow;
        regularMesh.receiveShadow = skinnedMesh.receiveShadow;
        regularMesh.visible = skinnedMesh.visible;

        // Replace in parent
        if (skinnedMesh.parent) {
          const parent = skinnedMesh.parent;
          const index = parent.children.indexOf(skinnedMesh);
          parent.children[index] = regularMesh;
          regularMesh.parent = parent;
        }

        convertedCount++;
      });

      // Summary
      if (convertedCount > 0) {
        console.log(`✅ Converted ${convertedCount} broken SkinnedMesh(es) to regular Meshes`);
      }

      if (skinnedMeshCount > 0) {
        console.log(`✓ Processed ${skinnedMeshCount} SkinnedMesh(es):`);
        console.log(`  - Valid (with bones): ${validSkinnedCount}`);
        console.log(`  - Converted (no bones): ${convertedCount}`);
      } else {
        console.log("ℹ️ No SkinnedMeshes found - model is static geometry");
      }

      // Setup animation mixer for CPU
      if (
        this.cpuAnimation.animations &&
        this.cpuAnimation.animations.length > 0
      ) {
        this.cpuMixer = new THREE.AnimationMixer(this.cpuAnimation);

        console.log(
          "🎬 Found",
          this.cpuAnimation.animations.length,
          "animations in CPU"
        );

        // Play all animations
        this.cpuAnimation.animations.forEach((clip, index) => {
          const action = this.cpuMixer.clipAction(clip);
          action.play();
          console.log(
            `✓ Playing CPU animation ${index + 1}:`,
            clip.name,
            `(${clip.duration.toFixed(2)}s)`
          );
        });
      } else {
        console.warn("⚠ No animations found in CPU - model will be static");
      }

      // Apply materials and shadows
      this.cpuAnimation.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          if (child.material) {
            child.material.side = THREE.DoubleSide;
          }
        }
      });

      // Position and scale CPU like other models (monitors are at origin with scale 1)
      // All models in Room_Window.fbx are positioned at origin
      this.cpuAnimation.position.set(1.3, 0, 0); // Same as monitors - origin
      this.cpuAnimation.rotation.set(0, 0, 0);
      this.cpuAnimation.scale.set(0.03, 0.03, 0.03); // Reduce to 3% of original size

      this.scene.add(this.cpuAnimation);
      console.log("✓ CPU Animation added to scene");
      console.log("📐 CPU Position:", this.cpuAnimation.position);
      console.log("📐 CPU Rotation:", this.cpuAnimation.rotation);
      console.log("📐 CPU Scale:", this.cpuAnimation.scale);
    } else {
      console.error(
        "❌ CPU Animation failed to load! Check if CPUAnimation_1.fbx exists in public folder"
      );
    }

    // Store monitor models
    this.mainMonitor = this.resources.items.mainMonitor;
    this.mainMonitor.name = "Main_Monitor_1"; // Set name for raycasting

    // Fix scale for UV file - the original file has scale 0.0328 baked in
    // The UV file is exported at 1.0 scale, so we need to match it
    const originalScale = 0.03280839895013123;
    if (this.mainMonitor.scale.x === 1 && this.mainMonitor.scale.y === 1 && this.mainMonitor.scale.z === 1) {
      // This is the UV file - apply the same scale as original
      this.mainMonitor.scale.set(originalScale, originalScale, originalScale);
      console.log('✓ Applied scale correction to UV file:', originalScale);
    }

    console.log('🖥️ Main Monitor loaded:', this.mainMonitor);
    console.log('📍 Position:', this.mainMonitor.position);
    console.log('📏 Scale:', this.mainMonitor.scale);

    // Calculate bounding box after scaling
    const bbox = new THREE.Box3().setFromObject(this.mainMonitor);
    const size = bbox.getSize(new THREE.Vector3());
    const center = bbox.getCenter(new THREE.Vector3());
    console.log('📦 Bounding box size:', size);
    console.log('📍 Bounding box center:', center);

    console.log('📦 Main Monitor structure:');
    this.mainMonitor.traverse((child) => {
      if (child.isMesh) {
        console.log(`  - Mesh: ${child.name}, vertices: ${child.geometry.attributes.position.count}`);
      }
    });

    this.monitor2 = this.resources.items.monitor2;
    this.monitor2.name = "Monitor_2";

    this.monitor3 = this.resources.items.monitor3;
    this.monitor3.name = "Monitor_3";

    this.monitor4 = this.resources.items.monitor4;
    this.monitor4.name = "Monitor_4";

    this.monitor5 = this.resources.items.monitor5;
    this.monitor5.name = "Monitor_5";

    this.monitor6 = this.resources.items.monitor6;
    this.monitor6.name = "Monitor_6";

    this.monitor7 = this.resources.items.monitor7;
    this.monitor7.name = "Monitor_7";

    // Load Asset.fbx
    this.asset = this.resources.items.asset;
    if (this.asset) {
      console.log("📦 Loading Asset.fbx...");

      // Apply materials and shadows
      this.asset.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          if (child.material) {
            child.material.side = THREE.DoubleSide;
          }
        }
      });

      // Check for animations
      if (this.asset.animations && this.asset.animations.length > 0) {
        console.log(`✓ Asset has ${this.asset.animations.length} animation(s)`);
        this.assetMixer = new THREE.AnimationMixer(this.asset);

        this.asset.animations.forEach((clip, index) => {
          const action = this.assetMixer.clipAction(clip);
          action.play();
          console.log(`✓ Playing Asset animation ${index + 1}: ${clip.name}`);
        });
      }

      // Position and scale to fit in the room
      // Adjusting position to close the gap and align properly
      this.asset.position.set(0, 0, -1.5); // Moved slightly backward to close gap
      this.asset.rotation.set(0, 0, 0); // No rotation - original orientation
      this.asset.scale.set(0.03, 0.03, 0.03); // Scale to 3% (same as CPU)

      this.scene.add(this.asset);
      console.log("✓ Asset.fbx added to scene");
      console.log("📐 Asset Position:", this.asset.position);
      console.log("📐 Asset Scale:", this.asset.scale);
    } else {
      console.warn("⚠ Asset.fbx not loaded");
    }

    // Load J_A_T_Wires.fbx
    this.jatWires = this.resources.items.jatWires;
    if (this.jatWires) {
      console.log("🔌 Loading J_A_T_Wires.fbx...");

      // Apply materials and shadows
      this.jatWires.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          if (child.material) {
            child.material.side = THREE.DoubleSide;
          }
        }
      });

      // Position and scale to fit in the room
      this.jatWires.position.set(0, 0, -2); // At origin
      this.jatWires.rotation.set(0, 0, 0);
      this.jatWires.scale.set(0.03, 0.03, 0.03); // Scale to 3% to fit room (same as CPU/Asset)

      this.scene.add(this.jatWires);
      console.log("✓ J_A_T_Wires.fbx added to scene");
      console.log("📐 Wires Position:", this.jatWires.position);
      console.log("📐 Wires Scale:", this.jatWires.scale);
    } else {
      console.warn("⚠ J_A_T_Wires.fbx not loaded");
    }

    // Load Mini_F Anim.fbx
    this.miniFAnim = this.resources.items.miniFAnim;
    if (this.miniFAnim) {
      console.log("🎬 Loading Mini_F Anim.fbx...");

      // Fix SkinnedMesh bones - CRITICAL for preventing matrixWorld error
      let skinnedMeshCount = 0;
      let validSkinnedCount = 0;
      let convertedCount = 0;
      const meshesToConvert = [];

      this.miniFAnim.traverse((child) => {
        if (child.isSkinnedMesh) {
          skinnedMeshCount++;
          console.log("🦴 Found SkinnedMesh in Mini_F:", child.name);

          // Check if skeleton has bones
          const hasBones = child.skeleton && child.skeleton.bones && child.skeleton.bones.length > 0;

          if (!hasBones) {
            // This SkinnedMesh has NO bones - it's broken!
            console.warn(`  ⚠️ SkinnedMesh has 0 bones - will convert to regular Mesh`);
            meshesToConvert.push(child);
          } else {
            // Valid SkinnedMesh with bones
            validSkinnedCount++;
            console.log(`  ✓ Valid skeleton with ${child.skeleton.bones.length} bone(s)`);

            // CRITICAL FIX: Disable frustum culling to prevent matrixWorld errors
            child.frustumCulled = false;
            console.log(`  ✓ Disabled frustum culling`);

            // Update skeleton
            child.skeleton.update();
          }
        }
      });

      // Convert broken SkinnedMeshes (with 0 bones) to regular Meshes
      meshesToConvert.forEach((skinnedMesh) => {
        console.log(`🔧 Converting ${skinnedMesh.name} to regular Mesh...`);

        // Create a regular Mesh with the same geometry and material
        const regularMesh = new THREE.Mesh(skinnedMesh.geometry, skinnedMesh.material);

        // Copy transform properties
        regularMesh.position.copy(skinnedMesh.position);
        regularMesh.rotation.copy(skinnedMesh.rotation);
        regularMesh.scale.copy(skinnedMesh.scale);
        regularMesh.name = skinnedMesh.name;

        // Copy other properties
        regularMesh.castShadow = skinnedMesh.castShadow;
        regularMesh.receiveShadow = skinnedMesh.receiveShadow;
        regularMesh.visible = skinnedMesh.visible;

        // Replace in parent
        if (skinnedMesh.parent) {
          const parent = skinnedMesh.parent;
          const index = parent.children.indexOf(skinnedMesh);
          parent.children[index] = regularMesh;
          regularMesh.parent = parent;
        }

        convertedCount++;
      });

      // Summary
      if (convertedCount > 0) {
        console.log(`✅ Converted ${convertedCount} broken SkinnedMesh(es) to regular Meshes in Mini_F`);
      }

      if (skinnedMeshCount > 0) {
        console.log(`✓ Processed ${skinnedMeshCount} SkinnedMesh(es) in Mini_F:`);
        console.log(`  - Valid (with bones): ${validSkinnedCount}`);
        console.log(`  - Converted (no bones): ${convertedCount}`);
      } else {
        console.log("ℹ️ No SkinnedMeshes found in Mini_F - model is static geometry");
      }

      // Apply materials and shadows
      this.miniFAnim.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          if (child.material) {
            child.material.side = THREE.DoubleSide;
          }
        }
      });

      // Check for animations and set up door open/close
      if (this.miniFAnim.animations && this.miniFAnim.animations.length > 0) {
        console.log(`✓ Mini_F Anim has ${this.miniFAnim.animations.length} animation(s)`);
        this.miniFAnimMixer = new THREE.AnimationMixer(this.miniFAnim);

        // Get the full animation clip
        const fullClip = this.miniFAnim.animations[0];
        console.log(`📊 Full animation duration: ${fullClip.duration}s, tracks: ${fullClip.tracks.length}`);

        // Find the midpoint of the animation (half duration)
        const halfDuration = fullClip.duration / 2;

        // Create opening animation (first half)
        this.fridgeOpeningClip = fullClip.clone();
        this.fridgeOpeningClip.name = 'FridgeOpening';
        this.fridgeOpeningClip.duration = halfDuration;
        this.fridgeOpeningClip.tracks = fullClip.tracks.map(track => {
          const newTrack = track.clone();
          newTrack.times = track.times.filter(t => t <= halfDuration);
          newTrack.values = track.values.slice(0, newTrack.times.length * track.getValueSize());
          return newTrack;
        });

        // Create closing animation (second half)
        this.fridgeClosingClip = fullClip.clone();
        this.fridgeClosingClip.name = 'FridgeClosing';
        this.fridgeClosingClip.duration = fullClip.duration - halfDuration;
        this.fridgeClosingClip.tracks = fullClip.tracks.map(track => {
          const newTrack = track.clone();
          newTrack.times = track.times.filter(t => t > halfDuration).map(t => t - halfDuration);
          const startIndex = track.times.findIndex(t => t > halfDuration);
          newTrack.values = track.values.slice(startIndex * track.getValueSize());
          return newTrack;
        });

        // Set up actions
        this.fridgeOpenAction = this.miniFAnimMixer.clipAction(this.fridgeOpeningClip);
        this.fridgeCloseAction = this.miniFAnimMixer.clipAction(this.fridgeClosingClip);

        // Configure actions - both play at same speed
        this.fridgeOpenAction.setLoop(THREE.LoopOnce, 1);
        this.fridgeOpenAction.clampWhenFinished = true;

        this.fridgeCloseAction.setLoop(THREE.LoopOnce, 1);
        this.fridgeCloseAction.clampWhenFinished = true;

        // Track fridge door state
        this.fridgeDoorOpen = false;

        console.log(`✓ Fridge door animations set up (open: ${halfDuration}s, close: ${this.fridgeClosingClip.duration}s)`);
      }

      // Position and scale to fit in the room
      this.miniFAnim.position.set(0, 0, -2); // At origin
      this.miniFAnim.rotation.set(0, 0, 0);
      this.miniFAnim.scale.set(0.03, 0.03, 0.03); // Scale to 3% to fit room

      this.scene.add(this.miniFAnim);
      console.log("✓ Mini_F Anim.fbx added to scene");
      console.log("📐 Mini_F Position:", this.miniFAnim.position);
      console.log("📐 Mini_F Scale:", this.miniFAnim.scale);
    } else {
      console.warn("⚠ Mini_F Anim.fbx not loaded");
    }

    // Add monitors to scene
    const monitors = [
      this.mainMonitor,
      this.monitor2,
      this.monitor3,
      this.monitor4,
      this.monitor5,
      this.monitor6,
      this.monitor7,
    ];

    monitors.forEach((monitor) => {
      monitor.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          if (child.material) {
            child.material.side = THREE.DoubleSide;
          }
        }
      });
      this.scene.add(monitor);
    });
  }

  setupScreens() {
    // Initialize screen components using canvas texture
    this.mainMonitorScreen = new MainMonitorScreen(this.mainMonitor);
    this.monitor7Screen = new Monitor7Screen(this.monitor7); // System Status

    // Other monitors - comment out until you need them
    // this.monitor2Screen = new Monitor2Screen(this.monitor2);
    // this.monitor3Screen = new Monitor3Screen(this.monitor3);
    // this.monitor4Screen = new Monitor4Screen(this.monitor4);
    // this.monitor5Screen = new Monitor5Screen(this.monitor5);
    // this.monitor6Screen = new Monitor6Screen(this.monitor6);

    // Set up fridge click handler
    this.setupFridgeInteraction();
  }

  setupFridgeInteraction() {
    if (!this.miniFAnim || !this.fridgeOpenAction || !this.fridgeCloseAction) {
      console.warn('⚠ Fridge not ready for interaction');
      return;
    }

    // Set a name for the fridge model for raycasting
    this.miniFAnim.name = 'Mini_F_Fridge';

    // Register click handler for the fridge
    this.experience.raycaster.registerClickHandler('Mini_F_Fridge', () => {
      this.toggleFridgeDoor();
    });

    console.log('✓ Fridge click handler registered');
  }

  toggleFridgeDoor() {
    console.log(`🚪 Toggling fridge door (currently ${this.fridgeDoorOpen ? 'open' : 'closed'})`);

    // Stop both actions first
    this.fridgeOpenAction.stop();
    this.fridgeCloseAction.stop();

    if (!this.fridgeDoorOpen) {
      // Open the door
      console.log('📂 Opening fridge door...');

      // Zoom camera to fridge
      this.experience.camera.transition.zoomToObject(this.miniFAnim, 0.8);

      this.fridgeOpenAction.reset();
      this.fridgeOpenAction.play();
      this.fridgeDoorOpen = true;
    } else {
      // Close the door
      console.log('📁 Closing fridge door...');

      // Zoom camera back out
      this.experience.camera.transition.reset();

      this.fridgeCloseAction.reset();
      this.fridgeCloseAction.play();
      this.fridgeDoorOpen = false;
    }
  }

  update() {
    // Update animation mixer for chair
    if (this.mixer) {
      this.mixer.update(this.time.delta * 0.001); // Convert to seconds
    }

    // Update animation mixer for asset
    if (this.assetMixer) {
      this.assetMixer.update(this.time.delta * 0.001);
    }

    // Update animation mixer for CPU
    if (this.cpuMixer) {
      this.cpuMixer.update(this.time.delta * 0.001); // Convert to seconds
    }

    // Update animation mixer for Mini_F Anim
    if (this.miniFAnimMixer) {
      this.miniFAnimMixer.update(this.time.delta * 0.001);
    }
  }
}
