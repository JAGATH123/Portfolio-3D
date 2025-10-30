# 🖥️ Left Monitor Screen - Complete Breakdown

## How the Left Monitor Screen is Created and Positioned

Let me show you EXACTLY how it works, step by step!

## 📍 Step 1: Get the Monitor Model Position

First, they loaded a 3D model of the monitor frame (`leftMonitor.glb`):

```javascript
// The 3D model file
this.model.mesh = this.resources.items.leftMonitor.scene;

// Add it to the scene
this.scene.add(this.model.mesh);
```

The monitor model (the frame/bezel) is positioned in the 3D scene. Inside this model, there's a specific spot where the screen should be.

## 📏 Step 2: Define Screen Constants

All the screen positioning data is stored in `constants.js`:

```javascript
// From constants.js

// Screen dimensions (in pixels for the HTML)
export const MONITOR_SCREEN_WIDTH = 1370.178;
export const MONITOR_SCREEN_HEIGHT = 764.798;

// Where to place the CSS3D screen in 3D space
export const LEFT_MONITOR_CSS_OBJECT_POSITION = new Vector3(
  1.06738,   // X position (left/right)
  2.50725,   // Y position (up/down)
  -4.23009   // Z position (forward/back)
);

// How small to scale it (pixels → 3D units)
export const LEFT_MONITOR_CSS_OBJECT_SCALE = new Vector3(
  0.00102,   // X scale
  0.00102,   // Y scale
  1          // Z scale (depth doesn't matter for flat screen)
);

// What HTML page to display
export const LEFT_MONITOR_IFRAME_SRC = "/about.html";

// Padding inside the screen
export const MONITOR_IFRAME_PADDING = "8px";
```

### How They Found These Values:

1. **Position (1.06738, 2.50725, -4.23009):**
   - Opened the monitor model in Blender
   - Found the screen mesh/area
   - Noted its position in 3D space
   - Or measured it in Three.js by adding a test object

2. **Scale (0.00102):**
   - The HTML is 1370px wide
   - In 3D, the monitor screen might be ~1.4 units wide
   - Scale = 3D_size / pixel_size = 1.4 / 1370 ≈ 0.001
   - Fine-tuned by trial and error

3. **Dimensions (1370 x 764):**
   - Standard monitor aspect ratio (16:9)
   - Sized to match the monitor frame

## 🎨 Step 3: Create the HTML Content

```javascript
// Create a container div
const container = document.createElement("div");
container.style.width = "1370px";      // Match screen width
container.style.height = "764px";       // Match screen height

// Create an iframe (displays HTML page)
const iframe = document.createElement("iframe");
iframe.src = "/about.html";             // Your HTML content!
iframe.style.width = "1370px";
iframe.style.height = "764px";
iframe.style.padding = "8px";           // Padding from edges
iframe.style.transparent = true;
iframe.id = "left-monitor-screen";
iframe.style.boxSizing = "border-box";
iframe.style.background = "black";      // Black background

// Put iframe inside container
container.appendChild(iframe);
```

**What this creates:**
```html
<div style="width: 1370px; height: 764px;">
  <iframe
    src="/about.html"
    style="width: 1370px; height: 764px; padding: 8px; background: black;">
  </iframe>
</div>
```

## 🔮 Step 4: Convert HTML to 3D Object (CSS3DObject)

```javascript
import { CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer.js";

// Wrap the HTML container in CSS3DObject
const css3dobject = new CSS3DObject(container);

// Position it in 3D space (where the screen is)
css3dobject.position.copy(LEFT_MONITOR_CSS_OBJECT_POSITION);
// This sets: position.set(1.06738, 2.50725, -4.23009)

// Scale it down (from pixels to 3D units)
css3dobject.scale.copy(LEFT_MONITOR_CSS_OBJECT_SCALE);
// This sets: scale.set(0.00102, 0.00102, 1)

// Add to CSS3D scene (not the regular WebGL scene!)
this.cssLeftMonitorScene.add(css3dobject);
```

