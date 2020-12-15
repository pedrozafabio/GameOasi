import * as THREE from "../node_modules/three/src/Three.js";
import IScene from "./IScene.js";
import GameObject from "./Character.js";
import Input from "./Input.js";
import { OrbitControls } from "../node_modules/three/examples/jsm/controls/OrbitControls.js";
import AssetsManager from "./AssetsManager.js";
import TextureAnimator from "./TextureAnimator.js";
import { EffectComposer } from '../node_modules/three/examples/jsm/postprocessing/EffectComposer.js';
import { UnrealBloomPass } from '../node_modules/three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { RenderPass } from '../node_modules/three/examples/jsm/postprocessing/RenderPass.js';
import { timeStamp } from "console";

export default class TestingScene extends IScene{
    
    animatedTexture : TextureAnimator;
    material;
    geometry;
    mesh : THREE.Mesh;
    posCamera : THREE.Vector3;
    controls;
    bloomPass;
    constructor(container : HTMLElement, renderer : THREE.WebGLRenderer) {
        super(container, renderer);      
        this.usePostProcessing = false;
        this.Init();
        AssetsManager.GetInstance().LoadTexture('imgs/spritesheets/run.png');    
        AssetsManager.GetInstance().LoadTexture('imgs/smokeparticle.png')
        AssetsManager.GetInstance().LoadTexture('imgs/dot.png')
    }

    proton;
    emitter1;
    emitter2;
    R;

    initProton() {
        //@ts-ignore

            this.proton = new Proton();
    
            this.R = 70;
            this.emitter1 = this.createEmitter(this.R, 0, '#4F1500', '#0029FF');
            this.emitter2 = this.createEmitter(-this.R, 0, '#004CFE', '#6600FF');
    
            this.proton.addEmitter(this.emitter1);
            this.proton.addEmitter(this.emitter2);
        //@ts-ignore
            this.proton.addRender(new Proton.SpriteRender(this.scene));
    

    }

     createMesh(geo) {
         var geometr;
        if (geo == "sphere") {
            geometr = new THREE.SphereGeometry(10, 8, 8);
            var material = new THREE.MeshLambertMaterial({
                color: "#ff0000"
            });
        } else {
            geometr = new THREE.BoxGeometry(20, 20, 20);
            var material = new THREE.MeshLambertMaterial({
                color: "#00ffcc"
            });
        }

        var mesh = new THREE.Mesh(geometr, material);
        return mesh;
    }

   createSprite() {
        var map = AssetsManager.GetInstance().LoadTexture('imgs/dot.png') ;
        var material = new THREE.SpriteMaterial({
            map: map,
            color: 0xff0000,
            blending: THREE.AdditiveBlending,
            fog: true
        });
        return new THREE.Sprite(material);
    }

    createEmitter(x,y,color1,color2) {
        //@ts-ignore
        var emitter = new Proton.Emitter();
        //@ts-ignore
        emitter.rate = new Proton.Rate(new Proton.Span(5, 7), new Proton.Span(.01, .02));
        //@ts-ignore
        emitter.addInitialize(new Proton.Mass(1));
        //@ts-ignore
        emitter.addInitialize(new Proton.Life(2));
        //@ts-ignore
        emitter.addInitialize(new Proton.Body(this.createSprite()));
        //@ts-ignore
        emitter.addInitialize(new Proton.Radius(80));
        //@ts-ignore
        emitter.addInitialize(new Proton.V(200, new Proton.Vector3D(0, 0, -1), 0));

//@ts-ignore
        emitter.addBehaviour(new Proton.Alpha(1, 0));
        //@ts-ignore
        emitter.addBehaviour(new Proton.Color(color1, color2));
        //@ts-ignore
        emitter.addBehaviour(new Proton.Scale(1, 0.5));
        //@ts-ignore
        emitter.addBehaviour(new Proton.CrossZone(new Proton.ScreenZone(this.camera, this.renderer), 'dead'));

//@ts-ignore
        emitter.addBehaviour(new Proton.Force(0, 0, -20));
        // emitter.addBehaviour(new Proton.Attraction({
        //     x: 0,
        //     y: 0,
        //     z: 0
        // }, 5, 250));



        emitter.p.x = x;
        emitter.p.y = y;
        emitter.emit();

        return emitter;
    }

