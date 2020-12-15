import { GUI } from "../node_modules/three/examples/jsm/libs/dat.gui.module.js";
import { MapControls } from "../node_modules/three/examples/jsm/controls/OrbitControls.js";
import { GLTF, GLTFLoader } from "../node_modules/three/examples/jsm/loaders/GLTFLoader.js";
import {RGBELoader} from '../node_modules/three/examples/jsm/loaders/RGBELoader.js';
import * as THREE from "../node_modules/three/src/Three.js";
import {RoughnessMipmapper} from '../node_modules/three/examples/jsm/utils/RoughnessMipmapper.js'
import Game from "./Game.js";
import Input from "./Input.js";
import IScene from "./IScene.js"
import Scene from "./Scene.js";
import { AmbientLight, Mesh, MeshStandardMaterial, Object3D, PMREMGenerator, Raycaster, SpotLight, OrthographicCamera, Texture, DirectionalLight } from "../node_modules/three/src/Three.js";
import {OutlinePass} from 'three/examples/jsm/postprocessing/OutlinePass'
import TransitionScene from "./TransitionScene.js";
import ArtGalleryScene from "./ArtGalleryScene.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import Stand from './Classes/Feira/Stand'
import { isObject } from "util";
import AssetsManager from "./AssetsManager.js";

///TODO
/*
    make stands clickable and make use feedback when mouse is over a stand
    call react component to show info on the stand and stuff

*/

export default class FeiraScene extends IScene{
    container : HTMLElement;
    timer : number;
    raycaster : THREE.Raycaster;
    controls: MapControls;
    gui : GUI;
    end : boolean;
    ready : boolean;
    outlinePass : OutlinePass;
    raycatser : Raycaster;
    json : any;
    backgroundTexture: Texture;