**What happens:**
- The HTML div is now positioned in 3D space!
- It will rotate with the camera
- It appears at exactly (1.06738, 2.50725, -4.23009)

## 👻 Step 5: Create Invisible Plane for Mouse Clicks

The CSS3D content can't be raycasted (detected by mouse), so we create an invisible WebGL plane:

```javascript
import {
  PlaneGeometry,
  Mesh,
  MeshLambertMaterial,
  NoBlending
} from "three";

// Create invisible material
const material = new MeshLambertMaterial({
  color: "black",
  opacity: 0,              // Completely invisible!
  transparent: true,
  blending: NoBlending,    // Don't blend with other objects
});

// Create plane geometry (same size as HTML screen)
const geometry = new PlaneGeometry(
  1370.178,   // Width in pixels (same as HTML)
  764.798     // Height in pixels
);

// Create the mesh
const screen = new Mesh(geometry, material);

// Position it EXACTLY where the CSS3D object is
screen.position.copy(css3dobject.position);
screen.rotation.copy(css3dobject.rotation);
screen.scale.copy(css3dobject.scale);

// Give it a name for raycasting
screen.name = "leftMonitorScreen";

// Add to the monitor model (so it moves with monitor)
this.model.mesh.add(screen);
```

**What this does:**
- Creates an invisible plane at the same position as the HTML
- Mouse clicks hit this plane (raycasting works!)
- When clicked, we can disable orbit controls and let clicks through to HTML

## 🎯 Complete Code - LeftMonitorScreen.js

Here's the complete creation function with ALL details:

```javascript
setLeftMonitorScreen() {
  // ==========================================
  // STEP 1: CREATE HTML CONTENT
  // ==========================================

  const container = document.createElement("div");
  container.style.width = this.screenMonitorSize.width + "px";   // 1370px
  container.style.height = this.screenMonitorSize.height + "px"; // 764px

  const iframe = document.createElement("iframe");
  iframe.src = LEFT_MONITOR_IFRAME_SRC;                          // "/about.html"
  iframe.style.width = this.screenMonitorSize.width + "px";
  iframe.style.height = this.screenMonitorSize.height + "px";
  iframe.style.padding = MONITOR_IFRAME_PADDING;                 // "8px"
  iframe.style.transparent = true;
  iframe.id = "left-monitor-screen";
  iframe.style.boxSizing = "border-box";
  iframe.style.background = "black";

  container.appendChild(iframe);

  // ==========================================
  // STEP 2: MAKE IT 3D (CSS3DObject)
  // ==========================================

  const css3dobject = new CSS3DObject(container);

  // Position in 3D space
  css3dobject.position.copy(LEFT_MONITOR_CSS_OBJECT_POSITION);
  // Result: position.set(1.06738, 2.50725, -4.23009)

  // Scale down to fit in 3D world
  css3dobject.scale.copy(LEFT_MONITOR_CSS_OBJECT_SCALE);
  // Result: scale.set(0.00102, 0.00102, 1)

  // Add to CSS3D scene (rendered separately)
  this.cssLeftMonitorScene.add(css3dobject);

  // ==========================================
  // STEP 3: CREATE INVISIBLE RAYCAST PLANE
  // ==========================================

  // Material - completely invisible
  const material = new MeshLambertMaterial({
    color: "black",
    opacity: 0,           // Can't see it!
    transparent: true,
    blending: NoBlending,
  });

  // Geometry - same size as HTML screen
  const geometry = new PlaneGeometry(
    this.screenMonitorSize.width,    // 1370.178
    this.screenMonitorSize.height    // 764.798
  );

  // Create mesh
  const screen = new Mesh(geometry, material);

  // Match position/rotation/scale of CSS3D object EXACTLY
  screen.position.copy(css3dobject.position);
  screen.rotation.copy(css3dobject.rotation);
  screen.scale.copy(css3dobject.scale);

  // Name for raycasting detection
  screen.name = "leftMonitorScreen";

  // Add to monitor model (WebGL scene)
  this.model.mesh.add(screen);
}
```

