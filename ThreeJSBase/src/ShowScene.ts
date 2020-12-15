import * as THREE from "../node_modules/three/src/Three.js";
import IScene from "./IScene.js";
import { MapControls, OrbitControls } from "../node_modules/three/examples/jsm/controls/OrbitControls.js";
import  GameObject, {ANIMATION_STATE} from "./GameObject.js";
import { Color, MeshBasicMaterial, Object3D, Raycaster, Scene, Vector3 } from "../node_modules/three/src/Three.js";
import GameClient from './GameClient.js'
import Input from "./Input.js";
import GameChat from "./GameChat.js";
import Game from "./Game.js"
import ChatObject from "./ChatObject.js";
import VideoElement from "./VideoElement.js";
import { CSS2DObject } from "../node_modules/three/examples/jsm/renderers/CSS2DRenderer.js";
import YoutubeCssObject from "./YoutubeCssObject.js";
import AssetsManager from "./AssetsManager.js";
import { EffectComposer } from '../node_modules/three/examples/jsm/postprocessing/EffectComposer.js';
import { UnrealBloomPass } from '../node_modules/three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { RenderPass } from '../node_modules/three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from "../node_modules/three/examples/jsm/postprocessing/ShaderPass.js";
import { fragmentShader as SBFragShader, vertexShader as SBVertexShader } from "./shaders/SeletiveBloom.js";
import TextureAnimator from "./TextureAnimator.js";
import SponsorBalloon from "./SponsorBalloon.js";
import IGameObject from "./IGameObject.js";
import {ShowScenes} from './ShowsConfig.js';
import TwitchCssObject from "./TwitchCssObject.js";
import BloomPostProcessing, { BLOOM_SCENE } from "./PostProcessing.js";
import { randomBytes } from "crypto";

export default class ShowScene extends IScene {
  controls: MapControls;
  client: GameClient;
  clientChat: GameChat;
  raycaster: THREE.Raycaster;
  
  cssScene: THREE.Scene;
  css2DScene: THREE.Scene;

  json: any;  
  showTitle: string;

  screenObject: THREE.Mesh;
  //@ts-ignore
  pathfinder = new threePathfinding.Pathfinding();
  //@ts-ignore
  pathfinderHelper = new threePathfinding.PathfindingHelper();

  ZONE = "level1";
  player: GameObject;
  navmesh: THREE.Object3D;

  backgroundTexture: THREE.Texture;
  balloons = [];
  config;
  height: number;
  otherLabels = {};
  playerLabel: CSS2DObject;
  postProcessing: any;


  constructor(container: HTMLElement, renderer: THREE.WebGLRenderer, sceneConfigurations: { show: string }) {
    super(container, renderer);

    this.client = Game.GetInstance().gameClient;
    this.clientChat = Game.GetInstance().gameChat;    

    this.config = ShowScenes[sceneConfigurations.show];
    this.showTitle = sceneConfigurations.show;
    // console.log("show: " + sceneConfigurations.show);
    // console.log(this.config);

    this.SetCallbacks();
    this.Init();

    this.json = fetch("/streams.json")
      .then((response) => response.json())
      .then((json) => {
        this.json = json;
        this.CreateScreen();
      });

      //@ts-ignore
      window.dance = this.Dance.bind(this);
    // this.ConnectToRoom(photonConfigurations);
  }

Dance(index : number){
    this.player.Dance(index);
}

  AddGameObject(object: IGameObject) {
    this.gameObjects.push(object);
  }

