import { AmbientLight, Box3, HemisphereLight, Mesh, MeshBasicMaterial, Object3D, PerspectiveCamera, PlaneGeometry, Raycaster, Scene, Texture, Vector3 } from "three";
import Game from "./Game";
import IScene from "./IScene";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import {FirstPersonControls} from 'three/examples/jsm/controls/FirstPersonControls'
import {PointerLockControls} from 'three/examples/jsm/controls/PointerLockControls'
import Input from "./Input";
import YoutubeCssObject from "./YoutubeCssObject.js";
import * as THREE from 'three'
import AssetsManager from "./AssetsManager";
import { CHROME, getBrowser } from "./DetectBrowser";
import VimeoCssObject from "./VimeoCssObject";
import DailyMotionCssObject from "./DailyMotionCssObject";
import TextureAnimator from "./TextureAnimator";

export default class ArtGalleryScene extends IScene {
    controls : FirstPersonControls;
    pointer : PointerLockControls;
    lock : boolean;
    area : Box3;
    movementDirection : Vector3;
    ready : boolean;
    raycaster : Raycaster;
    json : any;
    cssScene : Scene;
    playArea : Object3D;

    pointerListener : any;
    backgroundTexture: Texture;
   
    moveLeft: boolean = false;
    moveRight: boolean = false;
    moveBackward: boolean = false;
    moveForward: boolean = false;
    velocity: any;

    intersectObjects = [];

    

    glObjects = [];
    cssobjects : (YoutubeCssObject | VimeoCssObject | DailyMotionCssObject)[] = [];
    textureAnimator: TextureAnimator;
    
