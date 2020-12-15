import * as THREE from "../node_modules/three/src/Three.js";
import IScene from "./IScene.js";
import GameObject from "./Character.js";
import Input from "./Input.js";
import { items } from "./ItemsDB.js";
import AssetsManager from "./AssetsManager.js";
import { EffectComposer } from '../node_modules/three/examples/jsm/postprocessing/EffectComposer.js';
import { UnrealBloomPass } from '../node_modules/three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { RenderPass } from '../node_modules/three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from "../node_modules/three/examples/jsm/postprocessing/ShaderPass.js";
import { fragmentShader as SBFragShader, vertexShader as SBVertexShader } from "./shaders/SeletiveBloom.js";
import { Color } from "../node_modules/three/src/Three.js";
import Game from "./Game.js";

export default class BuildAvatarScene extends IScene{
    
    mixers: THREE.AnimationMixer[];
    character : GameObject;

    HUD : HTMLElement[] = [];    

    animation : boolean = false;
    time : number = 0;
    posInit : THREE.Vector3;
    posFinal : THREE.Vector3;

    darkMaterial = new THREE.MeshBasicMaterial( { color: "black" } );
    materials = {};
    ENTIRE_SCENE = 0;
    BLOOM_SCENE = 1;
    bloomPass: UnrealBloomPass;
    bloomComposer: any;
    mat2: THREE.ShaderMaterial;
    finalComposer: EffectComposer;
    bloomLayer: THREE.Layers;
    
    headCameraPosition = new THREE.Vector3(0, 1.4, 2);
    bodyCameraPosition = new THREE.Vector3(0, 0, 10);
    posCamera : THREE.Vector3 = this.bodyCameraPosition;
    speedCamera : number = 5;
    timeTransition : number = 1;
   backgroundTexture : THREE.Texture;

    constructor(container : HTMLElement, renderer : THREE.WebGLRenderer) {
        super(container, renderer);
        this.mixers = [];
        
        this.usePostProcessing = Game.GetInstance().usePostProcessing;
        //@ts-ignore
        window.setEditAvatar(true);

        this.backgroundTexture = AssetsManager.GetInstance().LoadTexture('imgs/night.png');
        this.bloomLayer = new THREE.Layers();	
        this.bloomLayer.set( this.BLOOM_SCENE );
        console.log(this.bloomLayer);


        this.Init();
        this.CreatePostProcessing();


        //@ts-ignore
        window.THREEHUD.OnBuildAvatarScene(true);
        
    }

    dispose(){
        super.dispose();
        //@ts-ignore
        window.setEditAvatar(false);
        //@ts-ignore
        window.THREEHUD.OnBuildAvatarScene(false);
    }

    CreatePostProcessing() {

        const params = {
            exposure: 1,
            bloomStrength: 2,
            bloomThreshold: 0,
            bloomRadius: 1
        };

        var renderScene = new RenderPass(this.scene, this.camera);

        this.bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);

        this.bloomPass.threshold = params.bloomThreshold;
        this.bloomPass.strength = params.bloomStrength;
        this.bloomPass.radius = params.bloomRadius;
        
        this.bloomComposer = new EffectComposer(this.renderer);
        this.bloomComposer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.bloomComposer.renderToScreen = false;
        this.bloomComposer.addPass(renderScene);
        this.bloomComposer.addPass(this.bloomPass);
        
       this.mat2 = new THREE.ShaderMaterial( {
        uniforms: {
            baseTexture: { value: null },
            bloomTexture: {  value : this.bloomComposer.renderTarget2}
         },
            vertexShader: SBVertexShader,
            fragmentShader: SBFragShader
        });

        var effect = new ShaderPass( this.mat2, "baseTexture" );
        effect.needsSwap = true;
        var renderScene2 = new RenderPass(this.scene, this.camera);

        this.finalComposer = new EffectComposer( this.renderer );
		this.finalComposer.addPass( renderScene2 );
        this.finalComposer.addPass( effect);
        

        this.composer.addPass(renderScene);
    }

    Init() {
        this.scene = new THREE.Scene();
        this.scene.background = this.backgroundTexture;


        this.CreateCamera();
        this.CreateLights();

        this.character = new GameObject(this.scene);
        this.gameObjects.push(this.character);
        this.character.object.traverse(x => x.name.includes('cabeca') ? x.layers.enable(this.BLOOM_SCENE) : null);

        this.initHUD();
    }
           
    Update(dt: number) {   
        for (const go of this.gameObjects) {
            go?.Update(dt);
        }
    }

    darkenNonBloomed = (obj) => {
        // console.log(this.bloomLayer);
        if ( obj.isMesh && this.bloomLayer.test( obj.layers ) === false ) {
             this.materials[ obj.uuid ] = obj.material;
             obj.material = this.darkMaterial;
         }
    }

  restoreMaterial = (obj) => {
        if ( this.materials[ obj.uuid ] ) {
            obj.material = this.materials[ obj.uuid ];
            delete this.materials[ obj.uuid ];
        }
    }

    Render(){
        if (this.scene && this.camera) {
            if (this.usePostProcessing) {
                
                this.renderBloom(true);
                this.finalComposer.render();

            } else {
                this.renderer.render(this.scene, this.camera);
            }
        }
    }

    renderBloom( mask : boolean ) {

        if (mask) {
            this.scene.background = new Color("#000000");

            this.scene.traverse( this.darkenNonBloomed );
            this.bloomComposer.render();
            this.scene.background = this.backgroundTexture;

            this.scene.traverse( this.restoreMaterial );
        } else {
            this.camera.layers.set( this.BLOOM_SCENE );
            this.bloomComposer.render();
            this.camera.layers.set( this.ENTIRE_SCENE );
        }
    }

    CreateCamera() {
        const fov = 35; // AKA Field of View
        const aspect = this.container.clientWidth / this.container.clientHeight;
        const near = 0.1; // the near clipping plane
        const far = 1000; // the far clipping plane

        this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        // every object is initially created at ( 0, 0, 0 )
        // we'll move the camera back a bit so that we can view the scene
        this.camera.position.set(this.posCamera.x, this.posCamera.y, this.posCamera.z);      

        window.addEventListener("resize", ()=>{
            (<THREE.PerspectiveCamera>this.camera).aspect = this.container.clientWidth/this.container.clientHeight;
            (<THREE.PerspectiveCamera>this.camera).updateProjectionMatrix();
        })
    }

    CreateLights() {
        const light2 = new THREE.DirectionalLight();
        light2.intensity = 2;
        light2.position.z = -20;
        this.scene.add(light2);

        const light = new THREE.DirectionalLight();    
        light.intensity = 2;
        light.position.z = 20;
        this.scene.add(light);
    }
    
}