  Init() {
    this.scene = new THREE.Scene();
    this.cssScene = new THREE.Scene();
    this.css2DScene = new THREE.Scene();

    this.backgroundTexture = AssetsManager.GetInstance().LoadTexture(this.config.backgroundTexture);
    this.scene.background = this.backgroundTexture;

    this.raycaster = new THREE.Raycaster();

    // console.log(this.raycaster);

    this.CreateCamera();
    this.CreateControls();
    this.CreateLights();
    this.CreatePathfinder();
    this.CreateScene();

    if (Game.GetInstance().gameClient.myRoomActorCount() > 0) {
      Game.GetInstance().gameClient.myRoomActorsArray().map((act) => {
          let actor = act as Photon.LoadBalancing.Actor;
          // console.log(actor);
          if (!actor.isLocal) {
            this.client.onActorJoinCallback(actor);
          }
        });
        
    }

    this.client.raiseEvent(3);

    this.usePostProcessing = Game.GetInstance().usePostProcessing;
    this.postProcessing = new BloomPostProcessing(this.scene, this.camera, this.renderer, this.container, this.backgroundTexture);

    // //@ts-ignore
    //  window.StreamObject.EnterRoom(`${Game.GetInstance().gameClient.myActor().name}`, "Room2");
  }

  Update(dt: number) {
    this.controls.update();

    this.playerLabel.position.copy(this.player.object.position).sub(new Vector3(0,1,0));

    let labels = Object.keys(this.otherLabels);

    if (labels.length > 0) {
      labels.forEach((key) => {
        this.otherLabels[key].position.copy(this.otherActors[key].object.position).sub(new Vector3(0,1,0));
      });
    }
    this.camera.lookAt(this.player.object.position);

    let dir = new THREE.Vector3();
    this.camera.getWorldDirection(dir);
    this.raycaster.ray.direction.copy(dir);
    this.raycaster.setFromCamera(Game.GetInstance().input.mouse, this.camera);
    let intersectedObjects = this.raycaster.intersectObjects(this.scene.children, true);
    let intersectedObjectsCss = this.raycaster.intersectObjects(this.cssScene.children);

    if (intersectedObjects.length > 0) {
      // if(intersectedObjects[0].object.name.startsWith("Screen")){
      //     if(Input.GetInstance().IsMouseKeyPressed(Input.MouseButtons.left)){
      //         console.log("toggle video");

      //         intersectedObjects[0].object.userData.toggleVideo();
      //     }
      // }

      // console.log(intersectedObjects);
      

       if(intersectedObjects.find(x => x.object.userData?.name ==="OtherScreen")){ 
        this.container.style.pointerEvents = "none";
      } else {
        this.container.style.pointerEvents = "auto";
      }


          if(Game.GetInstance().input.IsMouseKeyPressed(Input.MouseButtons.right)){
            console.log(intersectedObjects);
               let obj = intersectedObjects.find(x => (x.object.userData?.type === 'Actor'));
      
            if(obj){
              if(obj.object){
                let toActor_id = obj.object.userData.id;
                if(!this.otherActors[toActor_id].blockInvites && !this.player.cantInvite){                  
                  this.otherActors[toActor_id].blockInvites = true;
                  this.player.cantInvite = true;
                  //@ts-ignore
                  window.showToast("Convite enviado para " + this.otherActors[toActor_id].name + "!", "info");
                  this.client.raiseEvent(6, {to: toActor_id, name: this.client.myActor().name });
                }else{
                  //@ts-ignore
                  window.showToast("Não é possível enviar convites para " + this.otherActors[toActor_id].name + " no momento!", "error");
                }
                  
              }
            }
            
          }
      
      // if(intersectedObjects[0].object.userData?.type === "Actor"){
      //     if(Game.GetInstance().input.IsMouseKeyPressed(Input.MouseButtons.left)){
      //         Game.GetInstance().gameChat.chatObject.CreatePrivateChannel(intersectedObjects[0].object.userData?.name);

      //         Game.GetInstance().gameChat.sendPrivateMessage(intersectedObjects[0].object.userData?.name, `/*/Invite ${JSON.stringify(
      //             Game.GetInstance().gameClient.myRoom()._customProperties
      //         )}`);
      //     }
      // }
    } else {
      this.container.style.pointerEvents = "auto";
    }

    for(let i=0; i < 3; i++){
        if(Input.GetInstance().IsKeyPressed((i+1).toString()) 
           && this.player.state !== ANIMATION_STATE.DANCING
             && this.player.state !== ANIMATION_STATE.DANCING_TOGETHER) {
          this.player.Dance(i);
        }  
    }

    for (const go of this.gameObjects) {
      go?.Update(dt);
    }

    // Object.keys(this.otherActors).map(obj=>{
    //     this.otherActors[obj]?.Update(dt);
    // });
  }

