import * as THREE from 'three';
import Experience from '../Experience.js';
import MainMonitorScreen from '../Screens/MainMonitorScreen.js';
import Monitor2Screen from '../Screens/Monitor2Screen.js';
import Monitor3Screen from '../Screens/Monitor3Screen.js';
import Monitor4Screen from '../Screens/Monitor4Screen.js';
import Monitor5Screen from '../Screens/Monitor5Screen.js';
import Monitor6Screen from '../Screens/Monitor6Screen.js';
import Monitor7Screen from '../Screens/Monitor7Screen.js';

export default class Models {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

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

    // Store monitor models
    this.mainMonitor = this.resources.items.mainMonitor;
    this.mainMonitor.name = 'Main_Monitor_1'; // Set name for raycasting

    this.monitor2 = this.resources.items.monitor2;
    this.monitor2.name = 'Monitor_2';

    this.monitor3 = this.resources.items.monitor3;
    this.monitor3.name = 'Monitor_3';

    this.monitor4 = this.resources.items.monitor4;
    this.monitor4.name = 'Monitor_4';

    this.monitor5 = this.resources.items.monitor5;
    this.monitor5.name = 'Monitor_5';

    this.monitor6 = this.resources.items.monitor6;
    this.monitor6.name = 'Monitor_6';

    this.monitor7 = this.resources.items.monitor7;
    this.monitor7.name = 'Monitor_7';

    // Add monitors to scene
    const monitors = [
      this.mainMonitor,
      this.monitor2,
      this.monitor3,
      this.monitor4,
      this.monitor5,
      this.monitor6,
      this.monitor7
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
  }

  update() {
    // Update animations if needed
  }
}
