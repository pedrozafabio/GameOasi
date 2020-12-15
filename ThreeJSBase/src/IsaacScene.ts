import * as THREE from "../node_modules/three/src/Three.js";
import IScene from "./IScene.js";
import { GLTFLoader, GLTF } from "../node_modules/three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "../node_modules/three/examples/jsm/controls/OrbitControls.js";
import GameObject from "./GameObject.js";
import { GUI } from "../node_modules/three/examples/jsm/libs/dat.gui.module.js";
import Button from "./Button.js";
import Image from './Image.js'
import Label from './Label.js'
import Panel from "./Panel.js";


export default class IsaacScene extends IScene{
    
    mixers: THREE.AnimationMixer[];
    controls: OrbitControls;
    gui : GUI;
    points = 0;

    hudAttached = true;

    constructor(container : HTMLElement, renderer : THREE.WebGLRenderer) {
        super(container, renderer);
        this.mixers = [];
        this.Init();

        window.addEventListener("beforeunload",()=>{ window.localStorage.setItem("LastPoints", this.points.toString())});
    }

    Init() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color('skyblue');

        if(window.localStorage.getItem('LastPoints'))
            this.points = parseInt(window.localStorage.getItem('LastPoints'));

        this.CreateCamera();
        this.CreateControls();
        this.CreateLights();

        let body = this.container;

        let label = new Label(body, [0, 50], true, 'pontos: ' + this.points, "5vh", "#ff0000", "Haettenschweiler");

        let panel = new Panel(body, 50, 50, [50,50], false, true, true, "https://jsonplaceholder.typicode.com/todos/");

        let button = new Button(body, 10, 10, [90, 90], true, "Botão", './imgs/batman.png', () => {
            // panel.SetVisible(!panel.visible)
            // this.points++;
            // label.UpdateText("pontos: " + this.points);
            // this.hudAttached = !this.hudAttached;
            // if(this.hudAttached)
            //     this.Destroy();
            //     else
            //     this.AttachHUD();
        });
        
        let image = new Image(body, 30, 30, [50,50], true, './imgs/batman.png');

        // this.hudObjects.push(label, panel, image);

        this.gui = new GUI();

        // this.gameObjects.push(new GameObject(this.scene, "teste"));
    }

    Update(dt: number) {
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
            (<THREE.PerspectiveCamera>this.camera).aspect = this.container.clientWidth/this.container.clientHeight;
            (<THREE.PerspectiveCamera>this.camera).updateProjectionMatrix();
        })
    }

    CreateLights() {
        /*const ambientLight = new THREE.AmbientLight( 0xffffff, 1 );
        scene.add( ambientLight );*/

        const mainLight = new THREE.DirectionalLight(0xffffff, 2.3);
        mainLight.position.set(100, 100, 100);

        this.scene.add(mainLight);

        const ambientLight = new THREE.HemisphereLight(
            0xddeeff, // bright sky color
            0x202020, // dim ground color
            1, // intensity
        );

        this.scene.add(ambientLight);
    }

    CreateControls() {
        this.controls = new OrbitControls(this.camera, this.container);
    }

    LoadModels() {
        const loader = new GLTFLoader();

        const onLoad = (gltf: GLTF, position : THREE.Vector3) => {
            const model = gltf.scene.children[0];

            model.position.copy(position);

            const animation = gltf.animations[0];

            const mixer = new THREE.AnimationMixer(model);
            this.mixers.push(mixer);

            const action = mixer.clipAction(animation);
            action.play();
            this.scene.add(model);
        }

        // the loader will report the loading progress to this function
        const onProgress = () => { };

        // the loader will send any error messages to this function, and we'll log
        // them to to console
        const onError = (errorMessage) => { console.log(errorMessage); };
    }
}