    constructor(){
        super(Game.GetInstance().container, Game.GetInstance().renderer);

        this.end = false;

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color('skyblue');

        const fov = 35; // AKA Field of View
        const aspect = this.container.clientWidth / this.container.clientHeight;
        const near = 0.1; // the near clipping plane
        const far = 800; // the far clipping plane

        // this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        // // every object is initially created at ( 0, 0, 0 )
        // // we'll move the camera back a bit so that we can view the scene
        // this.camera.position.set(-1.5, 1.5, 6.5);

        this.raycaster = new THREE.Raycaster();


        // window.addEventListener("resize", ()=>{
        //     (<THREE.PerspectiveCamera>this.camera).aspect = this.container.clientWidth/this.container.clientHeight;
        //     (<THREE.PerspectiveCamera>this.camera).updateProjectionMatrix();
        // });

        // this.controls = new MapControls(this.camera, this.container);
        // this.controls.enableDamping = true;
        // this.controls.dampingFactor = 0.05;

        // this.controls.maxPolarAngle = Math.PI / 2.5;

        // cGUI.add(this.controls, "screenSpacePanning", false); //true controls become Orbit Controls, false Map controls
        // cGUI.add(this.controls, "dampingFactor", 0,1,0.01); //Smoothing of movement
        // cGUI.add(this.controls, "maxPolarAngle", -2*Math.PI, 2*Math.PI, 0.1); //Max vertical angle in radians
        // cGUI.add(this.controls, "minPolarAngle", -2*Math.PI, 2*Math.PI, 0.1); //Min vertical angle in radians 0 is 90º from a horizontal plane
        // cGUI.add(this.controls, "maxDistance", 1, 300, 0.1); //Max distance from the 0 position in Y

        this.timer = 5;


        fetch("/feira.json").then(response =>{
            response.json().then(json=>{
                this.json = json;


                let feira = AssetsManager.GetInstance().LoadObject("models/feiraDeExposicaoConvida.glb");
               
                    feira.scene.traverse(object =>{
                        //console.log(object);
                        object.receiveShadow =true;
                        object.castShadow = true;
                        if(object.name in this.json){
                            let a = this.json[object.name] as Stand
                            console.log(a);
                            object.userData.onClick = ()=>{
                                // //@ts-ignore
                                // window.THREEStand.SetStand(a);
                                 //@ts-ignore
                                window.showStandModal(a);
                            };
                            object.userData.name = a.vendedor;
                        }

                        if(object.name === "Camera"){
                            this.camera = new OrthographicCamera(
                                -16, 
                                16,
                                9,
                                -9,
                                0.1,
                                5000
                            );
                            console.log(object);
                            console.log(this.camera);

                            this.camera.position.copy(object.position);
                            this.camera.rotation.set(-42.4,-51,0);

                            this.raycaster = new THREE.Raycaster();


                            // window.addEventListener("resize", ()=>{
                            //     (this.camera).aspect = this.container.clientWidth/this.container.clientHeight;
                            //     (this.camera).updateProjectionMatrix();
                            // });

                            this.controls = new MapControls(this.camera, this.container);
                            this.controls.enableDamping = true;
                            this.controls.dampingFactor = 0.05;
                            this.controls.minPolarAngle = 0;
                            this.controls.maxPolarAngle = Math.PI / 2.5;
                            this.controls.enableKeys = false;
                            this.controls.enablePan = true;
                            this.controls.enableRotate = false;

                            // cGUI.add(this.controls, "screenSpacePanning", false); //true controls become Orbit Controls, false Map controls
                            // cGUI.add(this.controls, "dampingFactor", 0,1,0.01); //Smoothing of movement
                            // cGUI.add(this.controls, "maxPolarAngle", -2*Math.PI, 2*Math.PI, 0.1); //Max vertical angle in radians
                            // cGUI.add(this.controls, "minPolarAngle", -2*Math.PI, 2*Math.PI, 0.1); //Min vertical angle in radians 0 is 90º from a horizontal plane
                            // cGUI.add(this.controls, "maxDistance", 1, 300, 0.1); //Max distance from the 0 position in Y


                            this.scene.add(this.camera);
                        }
                    });

                    this.outlinePass = new OutlinePass(new THREE.Vector2(this.container.clientWidth,this.container.clientHeight), this.scene, this.camera);
                    this.raycaster = new Raycaster();

                    let light = new AmbientLight(0xffffff, 2);
                    this.scene.add(light);

                    let origin = new Object3D();
                    this.scene.add(origin);
                    let directionalLight = new DirectionalLight(0xffffff, 2);
                    directionalLight.target = origin;
                    this.scene.add(directionalLight);

                    this.backgroundTexture = AssetsManager.GetInstance().LoadTexture('imgs/nigh2.jpg');
                    this.scene.background = this.backgroundTexture; 

                    this.composer.addPass(new RenderPass(this.scene, this.camera));
                    this.composer.addPass(this.outlinePass);
                    this.usePostProcessing = true;
                    this.scene.add(...feira.scene.children);
                    console.log(this.scene);
                    this.ready = true;
                });
            })
    }

    Update(dt: number): void {
        this.controls?.update();


        if(!this.end && this.ready){

            this.raycaster.setFromCamera(Game.GetInstance().input.mouse, this.camera);
            let intersectedObjects = this.raycaster.intersectObjects(this.scene.children);

            if(intersectedObjects.length > 0){
                if(intersectedObjects[0].object.name.startsWith("Stand")){
                    this.outlinePass.selectedObjects = [intersectedObjects[0].object];
                    if(Input.GetInstance().IsMouseKeyPressed(Input.MouseButtons.left)){
                        if(intersectedObjects[0].object.userData.onClick){
                            console.log(intersectedObjects[0].object.userData);
                            
                            if(intersectedObjects[0].object.userData?.name){
                                console.log("Adding vendedor");
                                Game.GetInstance().gameChat.chatObject.CreatePrivateChannel(intersectedObjects[0].object.userData?.name)
                            }
                            intersectedObjects[0].object.userData.onClick();
                        }
                    }
                }
            }
        }
    }

}
