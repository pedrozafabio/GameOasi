import * as THREE from "../node_modules/three/src/Three.js";
import IScene from "./IScene.js";
import { GLTFLoader, GLTF } from "../node_modules/three/examples/jsm/loaders/GLTFLoader.js";
import { MapControls, OrbitControls } from "../node_modules/three/examples/jsm/controls/OrbitControls.js";
import GameObject from "./GameObject.js";
import { GUI } from "../node_modules/three/examples/jsm/libs/dat.gui.module.js";
import { CanvasTexture, Mesh, MeshBasicMaterial, Object3D, Vector3, VideoTexture } from "../node_modules/three/src/Three.js";
import GameClient from './GameClient.js'
import Input from "./Input.js";
import GameChat from "./GameChat.js";
import Game from "./Game.js"
import Queue from "./Queue.js";
import ChatObject from "./ChatObject.js";
import IGameObject from "./IGameObject.js";
import VideoElement from "./VideoElement.js";
import { CSS3DObject } from "../node_modules/three/examples/jsm/renderers/CSS3DRenderer.js";
import YoutubeCssObject from "./YoutubeCssObject.js";

export default class Scene extends IScene{
    messages : any;
    mixers: THREE.AnimationMixer[];
    controls: MapControls;
    gui : GUI;
    client : GameClient;
    otherObject : Object3D;
    clientChat : GameChat;
    raycaster : THREE.Raycaster;

    cssScene : THREE.Scene;

    currentObject : THREE.Object3D;
    /*
    * TODO: make the chat ui html and css in code
    */

    json : any;

    constructor(container : HTMLElement, renderer : THREE.WebGLRenderer, roomConfigurations = {}) {
        super(container, renderer);
        this.mixers = [];
        this.client = Game.GetInstance().gameClient;
        this.clientChat = Game.GetInstance().gameChat;

        this.cssScene = new THREE.Scene();

        //Chat UI
        this.messages = {};

        this.json = fetch('/streams.json').then(
            response =>response.json()).then(json => {
                this.json = json

        });
        // this.ConnectToRoom({...roomConfigurations, ...{
        //     "Map" : 2,
        //     "Type" : "Show"
        // }});
        this.SetCallbacks();

        this.Init();

    }

    AddGameObject(object : GameObject){
        this.gameObjects.push(object);
    }

    Init() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color('skyblue');
        this.gui = new GUI();

        this.raycaster = new THREE.Raycaster();

        console.log(this.raycaster);


        this.CreateCamera();
        this.CreateControls();
        this.CreateLights();
        this.LoadModels();