## 📊 Required Data for Your Own Screen

To create your own screen, you need these 7 pieces of information:

### 1. Screen Mesh Name
```javascript
const screenMesh = "Monitor_01";  // From FBX viewer
```

### 2. Screen Position (X, Y, Z)
```javascript
const position = new Vector3(
  1.06738,   // X: left(-) / right(+)
  2.50725,   // Y: down(-) / up(+)
  -4.23009   // Z: forward(+) / back(-)
);
```

**How to find:**
- Use FBX viewer
- Click on screen mesh
- Look at console: "Position: {x: 1.06738, y: 2.50725, z: -4.23009}"

### 3. Screen Rotation (if needed)
```javascript
const rotation = new Vector3(
  0,      // X rotation (pitch)
  0,      // Y rotation (yaw)
  0       // Z rotation (roll)
);
```

**How to find:**
- Most screens face forward = 0, 0, 0
- If angled, check in FBX viewer
- Or rotate in Blender before export

### 4. Screen Dimensions (Pixels)
```javascript
const width = 1920;   // Screen width in pixels
const height = 1080;  // Screen height in pixels
```

**How to choose:**
- 1920x1080 (Full HD) - Most common
- 1280x720 (HD) - Smaller screens
- 3840x2160 (4K) - High detail
- Custom aspect ratios based on your screen mesh

### 5. Screen Scale
```javascript
const scale = new Vector3(
  0.00102,  // X scale
  0.00102,  // Y scale
  1         // Z scale (doesn't matter for flat screens)
);
```

**How to calculate:**
```javascript
// Method 1: Visual adjustment
// Start with 0.001 and adjust up/down until it fits

// Method 2: Calculate from mesh size
const meshWidth = 2.5;        // Screen mesh width in 3D units
const pixelWidth = 1920;      // HTML width in pixels
const scale = meshWidth / pixelWidth;
// Result: 2.5 / 1920 = 0.0013
```

### 6. Content Source
```javascript
const contentSrc = "/your-content.html";  // Your HTML page
```

### 7. Padding (Optional)
```javascript
const padding = "8px";  // Space from edges
```

## 🔧 Template for Your Screen

Here's a complete template you can use:

```javascript
// YOUR_SCREEN_CONFIG.js

export const YOUR_SCREEN_CONFIG = {
  // From FBX viewer
  meshName: "Monitor_01",

  // Position in 3D space
  position: {
    x: 1.06738,
    y: 2.50725,
    z: -4.23009
  },

  // Rotation (if screen is angled)
  rotation: {
    x: 0,
    y: 0,
    z: 0
  },

  // HTML dimensions
  dimensions: {
    width: 1920,
    height: 1080
  },

  // Scale factor (pixels → 3D units)
  scale: {
    x: 0.00102,
    y: 0.00102,
    z: 1
  },

  // Content
  content: {
    src: "/your-content.html",
    padding: "8px",
    background: "black"
  }
};
```

## 🎬 Step-by-Step: Creating Your Own Screen

### Step 1: Find Your Screen Mesh

```bash
# Open viewer
http://localhost:8080/fbx-viewer.html

# Click "List All Meshes"
# Find your screen mesh
# Write down: NAME, POSITION, ROTATION
```

### Step 2: Create Screen Component

