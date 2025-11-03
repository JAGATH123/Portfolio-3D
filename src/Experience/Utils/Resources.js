import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import EventEmitter from './EventEmitter.js';

export default class Resources extends EventEmitter {
  constructor(sources) {
    super();

    this.sources = sources;

    this.items = {};
    this.toLoad = this.sources.length;
    this.loaded = 0;

    this.setLoaders();
    this.startLoading();
  }

  setLoaders() {
    this.loaders = {};
    this.loaders.fbxLoader = new FBXLoader();

    // Setup Draco loader for compressed GLTF files
    this.loaders.dracoLoader = new DRACOLoader();
    this.loaders.dracoLoader.setDecoderPath('/draco/');

    // Setup GLTF loader with Draco support
    this.loaders.gltfLoader = new GLTFLoader();
    this.loaders.gltfLoader.setDRACOLoader(this.loaders.dracoLoader);

    this.loaders.textureLoader = new THREE.TextureLoader();
    this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader();
  }

  startLoading() {
    // Load each source
    for (const source of this.sources) {
      if (source.type === 'fbxModel') {
        console.log(`📦 Loading FBX: ${source.name} from ${source.path}`);
        this.loaders.fbxLoader.load(
          source.path,
          (file) => {
            console.log(`✓ Successfully loaded: ${source.name}`);
            this.sourceLoaded(source, file);
          },
          (progress) => {
            if (progress.lengthComputable) {
              const percent = (progress.loaded / progress.total * 100).toFixed(2);
              console.log(`⏳ Loading ${source.name}: ${percent}%`);
            }
          },
          (error) => {
            console.error(`❌ Error loading ${source.name} from ${source.path}:`, error);
            console.error('Error details:', {
              message: error.message,
              type: error.type,
              target: error.target
            });
            this.sourceLoaded(source, null);
          }
        );
      } else if (source.type === 'texture') {
        this.loaders.textureLoader.load(
          source.path,
          (file) => {
            this.sourceLoaded(source, file);
          },
          undefined,
          (error) => {
            console.error(`Error loading ${source.name}:`, error);
            this.sourceLoaded(source, null);
          }
        );
      } else if (source.type === 'gltfModel') {
        console.log(`📦 Loading GLTF/GLB: ${source.name} from ${source.path}`);
        this.loaders.gltfLoader.load(
          source.path,
          (gltf) => {
            console.log(`✓ Successfully loaded: ${source.name}`);
            this.sourceLoaded(source, gltf.scene);
          },
          (progress) => {
            if (progress.lengthComputable) {
              const percent = (progress.loaded / progress.total * 100).toFixed(2);
              console.log(`⏳ Loading ${source.name}: ${percent}%`);
            }
          },
          (error) => {
            console.error(`❌ Error loading ${source.name} from ${source.path}:`, error);
            this.sourceLoaded(source, null);
          }
        );
      } else if (source.type === 'cubeTexture') {
        this.loaders.cubeTextureLoader.load(
          source.path,
          (file) => {
            this.sourceLoaded(source, file);
          },
          undefined,
          (error) => {
            console.error(`Error loading ${source.name}:`, error);
            this.sourceLoaded(source, null);
          }
        );
      }
    }
  }

  sourceLoaded(source, file) {
    this.items[source.name] = file;

    this.loaded++;

    console.log(`📊 Progress: ${this.loaded}/${this.toLoad} assets loaded`);

    if (file === null) {
      console.warn(`⚠ ${source.name} loaded as null - file may be missing or corrupted`);
    }

    if (this.loaded === this.toLoad) {
      console.log('🎉 All resources loaded! Triggering ready event...');
      this.trigger('ready');
    }
  }
}
