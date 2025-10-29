import * as THREE from 'three';

// Debug utility to log all meshes in an object
export function logAllMeshes(object, objectName = 'Object') {
  console.log(`\n📦 Meshes in ${objectName}:`);
  console.log('=====================================');

  let meshCount = 0;
  object.traverse((child) => {
    if (child.isMesh) {
      meshCount++;
      const box = new THREE.Box3().setFromObject(child);
      const size = box.getSize(new THREE.Vector3());

      console.log(`\n${meshCount}. ${child.name || 'unnamed'}`);
      console.log(`   Type: ${child.geometry.type}`);
      console.log(`   Vertices: ${child.geometry.attributes.position.count}`);
      console.log(`   Size: x=${size.x.toFixed(2)}, y=${size.y.toFixed(2)}, z=${size.z.toFixed(2)}`);
      console.log(`   Material: ${child.material ? child.material.type : 'none'}`);

      if (child.material && child.material.color) {
        console.log(`   Color: rgb(${Math.floor(child.material.color.r * 255)}, ${Math.floor(child.material.color.g * 255)}, ${Math.floor(child.material.color.b * 255)})`);
      }
    }
  });

  console.log(`\nTotal meshes: ${meshCount}`);
  console.log('=====================================\n');
}

export default { logAllMeshes };