  CreateCamera() {
    const fov = 38;
    const aspect = this.container.clientWidth / this.container.clientHeight;
    const near = 0.01; 
    const far = 600; 

    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

    this.camera.position.copy(this.config.cameraPosition);
    this.camera.quaternion.copy(this.config.cameraQuaternion);

    window.addEventListener("resize", () => {
      (<THREE.PerspectiveCamera>this.camera).aspect = this.container.clientWidth / this.container.clientHeight;
      (<THREE.PerspectiveCamera>this.camera).updateProjectionMatrix();
    });
  }

  CreateLights() {
    let light = new THREE.AmbientLight( 0xffffff );
    light.intensity = 3;

    this.scene.add(light);
  }

  CreatePathfinder() {
      this.navmesh = AssetsManager.GetInstance().LoadObject(this.config.navmesh).scene.children[0];
      
      this.renderer.domElement.addEventListener("click", this.onClick, false);
      //@ts-ignore
      this.pathfinder.setZoneData( this.ZONE, threePathfinding.Pathfinding.createZone(this.navmesh.geometry));
      
      let posInit = this.config.playerInitPosition;      
      this.height = this.pathfinder.getClosestNode(posInit,this.ZONE,0).centroid.y;

      // this.scene.add(this.navmesh);
      // this.scene.add(this.pathfinderHelper);
  }

  CreateControls() {
    this.controls = new MapControls(this.camera, this.container);   
    // this.controls.enableZoom = false;
    this.controls.enableDamping = false;
    this.controls.enableKeys = false;
    this.controls.enablePan = false;
    this.controls.maxDistance = 180;
    this.controls.minDistance = 50;
    this.controls.maxPolarAngle = Math.PI / 2;
  }

  onClick = (event) => {

    if(this.player.state !== ANIMATION_STATE.DANCING_TOGETHER){
    const mouse = {
      x: (event.clientX / this.renderer.domElement.clientWidth) * 2 - 1,
      y: -(event.clientY / this.renderer.domElement.clientHeight) * 2 + 1,
    };
    
    let dir = new THREE.Vector3();
    this.camera.getWorldDirection( dir);
    this.raycaster.ray.direction.copy(dir);
    this.raycaster.setFromCamera(mouse, this.camera);

    const intersects = this.raycaster.intersectObjects([this.navmesh]);

    if (intersects.length > 0) {
      const groupID = 0;
      const p = intersects[0].point;
      let pos = this.player.object.position;

      let posInit = new THREE.Vector3(pos.x, this.height, pos.z);
      let posFinal = new THREE.Vector3(p.x, this.height, p.z);

      let path = this.pathfinder.findPath(posInit,posFinal, this.ZONE, groupID);
      if (posInit && posFinal) {
        if (path) {
          this.client.raiseEvent(5, { init: posInit, final: posFinal, zone: this.ZONE, groupID: groupID});
          // this.pathfinderHelper.setPlayerPosition(this.posInit).setTargetPosition(this.posFinal);
          // this.pathfinderHelper.setPath(path);
          path = [posInit].concat(path);
          this.player.SetMovimentation(path);
        }
      }
    }
  }
  };

  dispose(){
      super.dispose();

      this.renderer.domElement.removeEventListener('click', this.onClick, false);
      //@ts-ignore
      window.dance = undefined;
  }

