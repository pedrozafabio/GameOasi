import * as THREE from "./../node_modules/three/src/Three.js";
import { GLTFLoader, GLTF } from "../node_modules/three/examples/jsm/loaders/GLTFLoader.js";
import { Object3D, Group, TextureLoader, Texture, LoadingManager } from "./../node_modules/three/src/Three.js";
import { cloneGltf } from "./CloneGLTF.js";

export default class AssetsManager {
    
    static instance : AssetsManager;
    manager : LoadingManager = new LoadingManager();
    loader : GLTFLoader = new GLTFLoader(this.manager);
    textureLoader : TextureLoader = new TextureLoader(this.manager);
    loading : boolean = false;

    // chave -> path
    // value -> GLTF
    objectsInstances = {}; 
    
    // key -> path
    // value -> Texture
    textures = {}

    private constructor() {
        AssetsManager.instance = this;

        this.manager.onStart = (url, itemsLoaded, itemsTotal) => {
            this.loading = true;
            console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
        }

        this.manager.onLoad = () => {
            this.loading = false;
            console.log( 'Loading complete!');
            console.log(this.objectsInstances)
            console.log(this.textures);
        };

        this.manager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
            console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
        };

        this.manager.onError = function ( url ) {
            console.log( 'There was an error loading ' + url );
        };
    }

    static GetInstance(): AssetsManager {
        if (AssetsManager.instance)
            return AssetsManager.instance;

        new AssetsManager();
        return AssetsManager.instance;
    }

    LoadObject(path : string, instance = false) : GLTF {  
        let objectExists = this.objectsInstances[path];
       
        if (objectExists) {
            // console.log("The Object from path "+path+" was already loaded.");
            return instance ? objectExists : cloneGltf(objectExists);
        }

        this.loader.load(path, (gltf) => {
            this.objectsInstances[path] = gltf;
            return this.objectsInstances[path];
        });
    }

    LoadTexture(path : string) : Texture {
        let texture = this.textures[path];

        if(texture){
            // console.log("The Texture from path "+path+" was already loaded.");
            return texture;
        }

        this.textureLoader.load(path, t => {
            this.textures[path] = t;
            return t;
        })
    }

}