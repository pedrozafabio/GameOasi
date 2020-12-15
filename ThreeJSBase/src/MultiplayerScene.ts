import * as THREE from "../node_modules/three/src/Three.js";
import IScene from "./IScene.js";
import { GLTFLoader, GLTF } from "../node_modules/three/examples/jsm/loaders/GLTFLoader.js";
import { MapControls, OrbitControls } from "../node_modules/three/examples/jsm/controls/OrbitControls.js";
import GameObject from "./GameObject.js";
import { GUI } from "../node_modules/three/examples/jsm/libs/dat.gui.module.js";
import '../src/photon/Photon-Javascript_SDK.js';
import { WebGLRenderer } from "../node_modules/three/src/Three.js";

export default class MultiplayerScene extends IScene{
    public container: any;
    camera: THREE.PerspectiveCamera;
    scene: THREE.Scene;
    mixers: THREE.AnimationMixer[];
    controls: MapControls;
    gameObjects: GameObject[];
    gui : GUI;
    loadBalancer : Photon.LoadBalancing.LoadBalancingClient;

    constructor(container : any, renderer : WebGLRenderer) {
        super(container, renderer);
        this.container = container;
        this.mixers = [];
        this.gameObjects = [];
        this.Init();
        this.loadBalancer = new Photon.LoadBalancing.LoadBalancingClient(Photon.ConnectionProtocol.Wss, 'd761e1e3-1035-4fea-ad9b-40ada84f6636', '1.0.0');
    }

    Init() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color('skyblue');
        this.gui = new GUI();

        this.CreateCamera();
        this.CreateControls();
        this.CreateLights();
        this.LoadModels();

        this.gameObjects.push(new GameObject(this.scene, "yukari"));
    }

    Update(dt: number) {
        this.controls.update();
        for (const go of this.gameObjects) {
            go?.Update(dt);
        }
    }

    CreateCamera() {
        const fov = 35; // AKA Field of View
        const aspect = this.container.clientWidth / this.container.clientHeight;
        const near = 0.1; // the near clipping plane
        const far = 800; // the far clipping plane

        this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        // every object is initially created at ( 0, 0, 0 )
        // we'll move the camera back a bit so that we can view the scene
        this.camera.position.set(-1.5, 1.5, 6.5);

        window.addEventListener("resize", ()=>{
            this.camera.aspect = this.container.clientWidth/this.container.clientHeight;
            this.camera.updateProjectionMatrix();
        })
    }

    CreateLights() {
        /*const ambientLight = new THREE.AmbientLight( 0xffffff, 1 );
        scene.add( ambientLight );*/

        const mainLight = new THREE.SpotLight(0xffffff, 5);
        let folder = this.gui.addFolder("Light");
        mainLight.castShadow = true;
        mainLight.position.set(1, 15, 15);
        mainLight.target.position.set(-4,0,-4);

        const UpdateCamera = ()=>{
            mainLight.shadow.camera.updateProjectionMatrix();
            shadowCameraHelper.update();
        }

        folder.add(mainLight.position, "x");
        folder.add(mainLight.position, "y");
        folder.add(mainLight.position, "z");
        //Shadows made in threejs are controlled by a perspective camera, it's projection is computed to calculate shadow 
        folder.add(mainLight.shadow.camera, "near",0).onChange(UpdateCamera); //near plane of the camera, start of the shadow calculation
        folder.add(mainLight.shadow.camera, "far",0).onChange(UpdateCamera); //far plane of the camera or the max distance

        folder.add(mainLight, "intensity", 0);

        var shadowCameraHelper = new THREE.CameraHelper(mainLight.shadow.camera);
        shadowCameraHelper.visible = true;
        this.scene.add(shadowCameraHelper);

        this.scene.add(mainLight);

        // const ambientLight = new THREE.HemisphereLight(
        //     0xddeeff, // bright sky color
        //     0x202020, // dim ground color
        //     1, // intensity
        // );

        // this.scene.add(ambientLight);
    }

    CreateControls() {
        let cGUI = this.gui.addFolder("Controls");

        this.controls = new MapControls(this.camera, this.container);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;

        this.controls.maxPolarAngle = Math.PI / 2.5;

        cGUI.add(this.controls, "screenSpacePanning", false); //true controls become Orbit Controls, false Map controls
        cGUI.add(this.controls, "dampingFactor", 0,1,0.01); //Smoothing of movement
        cGUI.add(this.controls, "maxPolarAngle", -2*Math.PI, 2*Math.PI, 0.1); //Max vertical angle in radians
        cGUI.add(this.controls, "minPolarAngle", -2*Math.PI, 2*Math.PI, 0.1); //Min vertical angle in radians 0 is 90º from a horizontal plane
        cGUI.add(this.controls, "maxDistance", 1, 300, 0.1); //Max distance from the 0 position in Y
    }

     LoadModels() {

        const onLoad = (gltf: GLTF) => {
            // const model = gltf.scene.children[0];
            console.log(gltf.scene.children);

            let meshes = [];
            gltf.scene.traverse((obj)=>{
                console.log(obj);
                obj.receiveShadow = true;
                if(obj.name != "Plane")
                    obj.castShadow = true;
                meshes.push(obj);
            })
            this.scene.add(...meshes);

            // gltf.scene.children.map((c)=>{
            //     console.log(c);
            //     this.scene.add(c);
            // })
            //this.scene.add(...gltf.scene.children);
            // const animation = gltf.animations[0];

            // const mixer = new THREE.AnimationMixer(model);
            // this.mixers.push(mixer);

            // const action = mixer.clipAction(animation);
            // action.play();
            // this.scene.add(model);
        }

        // // the loader will report the loading progress to this function
        const onProgress = () => { };

        // // the loader will send any error messages to this function, and we'll log
        // // them to to console
        const onError = (errorMessage) => { console.log(errorMessage); };

        loader.load("models/plano.glb", onLoad, onProgress, onError);
    }
}


const loader = new GLTFLoader();
function ModelLoader(url : string) : Promise<GLTF>{
    return new Promise((resolve, reject)=>{
        loader.load(url, data=>resolve(data), null, reject);
    })
}