  CreateScene() {
    let palcoObject = AssetsManager.GetInstance().LoadObject(this.config.obj).scene;

    this.config.balloonsPosition.forEach((x) => {
      // let balloon = new SponsorBalloon(this.scene, new Vector3().copy(x));
      // this.balloons.push(balloon);
      // this.AddGameObject(balloon);
    });

    palcoObject.traverse((x) => {
      let keys = ["glow"];
      let containsKeys = new RegExp(keys.join("|")).test(x.name);

      let mesh = x as THREE.Mesh;

      //@ts-ignore
      if (x.isMesh) {
        let phongMaterial = new THREE.MeshPhongMaterial({
          reflectivity: 0,
          shininess: 0,
          aoMapIntensity: 0,
          //@ts-ignore
          color: mesh.material.color,
          //@ts-ignore
          map: mesh.material.map,
          refractionRatio: 0,
        });

        mesh.material = phongMaterial;

        if (containsKeys) {
          x.traverse((y) => y.layers.enable(BLOOM_SCENE));

          //@ts-ignore
          if (!mesh.material.map) {
            phongMaterial.emissive = new THREE.Color(
              phongMaterial.color.getHex()
            );
            phongMaterial.color = new THREE.Color("#000000");
          }
        }
      }
    });

    this.screenObject = <THREE.Mesh>(
      palcoObject.children.find((x) => x.name.includes("Screen"))
    );

    this.screenObject.visible = false;
    this.scene.add(palcoObject);

    let initPos = this.config.playerInitPosition;

    let actor = Game.GetInstance().gameClient.myActor();

    this.player = new GameObject( this.scene, actor.name, actor.getCustomProperty("roupa"), new THREE.Vector3(initPos.x, this.height, initPos.z), this.client);
  
    this.player.object.traverse((x) =>
      x.name.includes("cabeca") ? x.layers.enable(BLOOM_SCENE) : null
    );
 

    this.playerLabel = this.createLabel(actor);
    this.css2DScene.add(this.playerLabel);

    this.AddGameObject(this.player);
  }

  CreateScreen() {
    let objectToAdd =
      this.json[this.showTitle]["Type"] === "youtube"
        ? new YoutubeCssObject(
            this.screenObject,
            this.json[this.showTitle]["Screen"],
            this.json[this.showTitle]["Playlist"] === 1
          )
        : new TwitchCssObject(
            this.screenObject,
            this.json[this.showTitle]["Screen"]
          );
    this.cssScene.add(objectToAdd.cssObject);
    this.scene.add(objectToAdd.glObject);
  }

  ///Checks if player is in a Lobby before trying to join a room
  // ConnectToRoom(){
  //     this.client.ConnectToRoom({
  //         "stage":"1"
  //     });
  // }



  Render() {
    if (this.scene && this.camera) {
      if (this.usePostProcessing) {
        this.postProcessing.renderBloom(true);
        this.postProcessing.finalComposer.render();
      } else {
        this.renderer.render(this.scene, this.camera);
      }

      Game.GetInstance().cssRenderer.render(this.cssScene, this.camera);
      Game.GetInstance().css2dRenderer.render(this.css2DScene, this.camera);
    }
  }

  createLabel(actor) {
    let div = document.createElement("div");
    div.className = "label";
    //@ts-ignore
    div.textContent = actor.name;
    div.style.color = "white";
    return new CSS2DObject(div);    
  }

