import * as THREE from "../node_modules/three/src/Three.js";
import IScene from "./IScene.js";
import Input from "./Input.js";
import { OrbitControls } from "../node_modules/three/examples/jsm/controls/OrbitControls.js";
import AssetsManager from "./AssetsManager.js";
import TextureAnimator from "./TextureAnimator.js";
import { EffectComposer } from '../node_modules/three/examples/jsm/postprocessing/EffectComposer.js';
import { UnrealBloomPass } from '../node_modules/three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { RenderPass } from '../node_modules/three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from "../node_modules/three/examples/jsm/postprocessing/ShaderPass.js";
import { fragmentShader as SBFragShader, vertexShader as SBVertexShader } from "./shaders/SeletiveBloom.js";
import { RGBShiftShader } from '../node_modules/three/examples/jsm/shaders/RGBShiftShader.js';

export default class TestingScene2 extends IScene {

    animatedTexture: TextureAnimator;
    controls;
    bloomPass;
    bloomComposer : EffectComposer;
    finalPass : ShaderPass;
    finalComposer: EffectComposer;
    darkMaterial = new THREE.MeshBasicMaterial( { color: "black" } );
    materials = {};
    ENTIRE_SCENE = 0;
    BLOOM_SCENE = 1;
    bloomLayer : THREE.Layers;		
    mesh: any;
    mat2: THREE.ShaderMaterial;

    constructor(container: HTMLElement, renderer: THREE.WebGLRenderer) {
        super(container, renderer);
        this.usePostProcessing = true;
        this.Init();

        console.log(SBFragShader + " " + SBVertexShader);
    }  
    

    Init() {
        this.scene = new THREE.Scene();
        // this.scene.background = new THREE.Color('black');
        this.bloomLayer = new THREE.Layers();	
        this.bloomLayer.set( this.BLOOM_SCENE );
        console.log(this.bloomLayer);

        this.CreateCamera();
        this.CreateControls();
        this.CreateLights();
        this.CreateScene();
        this.CreatePostProcessing();
    }

    CreateScene() {
        this.scene.traverse( this.disposeMaterial );

        this.scene.children.length = 0;

        var geo = new THREE.IcosahedronBufferGeometry( 1, 4 );

        for ( var i = 0; i < 50; i ++ ) {

            var color = new THREE.Color();
            color.setHSL( Math.random(), 0.7, Math.random() * 0.2 + 0.05 );

            var material = new THREE.MeshBasicMaterial( { color: color } );
            
            var sphere = new THREE.Mesh( geo, material );
            sphere.position.x = Math.random() * 10 - 5;
            sphere.position.y = Math.random() * 10 - 5;
            sphere.position.z = Math.random() * 10 - 5;
            sphere.position.normalize().multiplyScalar( Math.random() * 4.0 + 2.0 );
            sphere.scale.setScalar( Math.random() * Math.random() + 0.5 );
            
            this.scene.add( sphere );
            if ( Math.random() < 0.25 ) sphere.layers.enable( this.BLOOM_SCENE );

        }

        // let geometry = new THREE.PlaneGeometry(2.5, 1.25, 1, 1);
        // let mat = new THREE.MeshBasicMaterial( { color : "red"} );
        // this.mesh = new THREE.Mesh(geometry, mat);
        // this.mesh.position.set(2.5,0,15);
        
        // this.scene.add(this.mesh);
    }

    disposeMaterial = (obj) => {
        if ( obj.material ) {
            obj.material.dispose();
        }
    }

    CreatePostProcessing() {

        const params = {
            exposure: 1,
            bloomStrength: 5,
            bloomThreshold: 0,
            bloomRadius: 0
        };

        this.renderer.toneMapping =  THREE.ReinhardToneMapping;
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

    Update(dt: number) {
        if (Input.GetInstance().IsKeyPressed("a")) {
            this.usePostProcessing = !this.usePostProcessing;
            console.log("Enabling PostProcessing: " + this.usePostProcessing);
        }
    }

    CreateCamera() {
        const fov = 40; // AKA Field of View
        const aspect = this.container.clientWidth / this.container.clientHeight;
        const near = 1; // the near clipping plane
        const far = 2000; // the far clipping plane

        this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        // every object is initially created at ( 0, 0, 0 )
        // we'll move the camera back a bit so that we can view the scene
        this.camera.position.set(0, 0, 20);

        window.addEventListener("resize", () => {
            (<THREE.PerspectiveCamera>this.camera).aspect = this.container.clientWidth / this.container.clientHeight;
            (<THREE.PerspectiveCamera>this.camera).updateProjectionMatrix();
        })
    }

    CreateLights() {
        this.scene.add(new THREE.AmbientLight(0x404040));
    }

    CreateControls() {
        this.controls = new OrbitControls(this.camera, this.container);
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
            this.scene.traverse( this.darkenNonBloomed );
            this.bloomComposer.render();
            this.scene.traverse( this.restoreMaterial );
        } else {
            this.camera.layers.set( this.BLOOM_SCENE );
            this.bloomComposer.render();
            this.camera.layers.set( this.ENTIRE_SCENE );
        }
    }


}