    tha = 0;

   params = {
        exposure: 0.2,
        bloomStrength: 1,
        bloomThreshold: 0,
        bloomRadius: 0
    };
    
    Init() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color('black');

        this.CreateCamera();
        this.CreateControls();
        this.CreateLights();

        this.bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
        
        this.bloomPass.threshold = this.params.bloomThreshold;
        this.bloomPass.strength = this.params.bloomStrength;
        this.bloomPass.radius = this.params.bloomRadius;        
        
        var renderScene = new RenderPass( this.scene, this.camera );
        
        this.composer.addPass( renderScene );
        this.composer.addPass( this.bloomPass );
        

    }
           
    Update(dt: number) {

if(Input.GetInstance().IsKeyPressed("a")){
    this.usePostProcessing = !this.usePostProcessing;
    console.log("test");
}

        if (!AssetsManager.GetInstance().loading) {
            if(!this.animatedTexture){
                console.log('init');
                this.initProton();
                this.addStars();
                this.geometry = new THREE.PlaneGeometry(2.5, 1.25, 1, 1);
                this.animatedTexture = new TextureAnimator(AssetsManager.GetInstance().LoadTexture('imgs/spritesheets/run.png'),6, 4, 2);
                this.material = new THREE.MeshBasicMaterial( { map: this.animatedTexture.texture, side:THREE.DoubleSide } );
                this.mesh = new THREE.Mesh(this.geometry, this.material);
                this.mesh.position.set(0,0,-3);
                this.scene.add(this.mesh);
                // const material: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial()
                // material.color = new THREE.Color(0x00ff00);
                // material.wireframe = true;
                // const boxGeometry: THREE.BoxGeometry = new THREE.BoxGeometry()
                // const cube: THREE.Mesh = new THREE.Mesh(boxGeometry, material)
                
                // this.scene.add(cube)
                // this.gameObjects.push(new GameObject(this.scene));
                
            }else{
                this.animateEmitter();
                this.proton.update();
               this.animatedTexture.Update(dt);
            }
        }
    }
    
    addStars() {
        var geometry = new THREE.Geometry();
        for (var i = 0; i < 10000; i++) {
            var vertex = new THREE.Vector3();
            vertex.x = THREE.MathUtils.randFloatSpread(2000);
            vertex.y = THREE.MathUtils.randFloatSpread(2000);
            vertex.z = THREE.MathUtils.randFloatSpread(2000);
            geometry.vertices.push(vertex);
        }
        var particles = new THREE.Points(geometry, new THREE.PointsMaterial({
            color: 0x888888
        }));
        this.scene.add(particles);
    }

    CreateCamera() {
        const fov = 75; // AKA Field of View
        const aspect = this.container.clientWidth / this.container.clientHeight;
        const near = 0.1; // the near clipping plane
        const far = 10000; // the far clipping plane

        this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        // every object is initially created at ( 0, 0, 0 )
        // we'll move the camera back a bit so that we can view the scene
        this.camera.position.set(0,0,3);      

        window.addEventListener("resize", ()=>{
            (<THREE.PerspectiveCamera>this.camera).aspect = this.container.clientWidth/this.container.clientHeight;
            (<THREE.PerspectiveCamera>this.camera).updateProjectionMatrix();
        })
    }

    CreateLights() {
        /*const ambientLight = new THREE.AmbientLight( 0xffffff, 1 );
        scene.add( ambientLight );*/
        const light2 = new THREE.DirectionalLight();
        light2.intensity = 1;
        light2.position.z = -20;
        this.scene.add(light2);

        const light = new THREE.DirectionalLight();    
        light.intensity = 1;
        light.position.z = 20;
        this.scene.add(light);
    }

    CreateControls() {
        this.controls = new OrbitControls(this.camera, this.container);
    }
  
     animateEmitter() {
        this.tha += .13;
        this.emitter1.p.x = this.R * Math.cos(this.tha);
        this.emitter1.p.y = this.R * Math.sin(this.tha);

        this.emitter2.p.x = this.R * Math.cos(this.tha + Math.PI / 2);
        this.emitter2.p.y = this.R * Math.sin(this.tha + Math.PI / 2);
    }
    
}