    constructor(config : { gallery : string}) {
        super(Game.GetInstance().container, Game.GetInstance().renderer);
        const fov = 50; // AKA Field of View
        const aspect = this.container.clientWidth / this.container.clientHeight;
        const near = 0.01; // the near clipping plane
        const far = 800; // the far clipping plane
        
        this.ready = false;
        this.json = fetch('/galleries.json').then(
            response => response.json()).then(json => {
                this.json = json;
                // console.log(json);
                let map = this.json[config.gallery ?? "1"];
                
                // loader.load("/models/chair.glb", (gltf)=>{
                //     this.scene.add(gltf.scene);
                // });
                
            let gltf = AssetsManager.GetInstance().LoadObject(map["model"]);

                    let meshes = [];
                    gltf.scene.traverse((object) =>{
                        if(object.type !== 'Group'){
                            // console.log(object);

                            if(object.name === "Vote"){
                                object.visible = false;
                            }                             
                            
                            // if(object.name === "texturaAnimada"){
                            //     this.textureAnimator = new TextureAnimator(AssetsManager.GetInstance().LoadTexture('textures/OutroDia_07.jpg'), 4, 4, 2);
                            //     //@ts-ignore
                            //     (object as Mesh).material.map = this.textureAnimator.texture;
                            // }
                            
                            let links = map["links"];
                            // console.log(links);
                            // console.log(object.name in links);

                            if(object.name in links){
                                let objectName = links[object.name];

                                // console.log("test");
                                //
                                if(objectName.type === "video"){
                                    if(getBrowser() === CHROME){
                                        new THREE.TextureLoader().load(objectName.thumbnail, (texture)=>{
                                            let mesh = object as Mesh;                             
                                            let rotation = mesh.rotation.clone();
    
                                            mesh.rotation.set(0,0,0);
    
                                            let box = new Box3().setFromObject(mesh);
                                            let info = new Vector3();
                                            box.getSize(info);
                                            let geometry = new PlaneGeometry(info.x, info.y);
    
                                            let material = new MeshBasicMaterial({
                                                color: new THREE.Color('white'),
                                                blending : THREE.NoBlending,
                                                side : THREE.DoubleSide,
                                                map:texture
                                            });
                                            object.visible = false;
    
                                            let planeMesh = new THREE.Mesh(geometry, material);
                                            planeMesh.position.copy(object.position);
                                            planeMesh.rotation.copy(rotation);
                                            
                                            this.scene.add(planeMesh);

                                            this.intersectObjects.push(planeMesh);

                                            let href;
                                            switch(objectName["host"]){
                                                case "vimeo":
                                                    href=`https://vimeo.com/${objectName["videoTag"]}`
                                                    break;
                                                case "youtube":
                                                    href=`https://www.youtube.com/watch?v=${objectName["videoTag"]}`
                                                    break;
                                                case "daily":
                                                    href=`https://www.dailymotion.com/video/${objectName["videoTag"]}`
                                                    break;
                                            }

                                            planeMesh.userData.href = href;                                            
                                            
                                        });

                                    }else{                                    
                                        let screen = object as THREE.Mesh;
                                        let objectToAdd;

                                        if(objectName["host"]==="youtube")
                                            objectToAdd = new YoutubeCssObject(screen, objectName["videoTag"], objectName['Playlist'] === 1, 0);
                                        else if(objectName["host"] === "vimeo")
                                            objectToAdd = new VimeoCssObject(screen, objectName["videoTag"]);
                                        else if(objectName["host"] === "daily")
                                            objectToAdd = new DailyMotionCssObject(screen, objectName["videoTag"]);

                                        this.scene.add(objectToAdd.glObject);
                                        // this.cssScene.add(objectToAdd.cssObject);
                                        this.cssobjects.push(objectToAdd);
                                        // objectToAdd.glObject.visible = false;
                                        object.visible = false;

                                        this.intersectObjects.push(objectToAdd.glObject);
                                    }
                                    
                                    // console.log(objectToAdd.glObject);
                                }else if(objectName.type === "image"){
                                    if(objectName.link){
                                        new THREE.TextureLoader().load(objectName.link, (texture)=>{
                                            let mesh = object as Mesh;                             
                                            let rotation = mesh.rotation.clone();
    
                                            mesh.rotation.set(0,0,0);
    
                                            let box = new Box3().setFromObject(mesh);
                                            let info = new Vector3();
                                            box.getSize(info);
                                            let geometry = new PlaneGeometry(info.x, info.y);
    
                                            let material = new MeshBasicMaterial({
                                                color: new THREE.Color('white'),
                                                blending : THREE.NoBlending,
                                                side : THREE.DoubleSide,
                                                map:texture
                                            });
    
                                            let planeMesh = new THREE.Mesh(geometry, material);
                                            planeMesh.position.copy(object.position);
                                            planeMesh.rotation.copy(rotation);
                                            
                                            this.scene.add(planeMesh);
                                            this.intersectObjects.push(planeMesh);
                                
                                            if(objectName.href){
                                                planeMesh.userData.href = objectName.href;
                                            }
        
                                        });
                                        object.visible = false;
                                    }
                                    if(objectName.href){
                                        this.intersectObjects.push(object);
                                        object.userData.href = objectName.href;
                                    }

                                }else if(objectName.type === "link"){
                                    object.userData.onClick = ()=>{
                                        let a = document.createElement("a");
                                        a.target = '_blank';
                                        a.href = objectName.link;
                                        a.click();
                                        // window.open(objectName.link);
                                    }
                                }
                            } else if (object.name.includes("PlayArea")){
                                let mesh = object as Mesh;
                                this.playArea = object;
                                this.playArea.visible = false;
                                // this.playArea = new Mesh(mesh.geometry, new MeshBasicMaterial({opacity:0, color:0x00000000, side:THREE.BackSide, transparent: true}));
                                // object.visible = false;
                                // this.scene.add(this.playArea);
                            }
                        }
                    });
                    this.scene.add(gltf.scene);
                    this.area = new Box3().setFromObject(this.scene);
                    this.ready = true;
                    
                this.pointer = new PointerLockControls(this.camera, this.container);
                // this.pointer.lock();

                // this.pointerListener = this.LockPointer.bind(this);
                // this.container.addEventListener("click", this.pointerListener);                
                this.movementDirection = new Vector3();
            this.velocity = new Vector3();
                this.raycaster = new Raycaster();
        });

        this.camera = new PerspectiveCamera(fov, aspect, near, far);

        this.camera.position.set(0, 0.7, 3);   

        this.camera.lookAt(new Vector3(0,0.5,1));

        // this.camera.rotation.set(-3,0,3);
        this.scene = new Scene();
        this.backgroundTexture = AssetsManager.GetInstance().LoadTexture('imgs/nigh2.jpg');
        this.scene.background = this.backgroundTexture; 
        // this.scene.background = new Color('skyblue');
        this.cssScene = new Scene();

        const ambientLight = new AmbientLight(
            0xffffff, 5
        );

        this.scene.add(ambientLight);

        window.addEventListener("resize", ()=>{
            (<THREE.PerspectiveCamera>this.camera).aspect = this.container.clientWidth/this.container.clientHeight;
            (<THREE.PerspectiveCamera>this.camera).updateProjectionMatrix();
        });

        let loader = new GLTFLoader();
        
    }    

