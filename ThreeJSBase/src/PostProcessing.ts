import * as THREE from "../node_modules/three/src/Three.js";
import { EffectComposer } from "../node_modules/three/examples/jsm/postprocessing/EffectComposer.js";
import { UnrealBloomPass } from "../node_modules/three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { RenderPass } from "../node_modules/three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "../node_modules/three/examples/jsm/postprocessing/ShaderPass.js";
import {
  fragmentShader as SBFragShader,
  vertexShader as SBVertexShader,
} from "./shaders/SeletiveBloom.js";
import { WebGLRenderer } from "../node_modules/three/src/Three.js";

export const ENTIRE_SCENE = 0;
export const BLOOM_SCENE = 1;

export default class BloomPostProcessing {
    darkMaterial = new THREE.MeshBasicMaterial({ color: "black" });
    materials = {};
    bloomComposer: EffectComposer;
    finalComposer: EffectComposer;
    bloomLayer: THREE.Layers;
    bloomPass: UnrealBloomPass;

    constructor(private scene : THREE.Scene, private camera : THREE.Camera, private renderer : WebGLRenderer, private container : HTMLElement, private backgroundTexture : THREE.Texture){
        this.Init();
    }
    
    
  Init() {
      
    this.bloomLayer = new THREE.Layers();
    this.bloomLayer.set(BLOOM_SCENE);

    const params = {
        bloomStrength: 1.2,
        bloomThreshold: 0.1,
        bloomRadius: 1,
      };
  
      var renderScene = new RenderPass(this.scene, this.camera);
  
      let bloomPass = new UnrealBloomPass(new THREE.Vector2(this.container.clientWidth,this.container.clientHeight),
        params.bloomStrength,
        params.bloomRadius,
        params.bloomThreshold
      );
  
      this.bloomComposer = new EffectComposer(this.renderer);
      this.bloomComposer.renderToScreen = false;
      this.bloomComposer.addPass(renderScene);
      this.bloomComposer.addPass(bloomPass);
  
      let materialShader = new THREE.ShaderMaterial({
        uniforms: {
          baseTexture: { value: null },
          bloomTexture: { value: this.bloomComposer.renderTarget2 },
        },
        vertexShader: SBVertexShader,
        fragmentShader: SBFragShader,
      });
  
      var effect = new ShaderPass(materialShader, "baseTexture");
      effect.needsSwap = true;
  
      this.finalComposer = new EffectComposer(this.renderer);
      this.finalComposer.addPass(renderScene);
      this.finalComposer.addPass(effect);
  }

  darkenNonBloomed = (obj) => {
    if (obj.isMesh && this.bloomLayer.test(obj.layers) === false) {
      this.materials[obj.uuid] = obj.material;
      obj.material = this.darkMaterial;
    }
  };

  restoreMaterial = (obj) => {
    if (this.materials[obj.uuid]) {
      obj.material = this.materials[obj.uuid];
      delete this.materials[obj.uuid];
    }
  };

  renderBloom() {
      this.scene.background = new THREE.Color("#000000");
      this.scene.traverse(this.darkenNonBloomed);
      this.bloomComposer.render();
      this.scene.background = this.backgroundTexture;
      this.scene.traverse(this.restoreMaterial);
    }
}