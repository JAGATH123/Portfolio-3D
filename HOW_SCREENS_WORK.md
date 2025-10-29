# 🎓 How Screen Display Works in This Portfolio

## Overview

The portfolio uses **CSS3DRenderer** from Three.js to display HTML/iframe content on 3D screens. This is the SAME technique used for the arcade machine and monitors!

## 🏗️ Architecture

### The System Has 3 Parts:

1. **WebGL Renderer** - Renders the 3D models
2. **CSS3D Renderer** - Renders HTML content in 3D space
3. **Sync Layer** - Keeps them aligned

## 📚 How It Works (Step-by-Step)

### Step 1: Two Overlapping Renderers

```
┌─────────────────────┐
│   WebGL Canvas      │  ← 3D models (room, chair, etc.)
│   (bottom layer)    │
└─────────────────────┘
        ↓
┌─────────────────────┐
│   CSS3D Layer       │  ← HTML iframes positioned in 3D
│   (top layer)       │
└─────────────────────┘
```

Both render to the same camera, so they stay aligned!

### Step 2: Create HTML Content

```javascript
// Create a div container
const container = document.createElement("div");
container.style.width = "1920px";
container.style.height = "1080px";

// Create iframe with your content
const iframe = document.createElement("iframe");
iframe.src = "/your-content.html";  // Your HTML page!
iframe.style.width = "1920px";
iframe.style.height = "1080px";
container.appendChild(iframe);
```

### Step 3: Convert HTML to 3D Object

```javascript
import { CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer.js";

// Wrap container in CSS3DObject
const css3DObject = new CSS3DObject(container);

// Position it in 3D space (where your screen mesh is)
css3DObject.position.set(1.06738, 2.50725, -4.23009);
css3DObject.scale.set(0.00102, 0.00102, 0.00102);

// Add to CSS3D scene
cssScene.add(css3DObject);
```

### Step 4: Create Invisible WebGL Plane (For Raycasting)

```javascript
import { PlaneGeometry, Mesh, MeshLambertMaterial, NoBlending } from "three";

// Create invisible plane at same position
const geometry = new PlaneGeometry(1920, 1080);
const material = new MeshLambertMaterial({
  color: "black",
  opacity: 0,           // Invisible!
  transparent: true,
  blending: NoBlending,
});

const screen = new Mesh(geometry, material);

// Match position/rotation/scale of CSS3D object
screen.position.copy(css3DObject.position);
screen.rotation.copy(css3DObject.rotation);
screen.scale.copy(css3DObject.scale);
screen.name = "myScreenForRaycasting";

// Add to WebGL scene
scene.add(screen);
```

**Why?** The invisible plane allows raycasting (detecting mouse clicks) while the HTML sits on top!

### Step 5: Render Both

```javascript
// Every frame:
function render() {
  // Render WebGL scene
  webglRenderer.render(scene, camera);

  // Render CSS3D scene with SAME camera
  css3DRenderer.render(cssScene, camera);
}
```

## 🎯 Complete Example

Here's how LeftMonitor does it:

```javascript
// From LeftMonitorScreen.js

setLeftMonitorScreen() {
  // 1. Create HTML
  const container = document.createElement("div");
  container.style.width = "1370px";
  container.style.height = "764px";

  const iframe = document.createElement("iframe");
  iframe.src = "/about.html";  // Your HTML page
  iframe.style.width = "1370px";
  iframe.style.height = "764px";
  container.appendChild(iframe);

  // 2. Make it 3D
  const css3dobject = new CSS3DObject(container);
  css3dobject.position.set(1.06738, 2.50725, -4.23009);
  css3dobject.scale.set(0.00102, 0.00102, 0.00102);

  // 3. Add to CSS3D scene
  this.cssLeftMonitorScene.add(css3dobject);

  // 4. Create invisible WebGL plane for raycasting
  const material = new MeshLambertMaterial({
    color: "black",
    opacity: 0,
    transparent: true,
    blending: NoBlending,
  });

  const geometry = new PlaneGeometry(1370, 764);
  const screen = new Mesh(geometry, material);

  // 5. Match position
  screen.position.copy(css3dobject.position);
  screen.rotation.copy(css3dobject.rotation);
  screen.scale.copy(css3dobject.scale);
  screen.name = "leftMonitorScreen";

  // 6. Add to WebGL scene
  this.scene.add(screen);
}
```

## 🎮 Setup Requirements

### In Experience.js

You need CSS3D scenes and DOM containers:

```javascript
// Create CSS3D scenes (one per screen or group)
this.cssLeftMonitorScene = new Scene();
this.cssRightMonitorScene = new Scene();

// Create DOM containers
this.cssLeftMonitor = document.querySelector('.css-left-monitor');
this.cssRightMonitor = document.querySelector('.css-right-monitor');
```

### In Renderer.js

Create CSS3D renderer instances:

```javascript
// Create CSS3D renderers
this.cssLeftMonitorInstance = new CSS3DRenderer();
this.cssLeftMonitorInstance.setSize(width, height);
this.cssLeftMonitorInstance.domElement.style.position = "absolute";
this.cssLeftMonitorInstance.domElement.style.top = "0px";

// Append to DOM container
this.cssLeftMonitor.appendChild(this.cssLeftMonitorInstance.domElement);
```

### In HTML (index.html)

Add DOM containers:

```html
<div class="webgl"></div>
<div class="css-left-monitor"></div>
<div class="css-right-monitor"></div>
```

### In Update Loop

Render both:

```javascript
update() {
  // Render WebGL
  this.composer.render();

  // Render CSS3D scenes
  this.cssLeftMonitorInstance.render(
    this.cssLeftMonitorScene,
    this.camera.instance
  );
  this.cssRightMonitorInstance.render(
    this.cssRightMonitorScene,
    this.camera.instance
  );
}
```

## 🔧 For Your TempWork Model

### Option 1: Simple Canvas Texture (What I Built)

**Pros:**
- ✅ No renderer modifications needed
- ✅ Works right now
- ✅ Easy to setup

**Cons:**
- ❌ Not true HTML (simulated with canvas)
- ❌ Not interactive

**Use:** ScreenManager class (already created!)

```javascript
// In TempWorkModel.js
const screenConfigs = [
  {
    name: 'your_screen_mesh',
    type: 'canvas',
    width: 1920,
    height: 1080,
    renderer: (ctx, canvas) => {
      // Draw anything!
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#0f0';
      ctx.font = '64px Arial';
      ctx.fillText('Hello!', 100, 100);
    }
  }
];
```

### Option 2: Full CSS3D (Like Monitors)

**Pros:**
- ✅ True HTML/iframes
- ✅ Fully interactive
- ✅ Can run websites, videos, etc.

**Cons:**
- ❌ Requires renderer modifications
- ❌ Need to setup CSS3D scenes
- ❌ More complex

**Steps:**

1. **Add CSS3D Scene for TempWork**

```javascript
// In Experience.js constructor
this.cssTempWorkScene = new Scene();
this.cssTempWork = document.querySelector('.css-tempwork');
```

2. **Add CSS3D Renderer**

```javascript
// In Renderer.js
this.cssTempWorkInstance = new CSS3DRenderer();
this.cssTempWorkInstance.setSize(this.sizes.width, this.sizes.height);
this.cssTempWorkInstance.domElement.style.position = "absolute";
this.cssTempWorkInstance.domElement.style.top = "0px";
this.cssTempWork.appendChild(this.cssTempWorkInstance.domElement);
```

3. **Add DOM Container**

```javascript
// In src/index.html
<div class="css-tempwork"></div>
```

4. **Render It**

```javascript
// In Renderer.js update()
this.cssTempWorkInstance.render(
  this.experience.cssTempWorkScene,
  this.camera.instance
);
```

5. **Create Screen Component**

```javascript
// In TempWorkScreen.js (new file, copy from LeftMonitorScreen.js)
import { CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer.js";

setupScreen(screenMesh) {
  // Create HTML
  const container = document.createElement("div");
  const iframe = document.createElement("iframe");
  iframe.src = "/your-content.html";
  container.appendChild(iframe);

  // Make 3D
  const css3dobject = new CSS3DObject(container);

  // Get position from your screen mesh
  css3dobject.position.copy(screenMesh.position);
  css3dobject.scale.set(0.001, 0.001, 0.001);

  // Add to CSS3D scene
  this.experience.cssTempWorkScene.add(css3dobject);

  // Create invisible raycast plane
  const plane = new Mesh(geometry, invisibleMaterial);
  plane.position.copy(css3dobject.position);
  this.scene.add(plane);
}
```

## 💡 Which Should You Use?

### Use Canvas Method (ScreenManager) If:
- You want quick results
- Content is graphics/text/simple visuals
- Don't need interactivity
- **⭐ RECOMMENDED FOR NOW**

### Use CSS3D Method If:
- Need full HTML pages
- Need interactive content (forms, buttons, links)
- Want to embed external websites
- Need video players
- Have time to modify core renderer

## 📝 Summary

**How monitors/arcade work:**

1. HTML iframe created in DOM
2. Wrapped in CSS3DObject (makes it 3D)
3. Positioned where screen mesh is
4. CSS3D renderer draws it
5. Invisible WebGL plane for mouse detection
6. Both renderers use same camera = perfect alignment!

**How your screens can work (now):**

1. Use ScreenManager (already built!)
2. Canvas textures applied to screen meshes
3. Draw content with Canvas API
4. No renderer changes needed
5. Works immediately!

## 🚀 Next Steps

1. **Find your screen meshes** (use fbx-viewer.html)
2. **Start with Canvas method** (ScreenManager - already integrated!)
3. **Test and iterate** on content
4. **Later:** Upgrade to CSS3D if you need true HTML

The canvas method is 90% as good and 100x easier to setup! 🎯