```javascript
// src/Experience/Components/MyScreen.js

import { CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer.js";
import { PlaneGeometry, Mesh, MeshLambertMaterial, NoBlending, Vector3 } from "three";
import Experience from "../Experience.js";

export default class MyScreen {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.cssMyScreenScene = this.experience.cssMyScreenScene; // Need to create!

    // YOUR VALUES HERE!
    this.screenWidth = 1920;
    this.screenHeight = 1080;
    this.position = new Vector3(0, 2, 0);      // From viewer
    this.scale = new Vector3(0.001, 0.001, 1);  // Adjust to fit
    this.contentSrc = "/my-content.html";

    this.createScreen();
  }

  createScreen() {
    // 1. Create HTML
    const container = document.createElement("div");
    container.style.width = this.screenWidth + "px";
    container.style.height = this.screenHeight + "px";

    const iframe = document.createElement("iframe");
    iframe.src = this.contentSrc;
    iframe.style.width = this.screenWidth + "px";
    iframe.style.height = this.screenHeight + "px";
    iframe.style.padding = "8px";
    iframe.style.background = "black";
    iframe.style.boxSizing = "border-box";
    container.appendChild(iframe);

    // 2. Make it 3D
    const css3d = new CSS3DObject(container);
    css3d.position.copy(this.position);
    css3d.scale.copy(this.scale);
    this.cssMyScreenScene.add(css3d);

    // 3. Invisible raycast plane
    const material = new MeshLambertMaterial({
      color: "black",
      opacity: 0,
      transparent: true,
      blending: NoBlending
    });

    const geometry = new PlaneGeometry(this.screenWidth, this.screenHeight);
    const plane = new Mesh(geometry, material);
    plane.position.copy(css3d.position);
    plane.rotation.copy(css3d.rotation);
    plane.scale.copy(css3d.scale);
    plane.name = "myScreen";

    this.scene.add(plane);
  }
}
```

### Step 3: Setup CSS3D Scene (Experience.js)

```javascript
// In Experience.js constructor

// Add CSS3D scene
this.cssMyScreenScene = new Scene();

// Get DOM container
this.cssMyScreen = document.querySelector('.css-my-screen');
```

### Step 4: Setup CSS3D Renderer (Renderer.js)

```javascript
// In Renderer.js setInstance()

// Create CSS3D renderer
this.cssMyScreenInstance = new CSS3DRenderer();
this.cssMyScreenInstance.setSize(this.sizes.width, this.sizes.height);
this.cssMyScreenInstance.domElement.style.position = "absolute";
this.cssMyScreenInstance.domElement.style.top = "0px";

// Append to DOM
this.cssMyScreen.appendChild(this.cssMyScreenInstance.domElement);
```

```javascript
// In Renderer.js update()

// Render CSS3D scene
this.cssMyScreenInstance.render(
  this.experience.cssMyScreenScene,
  this.camera.instance
);
```

### Step 5: Add DOM Container (index.html)

```html
<div class="css-my-screen"></div>
```

### Step 6: Initialize in World

```javascript
// In World.js
import MyScreen from "./MyScreen.js";

setMyScreen() {
  this.myScreen = new MyScreen();
}

// Call in constructor after resources load
this.setMyScreen();
```

## 📝 Checklist for Your Screen

- [ ] Found screen mesh name in FBX viewer
- [ ] Got position (x, y, z) from viewer
- [ ] Got rotation (if angled)
- [ ] Chose dimensions (1920x1080, etc.)
- [ ] Calculated/adjusted scale
- [ ] Created HTML content file
- [ ] Created Screen component class
- [ ] Added CSS3D scene to Experience
- [ ] Added CSS3D renderer to Renderer
- [ ] Added DOM container to HTML
- [ ] Initialized in World
- [ ] Tested and adjusted position/scale

## 🎯 Summary

**The left monitor screen is positioned by:**

1. **Position**: `(1.06738, 2.50725, -4.23009)` - Where in 3D space
2. **Scale**: `(0.00102, 0.00102, 1)` - Size conversion pixels→3D
3. **Dimensions**: `1370x764` pixels - HTML size
4. **CSS3DObject** - Wraps HTML and positions it in 3D
5. **Invisible plane** - Same position, for mouse detection

**They found these values by:**
- Measuring in Blender/3D software
- Or testing in Three.js with trial and error
- Matching to the monitor frame model

**You need the same 7 values for your screen!** ✅

Use the FBX viewer to find your values, then follow the template! 🚀
