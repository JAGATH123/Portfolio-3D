# 3D Portfolio with CSS3D Screens

A stunning 3D portfolio website featuring interactive monitors using Three.js CSS3D rendering technique.

## Features

- **CSS3D Rendering**: True HTML content displayed on 3D monitor screens
- **Interactive Navigation**: Orbit controls for exploring the 3D environment
- **7 Interactive Monitors**: Each displaying different portfolio content
- **Fully Responsive**: HTML iframes can display any web content
- **Modern Tech Stack**: Built with Three.js, Vite, and ES6 modules

## Project Structure

```
Portfolio-3D/
├── src/
│   ├── Experience/
│   │   ├── Utils/
│   │   │   ├── EventEmitter.js    # Event system
│   │   │   ├── Sizes.js           # Viewport sizing
│   │   │   ├── Time.js            # Animation loop
│   │   │   └── Resources.js       # Asset loader
│   │   ├── World/
│   │   │   ├── World.js           # Main world coordinator
│   │   │   ├── Environment.js     # Lights and environment
│   │   │   └── Models.js          # FBX model loader
│   │   ├── Screens/
│   │   │   ├── MainMonitorScreen.js
│   │   │   ├── Monitor2Screen.js
│   │   │   ├── Monitor3Screen.js
│   │   │   ├── Monitor4Screen.js
│   │   │   ├── Monitor5Screen.js
│   │   │   ├── Monitor6Screen.js
│   │   │   └── Monitor7Screen.js
│   │   ├── Experience.js          # Core experience class
│   │   ├── Camera.js              # Camera and controls
│   │   ├── Renderer.js            # WebGL + CSS3D renderers
│   │   └── sources.js             # Asset sources
│   └── script.js                  # Entry point
├── public/
│   ├── screens/
│   │   ├── main-monitor.html      # Monitor 1 content
│   │   ├── monitor-2.html         # Monitor 2 content
│   │   ├── monitor-3.html         # Monitor 3 content
│   │   ├── monitor-4.html         # Monitor 4 content
│   │   ├── monitor-5.html         # Monitor 5 content
│   │   ├── monitor-6.html         # Monitor 6 content
│   │   └── monitor-7.html         # Monitor 7 content
│   ├── Main_Monitor_1.fbx
│   ├── Monitor_2.fbx
│   ├── Monitor_3.fbx
│   ├── Monitor_4.fbx
│   ├── Monitor_5.fbx
│   ├── Monitor_6.fbx
│   ├── Monitor_7.fbx
│   └── Room_Window.fbx
├── index.html
├── package.json
└── vite.config.js
```

## How CSS3D Screens Work

The portfolio uses the **CSS3D rendering technique** described in `HOW_SCREENS_WORK.md`:

### The System Has 3 Parts:

1. **WebGL Renderer** - Renders the 3D models (monitors, room)
2. **CSS3D Renderer** - Renders HTML/iframe content in 3D space
3. **Sync Layer** - Keeps both renderers aligned using the same camera

### Implementation Steps:

1. **Create HTML Content** - Each monitor has an HTML page in `public/screens/`
2. **Wrap in CSS3DObject** - Convert HTML to 3D object that can be positioned in 3D space
3. **Position in Scene** - Place CSS3D objects where monitor screens are located
4. **Create Raycast Plane** - Invisible WebGL plane for mouse detection
5. **Render Both** - Both WebGL and CSS3D scenes render each frame with same camera

## Screen Content

- **Main Monitor**: Welcome/Introduction
- **Monitor 2**: About Me
- **Monitor 3**: Projects
- **Monitor 4**: Technical Skills
- **Monitor 5**: Work Experience
- **Monitor 6**: Contact Information
- **Monitor 7**: Live System Stats

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev
```

The project will be available at `http://localhost:3000`

### Build for Production

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Customization

### Adding New Monitor Content

1. Create a new HTML file in `public/screens/`
2. Edit the corresponding screen file in `src/Experience/Screens/`
3. Update the iframe src to point to your new HTML file

### Adjusting Monitor Positions

Each screen component has a `setupScreen()` method where you can adjust:

```javascript
css3DObject.position.set(x, y, z);
css3DObject.rotation.set(x, y, z);
css3DObject.scale.set(0.001, 0.001, 0.001);
```

**Note**: You'll need to find the exact positions of screen meshes in your FBX models. Use the viewer.html tool to inspect mesh positions.

### Changing Screen Size

Modify the container and iframe dimensions:

```javascript
container.style.width = '1920px';
container.style.height = '1080px';
```

And update the PlaneGeometry to match:

```javascript
const geometry = new THREE.PlaneGeometry(1920, 1080);
```

## Important Notes

1. **Screen Positions**: The current screen positions are set to origin (0, 2, 0). You MUST adjust these to match your actual FBX model's screen mesh positions.

2. **Finding Screen Positions**:
   - Open `viewer.html` in a browser
   - Use browser console to inspect mesh positions
   - Update positions in each `*Screen.js` file

3. **Performance**: CSS3D rendering is performant but each renderer adds overhead. The current setup uses 7 separate CSS3D renderers (one per monitor).

4. **Interactivity**: Set `pointer-events: auto` on specific iframe elements to make them clickable.

## Technologies Used

- **Three.js** - 3D graphics library
- **CSS3DRenderer** - Renders HTML in 3D space
- **FBXLoader** - Loads 3D models
- **OrbitControls** - Camera controls
- **Vite** - Build tool and dev server

## Next Steps

1. **Adjust screen positions** to match your FBX models
2. **Customize HTML content** for each monitor
3. **Add interactivity** to screens (buttons, forms, etc.)
4. **Optimize positions** using the viewer tool
5. **Add animations** or transitions between views

## Troubleshooting

### Screens not visible?
- Check that FBX models are loaded correctly
- Verify screen positions match your model
- Check browser console for errors

### HTML content not showing?
- Verify iframe src paths are correct
- Check that HTML files exist in `public/screens/`
- Make sure CSS3D renderers are initialized

### Performance issues?
- Reduce number of active CSS3D renderers
- Optimize HTML content in iframes
- Lower polygon count on 3D models

## License

This project is open source and available for portfolio use.
