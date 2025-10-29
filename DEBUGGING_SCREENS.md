# Debugging CSS3D Screen Positioning

## What Was Changed

### MainMonitorScreen.js Updates:

1. **Hidden Original Screen Mesh**
   - `this.screenMesh.visible = false` - The original curved polySurface1077 mesh is now hidden
   - This prevents seeing both the original mesh AND the CSS3D content

2. **Position Using Bounding Box Center**
   - Uses `box.getCenter()` instead of `getWorldPosition()`
   - This gives us the CENTER of the curved screen mesh
   - CSS3D plane is positioned at this center point

3. **Flat Plane for CSS3D**
   - CSS3D cannot curve - it's always a flat plane
   - The flat plane sits at the center of where the curved screen was
   - Small offset (0.1 units) forward so it appears in front

4. **Removed Curved Raycasting Geometry**
   - Now uses flat `PlaneGeometry` for raycasting
   - Matches the CSS3D object exactly

## How to Test

1. **Open the dev server**: http://localhost:3001

2. **Open Browser Console** (F12)

3. **Look for these console logs**:
   ```
   Found Main Monitor screen mesh: polySurface1077
   Screen position: Vector3 {x: ..., y: ..., z: ...}
   Screen bounding box center: Vector3 {x: ..., y: ..., z: ...}
   Screen size: Vector3 {x: ..., y: ..., z: ...}
   CSS3D object position: Vector3 {x: ..., y: ..., z: ...}
   CSS3D object scale: ...
   Main Monitor screen setup complete!
   ```

## Expected Behavior

✅ **Original curved screen mesh should be invisible**
✅ **CSS3D flat plane should appear at the center of where curved screen was**
✅ **No duplicate screens**
✅ **HTML content from `/screens/main-monitor.html` should display**

## If Screen Position Is Wrong

The CSS3D screen might not perfectly align because:

1. **Curved vs Flat**: The original mesh is curved, CSS3D is flat
2. **Offset might need adjustment**: Try different offset values

### Manual Position Adjustments

Edit `src/Experience/Screens/MainMonitorScreen.js` line 92-94:

```javascript
// Adjust this offset to move screen forward/backward
const offset = new THREE.Vector3(0, 0, 0.1);  // Try 0.2, 0.5, -0.1, etc.
offset.applyEuler(worldEuler);
css3DObject.position.add(offset);
```

### Manual Rotation Adjustments

If screen is rotated wrong, after line 96:

```javascript
css3DObject.rotation.copy(worldEuler);

// Add manual rotation adjustments
css3DObject.rotation.y += Math.PI / 4;  // Rotate 45 degrees
css3DObject.rotation.x += 0.1;  // Tilt up/down
```

### Manual Scale Adjustments

If screen is too big/small, after line 102:

```javascript
css3DObject.scale.set(scale, scale, scale);

// Or manually set scale
css3DObject.scale.set(0.002, 0.002, 0.002);  // Try different values
```

## Common Issues

### Issue: Screen not visible at all
**Solution**:
- Check console for errors
- Verify FBX model loaded (should see "Found Main Monitor screen mesh")
- Check that CSS3D renderer is working

### Issue: Screen visible but in wrong position
**Solution**:
- Use console log values to understand current position
- Adjust offset vector (line 92)
- Try different rotation values

### Issue: Screen too large/small
**Solution**:
- Check console for "CSS3D object scale" value
- Manually set scale value instead of auto-calculating
- Common scales: 0.001, 0.002, 0.005

### Issue: Screen appears behind monitor
**Solution**:
- Increase offset value (line 92)
- Try: `const offset = new THREE.Vector3(0, 0, 0.5);`

### Issue: Screen appears in front but too far
**Solution**:
- Decrease offset value
- Try: `const offset = new THREE.Vector3(0, 0, 0.05);`

## Debugging Commands

Open browser console and run:

```javascript
// Get reference to experience
const exp = window.experience;

// Check if screen mesh was found
exp.world.models.mainMonitorScreen.screenMesh

// Get CSS3D scene
exp.cssMainMonitorScene

// See all objects in CSS3D scene
exp.cssMainMonitorScene.children

// Get the CSS3D object position
exp.cssMainMonitorScene.children[0].position

// Manually adjust position in real-time
exp.cssMainMonitorScene.children[0].position.set(0, 2, -5)
exp.cssMainMonitorScene.children[0].rotation.set(0, Math.PI, 0)
exp.cssMainMonitorScene.children[0].scale.set(0.003, 0.003, 0.003)
```

## Next Steps

1. **Test Current Setup**
   - Open http://localhost:3001
   - Check console logs
   - See if screen appears on monitor

2. **Fine-Tune Position**
   - Use console logs to understand current position
   - Adjust offset, rotation, or scale as needed
   - Save changes and reload

3. **Apply Same Pattern to Other Monitors**
   - Once Main Monitor works, copy the approach
   - Update Monitor2Screen.js through Monitor7Screen.js
   - Find screen mesh names for each monitor

## Understanding CSS3D Limitation

**Important**: CSS3D cannot bend or curve. The curved monitor will have a FLAT screen showing HTML content at its center. This is a limitation of the CSS3D technique.

**Options**:
1. Accept flat screen on curved monitor (simplest)
2. Use canvas texture with curved geometry (no interactivity)
3. Use multiple small CSS3D planes to simulate curve (complex)

For portfolio purposes, option 1 (flat CSS3D) is recommended and works well!