        this.AddGameObject(new GameObject(this.scene, "yukari"/*, this.client*/));
    }

    Update(dt: number) {
        this.controls.update();

        this.raycaster.setFromCamera(Game.GetInstance().input.mouse, this.camera);
        let intersectedObjects = this.raycaster.intersectObjects(this.scene.children);

        if(intersectedObjects.length > 0){
            //console.log(intersectedObjects[0]);

            if(intersectedObjects[0].object.userData?.name === 'OtherWindow'){
                this.container.style.pointerEvents = 'none';
            }else{
                this.container.style.pointerEvents = 'auto';
            }

            if(intersectedObjects[0].object.userData?.type === "Actor"){
                if(Game.GetInstance().input.IsMouseKeyPressed(Input.MouseButtons.left)){
                    Game.GetInstance().gameChat.chatObject.CreatePrivateChannel(intersectedObjects[0].object.userData?.name);
                    Game.GetInstance().gameChat.sendPrivateMessage(intersectedObjects[0].object.userData?.name, `/*/Invite ${JSON.stringify(
                        Game.GetInstance().gameClient.myRoom()._customProperties
                    )}`);
                }
            }
        }

        for (const go of this.gameObjects) {
            go?.Update(dt);
        }

    }

    Render(): void {
        super.Render();
        Game.GetInstance().cssRenderer.render(this.cssScene, this.camera);
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

        const mainLight = new THREE.SpotLight(0xffffff, 45);

        const ambientLight = new THREE.HemisphereLight(
            0xddeeff, // bright sky color
            0x202020, // dim ground color
            1, // intensity
        );

        this.scene.add(ambientLight);
        let folder = this.gui.addFolder("Light");
        mainLight.castShadow = true;
        mainLight.position.set(1, 25, 15);
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
            //console.log(gltf.scene.children);
            let meshes = [];

            gltf.scene.traverse((obj)=>{
                obj.receiveShadow = true;

                if(obj.type !== 'Group'){
                    console.log(obj);
                    if(obj.name.includes('Screen')){
                        let screen = obj as THREE.Mesh;

                        let objectToAdd = new YoutubeCssObject(screen, this.json.stream['Screen']);
                        this.scene.add(objectToAdd.glObject);
                        this.cssScene.add(objectToAdd.cssObject);
                        obj.visible = false;
                    }
                    else{
                        meshes.push(obj);
                    }
                    meshes.push(obj);
                }
            })
            console.log(meshes);

            this.scene.add(gltf.scene);
        }

        // // the loader will report the loading progress to this function
        const onProgress = () => { };

        // // the loader will send any error messages to this function, and we'll log
        // // them to to console
        const onError = (errorMessage : ErrorEvent) => { console.log(errorMessage); };

        loader.load("models/interiorPalco2.glb", onLoad, onProgress, onError);
    }

    ///Checks if player is in a Lobby before trying to join a room
    // ConnectToRoom(){
    //     this.client.ConnectToRoom({
    //         "stage":"1"
    //     });
    // }

    SetCallbacks(){


        this.client.onActorJoinCallback = (actor : Photon.LoadBalancing.Actor)=>{
            console.log(actor);

            if(!actor.isLocal){
                let object : THREE.Object3D;
                let loader = new GLTFLoader();
                loader.load("models/Flamingo.glb", (gltf)=>{

                    object = gltf.scene.children[0];
                    object.scale.set(0.1,0.1,0.1);
                    console.log(`Added actor ${actor.actorNr}`);
                    this.otherActors[actor.actorNr] = object;
                    object.userData.name = actor.name;
                    object.userData.type = "Actor";
                    console.log(this.otherActors);
                    this.scene.add(object);
                });
            }
        };

        this.client.onActorLeaveCallback = (actor : Photon.LoadBalancing.Actor) => {
            if(!actor.isLocal){
                let object = this.otherActors[actor.actorNr] as THREE.Object3D;
                this.scene.remove(object);
            }
        }

        this.client.onEventCallback = (number, content, actorNumber)=>{
            if(number === 1){
                console.log(`actor ${actorNumber} made event 1`);
            }
            if(number === 2){
                this.otherActors[actorNumber].position.copy(content.position);
                this.otherActors[actorNumber].rotation.copy(content.rotation);
            }
        }

        this.client.onJoinRoomCallback = (createdByMe : boolean)=>{
            if(this.clientChat.isConnectedToFrontEnd()){
                console.log(`${this.client.myRoom().name}`);
                //this.messages[`${this.client.myRoom().name}`] = new Queue<HTMLElement>();
                this.clientChat.Subscribe([`Sala@${this.client.myRoom().name}`]);
            }

            if(!createdByMe){
                let actors = this.client.myRoomActorsArray();
                for (let i = 0 ; i < this.client.myRoomActorCount(); i++){
                    let actor = actors[i] as Photon.LoadBalancing.Actor;
                    if(!actor.isLocal){
                        let object : THREE.Object3D;
                        let loader = new GLTFLoader();
                        loader.load("models/Flamingo.glb", (gltf)=>{
                            object = gltf.scene.children[0];
                            object.scale.set(0.1,0.1,0.1);
                            this.otherActors[actor.actorNr] = object;
                            object.userData.name = actor.name;
                            object.userData.type = "Actor";
                            this.scene.add(object);
                            console.log(this.otherActors);
                        });

                    }
                }
            }

        }
    }
}

const loader = new GLTFLoader();
function ModelLoader(url : string) : Promise<GLTF>{
    return new Promise((resolve, reject)=>{
        loader.load(url, data=>resolve(data), null, reject);
    })
}