    LockPointer(){
        // if(!this.pointer.isLocked){
        //     this.pointer.lock();
        //     Input.GetInstance().SetMouseToMiddle();
        // }
    }

    dispose(){
        super.dispose();
        // this.pointer.unlock();
        // this.container.removeEventListener("click", this.pointerListener);
    }

    Update(dt: number): void {
        if(!this.ready){
            return;
        }

        this.textureAnimator?.Update(dt);

        for(let i=0; i < this.cssobjects.length; i++){
            let range = 4;
            if(this.cssobjects[i].glObject.position.z - range <= this.camera.position.z && this.camera.position.z <= this.cssobjects[i].glObject.position.z + range){
                if(!this.cssScene.children.includes(this.cssobjects[i].cssObject)){
                    this.cssScene.add(this.cssobjects[i].cssObject);
                    // this.glObjects[i].visible = true;                    
                }
            }else{
                if(this.cssScene.children.includes(this.cssobjects[i].cssObject)){
                    // //@ts-ignore
                    // if(this.cssobjects[i].resetAutoplay)
                    //     //@ts-ignore
                    //     this.cssobjects[i]?.resetAutoplay();

                    this.cssScene.remove(this.cssobjects[i].cssObject);
                    // this.glObjects[i].visible = false;                   

                }
            }

        }

        this.raycaster.setFromCamera(Input.GetInstance().mouse, this.camera);
        let intersectedObjects = this.raycaster.intersectObjects(this.intersectObjects, true);

        if(intersectedObjects.length > 0){
            let leftClicked = Input.GetInstance().IsMouseKeyPressed(Input.MouseButtons.left);
            if (leftClicked) {
            //   if (intersectedObjects[0].object.name.startsWith("Screen")) {
            //       if(intersectedObjects[0].object.userData.toggleVideo)
            //             intersectedObjects[0].object.userData.toggleVideo();
            //   }

            if(intersectedObjects[0].object.name.startsWith("Screen")){ 
                this.container.style.pointerEvents = "none";
              } else {
                this.container.style.pointerEvents = "auto";
              }

              
              if(intersectedObjects[0].object.userData?.href){
                  window.open(intersectedObjects[0].object.userData.href);
              }
            }
            

            // }else if(intersectedObjects[0].object.name.startsWith("Vote")){
            //     if(leftClicked){
            //         console.log(intersectedObjects[0]);
            //         intersectedObjects[0].object.userData.onClick();
            //     }
            // }
            
        }else {
            this.container.style.pointerEvents = "auto";
          }

        this.UpdateInputs();


        let box = new THREE.Box3().setFromObject(this.playArea);

          this.velocity.x -= this.velocity.x * 10.0 * dt;
          this.velocity.z -= this.velocity.z * 10.0 * dt;

          this.movementDirection.z =
            (this.moveForward ? 1 : 0) - (this.moveBackward ? 1 : 0);
          this.movementDirection.x =
            (this.moveRight ? 1 : 0) - (this.moveLeft ? 1 : 0);
          this.movementDirection.normalize();

          if (this.moveForward || this.moveBackward)
            this.velocity.z -= this.movementDirection.z * 25.0 * dt;
          if (this.moveLeft || this.moveRight)
            this.velocity.x -= this.movementDirection.x * 25.0 * dt;

          this.pointer.moveRight(-this.velocity.x * dt);
          this.pointer.moveForward(-this.velocity.z * dt);
        
        if(this.camera.position.x <= box.min.x){
            this.camera.position.x = box.min.x;
        }
        
        if(this.camera.position.x >= box.max.x){
            this.camera.position.x = box.max.x;
        }
        
        if(this.camera.position.z <= box.min.z){
            this.camera.position.z = box.min.z;
        }

        if(this.camera.position.z >= box.max.z){
            this.camera.position.z = box.max.z;
        }  
    }

    UpdateInputs = () => {        
        this.moveForward = (Input.GetInstance().IsKeyDown("ArrowUp"));        
        this.moveBackward = (Input.GetInstance().IsKeyDown("ArrowDown"));
        this.moveRight = (Input.GetInstance().IsKeyDown("ArrowRight"));
        this.moveLeft = (Input.GetInstance().IsKeyDown("ArrowLeft"));        
    }

    Render(){
        if(this.scene && this.camera){  
            this.renderer.render(this.scene, this.camera);
            Game.GetInstance().cssRenderer.render(this.cssScene, this.camera);
        }
    }
}