  SetCallbacks() {
    this.client.onActorJoinCallback = (actor: Photon.LoadBalancing.Actor) => {

      if (!actor.isLocal) {
        let initPos = this.config.playerInitPosition;
        let char = new GameObject(
          this.scene,
          actor.name,
          actor.getCustomProperty("roupa"),
          new THREE.Vector3(initPos.x, this.height, initPos.z)
        );
        char.object.traverse((x) =>
          x.name.includes("cabeca") ? x.layers.enable(BLOOM_SCENE) : null
        );

        char.object.traverse(x => {
          x.userData.type = "Actor"
          x.userData.name = actor.name;
          x.userData.id = actor.actorNr;
        });
        this.AddGameObject(char);
        this.otherActors[actor.actorNr] = char;
        this.otherLabels[actor.actorNr] = this.createLabel(actor);
        this.css2DScene.add(this.otherLabels[actor.actorNr]);
      }
    };

    this.client.onActorLeaveCallback = (actor: Photon.LoadBalancing.Actor) => {
      if (!actor.isLocal) {
        if (this.otherActors) {
          if (actor.actorNr in this.otherActors) {
            let object = this.otherActors[actor.actorNr].object;
            let label = this.otherLabels[actor.actorNr];

            if (label) {
              this.css2DScene.remove(label);
            }

            if (object) this.scene.remove(object);
          }
        }
      }
    };

    this.client.onEventCallback = (number, content, actorNumber) => {
      switch (number) {
        case 1: {
          // console.log(`actor ${actorNumber} made event 1`);
          break;
        }
        case 2: {
          this.otherActors[actorNumber].object.position.copy(content.position);
          this.otherActors[actorNumber].object.rotation.copy(content.rotation);
          break;
        }
        case 3: {
          this.client.raiseEvent(2, {
            position: this.player.object.position,
            rotation: this.player.object.rotation,
          });
          break;
        }
        case 4: {
          // console.log(`actor ${actorNumber} made event 4`);
          // console.log(content.state);
          this.otherActors[actorNumber].Dance(content.danceIndex);
          break;
        }

        case 5: {
          let init = new Vector3(
            content.init.x,
            content.init.y,
            content.init.z
          );
          let final = new Vector3(
            content.final.x,
            content.final.y,
            content.final.z
          );
          let path = this.pathfinder.findPath(
            init,
            final,
            content.zone,
            content.groupID
          );

          if (path) {
            path = [init].concat(path);
            // console.log(path);
            this.otherActors[actorNumber].SetMovimentation(path);
          }
          break;

        }
        case 6: {
          console.log(`actor ${actorNumber} made event 6`);
        
          if(this.client.myActor().actorNr === content.to){
            this.player.SetInvite(actorNumber, content.name);
          }else{
            this.otherActors[content.to].blockInvites = true;
          }
          this.otherActors[actorNumber].blockInvites = true;

          break;
        }

        case 7 : {
          console.log(`actor ${actorNumber} made event 7`);


          if(this.client.myActor().actorNr === content.to){
            if(content.accepted){
              this.player.Dance(4);    
              //@ts-ignore
              window.showToast("Obaaa, " + this.otherActors[actorNumber].name + " aceitou seu convite!", "success");


            }
            else{
              //@ts-ignore  
              window.showToast(":( " + this.otherActors[actorNumber].name + " rejeitou seu convite!", "error");
              this.player.cantInvite = false;
              this.client.raiseEvent(8);                     
            }
          }

          break;
        }
        case 8 : {
          console.log(`actor ${actorNumber} made event 8`);
          this.otherActors[actorNumber].blockInvites = false;
          break;
        }
      }
    };

    ///n ta sendo chamado mais
    this.client.onJoinRoomCallback = (createdByMe: boolean) => {
      if (this.clientChat.isConnectedToFrontEnd()) {
        this.clientChat.Subscribe([`Sala@${this.client.myRoom().name}`]);
      }

      if (!createdByMe) {
        let actors = this.client.myRoomActorsArray();
        for (let i = 0; i < this.client.myRoomActorCount(); i++) {
          let actor = actors[i] as Photon.LoadBalancing.Actor;
          if (!actor.isLocal) {
            let object: THREE.Object3D;
            // let loader = new GLTFLoader();
            // loader.load("models/Flamingo.glb", (gltf)=>{
            //     object = gltf.scene.children[0];
            //     object.scale.set(0.1,0.1,0.1);
            //     this.otherActors[actor.actorNr] = object;
            //     object.userData.name = actor.name;
            //     object.userData.type = "Actor";
            //     this.scene.add(object);
            //     console.log(this.otherActors);
            // });
          }
        }
      }
    };
  }
}
