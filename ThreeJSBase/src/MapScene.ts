import { GUI } from "../node_modules/three/examples/jsm/libs/dat.gui.module.js";
import { MapControls } from "../node_modules/three/examples/jsm/controls/OrbitControls.js";
import * as THREE from "../node_modules/three/src/Three.js";
import Game from "./Game.js";
import Input from "./Input.js";
import IScene from "./IScene.js";
import {
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  MeshPhongMaterial,
  Object3D
} from "../node_modules/three/src/Three.js";
import TransitionScene from "./TransitionScene.js";
import AssetsManager from "./AssetsManager.js";
import { EffectComposer } from "../node_modules/three/examples/jsm/postprocessing/EffectComposer.js";
import { UnrealBloomPass } from "../node_modules/three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { RenderPass } from "../node_modules/three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "../node_modules/three/examples/jsm/postprocessing/ShaderPass.js";
import {
  fragmentShader as SBFragShader,
  vertexShader as SBVertexShader,
} from "./shaders/SeletiveBloom.js";
import { randomBytes } from "crypto";
import { CABINE_FOTOS_TAG, EnviromentsNames, FEIRA_TAG, GALERIAS_TAG, SHOWS_TAG, WORKSHOPS_TAG } from "./EnvironmentsConfig.js";

import PostProcessing, {BLOOM_SCENE, ENTIRE_SCENE} from './PostProcessing.js';
import TextureAnimator from "./TextureAnimator.js";

export default class MapScene extends IScene {
  raycaster: THREE.Raycaster;
  controls: MapControls;
  gui: GUI;
  end: boolean;
  backgroundTexture: THREE.Texture;
  json;

  mapObject : Object3D;

  postProcessing : PostProcessing;
  textureAnimator: TextureAnimator;

  constructor(container: HTMLElement, renderer: THREE.WebGLRenderer) {
    super(container, renderer);

    fetch("/workshops.json")
      .then((response) => response.json())
      .then((json) => {
        this.json = json;
      });

    this.end = false;

    this.scene = new THREE.Scene();
    this.backgroundTexture = AssetsManager.GetInstance().LoadTexture(
      "imgs/nigh2.jpg"
    );
    this.scene.background = this.backgroundTexture;

    const fov = 75; // AKA Field of View
    const aspect = this.container.clientWidth / this.container.clientHeight;
    const near = 0.1; // the near clipping plane
    const far = 2000; // the far clipping plane

    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    // every object is initially created at ( 0, 0, 0 )
    // we'll move the camera back a bit so that we can view the scene

    this.controls = new MapControls(this.camera, this.container);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    
    this.controls.maxPolarAngle = Math.PI / 2.5;

    this.camera.position.set(-280, 234.27806277139337, 628.6280190086122);
    this.camera.rotation.set(-0.4274656376134493,-0.52544917175030055,-0.10148728506463814)

    this.raycaster = new THREE.Raycaster();

    let light = new THREE.AmbientLight( 0xffffff );
    light.intensity = 3;

    this.scene.add(light);


    window.addEventListener("resize", () => {
      (<THREE.PerspectiveCamera>this.camera).aspect =
        this.container.clientWidth / this.container.clientHeight;
      (<THREE.PerspectiveCamera>this.camera).updateProjectionMatrix();
    });

    
    // this.CreatePostProcessing();
    
    
    
    // cGUI.add(this.controls, "screenSpacePanning", false); //true controls become Orbit Controls, false Map controls
    // cGUI.add(this.controls, "dampingFactor", 0,1,0.01); //Smoothing of movement
    // cGUI.add(this.controls, "maxPolarAngle", -2*Math.PI, 2*Math.PI, 0.1); //Max vertical angle in radians
    // cGUI.add(this.controls, "minPolarAngle", -2*Math.PI, 2*Math.PI, 0.1); //Min vertical angle in radians 0 is 90º from a horizontal plane
    // cGUI.add(this.controls, "maxDistance", 1, 300, 0.1); //Max distance from the 0 position in Y
    
    
    this.mapObject = AssetsManager.GetInstance().LoadObject("models/mapa/mapa-convida.glb").scene;
    this.textureAnimator = new TextureAnimator(AssetsManager.GetInstance().LoadTexture('textures/ta.jpg'), 8, 4, 2);
    
    this.mapObject.traverse((object) => {
        let mesh = object as Mesh;

        
        
        //@ts-ignore
        if (object.isMesh) {
            let phongMaterial = new MeshPhongMaterial({
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
            
            if (object.name.includes("glow")) {
                object.traverse((y) => y.layers.enable(BLOOM_SCENE));
                
                //@ts-ignore
                if (!mesh.material.map) {
                    phongMaterial.emissive = new THREE.Color(
                        phongMaterial.color.getHex()
                        );
                        phongMaterial.color = new THREE.Color("#000000");
                    }
                }
            }

            if(object.name.includes("texturaAnimada")){

              ((object as Mesh).material as MeshPhongMaterial).side = THREE.DoubleSide;
                            //@ts-ignore              
              (object as Mesh).material.map = this.textureAnimator.texture;
            }  
            
            //   if (object.name.includes("Feira") && !object.name.includes("logo")) {
                //     object.userData.cube = new CubeClass(object);
                //     object.userData.cube.Click = () => {
                    //       //@ts-ignore
                    //       window.THREESpace.SetSpaceInfo({
                        //         name: "Feira",
                        //         onAccept: () => {
                            //           Game.GetInstance().gameChat.Unsubscribe([
                                //             `Sala@${Game.GetInstance().gameClient.myRoom().name}`,
                                //           ]);
                                //           Game.GetInstance().gameClient.leaveRoom();
                                //           Game.GetInstance().gameClient.onJoinLobbyCallback = () => {
                                    //             Game.GetInstance().ChangeScene(
                                        //               new TransitionScene(
                                            //                 this.container,
                                            //                 this.renderer,
                                            //                 { Map: "Feira", Tag: "", Type: "Feira" },
                                            //                 { users: [] }
                                            //               )
                                            //             );
                                            //           };
    //         },
    //         onDecline: this.OnDecline.bind(this),
    //       });
    //     };
    
    //     object.userData.cube.onDeclined = () => {
        //       this.end = false;
        //     };
        //   }
        
        if (object.name.includes("clique")) {
            object.visible = false;
        }
    });
    
    this.scene.add(this.mapObject);
    
    // //@ts-ignore
    // window.StreamObject.EnterRoom("me"+randomBytes(2), "Room");
    // });
    
    this.usePostProcessing = Game.GetInstance().usePostProcessing;
    this.postProcessing = new PostProcessing(this.scene, this.camera, this.renderer, this.container, this.backgroundTexture);
    
    this.ConnectToRoom({
        Map: 1,
    });
    
    Game.GetInstance().gameClient.onJoinRoomCallback = (
        createdByMe: boolean
        ) => {
            if (Game.GetInstance().gameChat.isConnectedToFrontEnd) {
        Game.GetInstance().gameChat.Subscribe([
          `Sala@${Game.GetInstance().gameClient.myRoom().name}`,
        ]);
      }
    };
  }

  ChangeScene(data: any): void {
    Game.GetInstance().gameChat.Unsubscribe([
      `Sala@${Game.GetInstance().gameClient.myRoom().name}`,
    ]);
    // this.gui.close();
    // this.gui.destroy();
    Game.GetInstance().gameClient.leaveRoom();
    Game.GetInstance().gameClient.onJoinLobbyCallback = () => {
      Game.GetInstance().ChangeScene(
        new TransitionScene(this.container, this.renderer, data, {
          users: ["a"],
        })
      );
    };
  }

  OnDecline() {
    // console.log("Declined!");
    this.end = false;
  }

  Render() {
    if (this.scene && this.camera) {
      if (this.usePostProcessing) {
        this.postProcessing.renderBloom();
        this.postProcessing.finalComposer.render();
      } else {
        this.renderer.render(this.scene, this.camera);
      }
    }
  }

  Update(dt: number): void {
    this.controls.update();
    this.textureAnimator.Update(dt);
    // if(Input.GetInstance().IsKeyPressed('d')){
    //   console.log(this.camera);
    // }

    if (!this.end) {
        this.raycaster.setFromCamera(Game.GetInstance().input.mouse, this.camera);
        let intersectedObjects = this.raycaster.intersectObjects(this.mapObject.children);

      if (intersectedObjects.length > 0) {
        let changeSceneTags = [...SHOWS_TAG, ...GALERIAS_TAG, ...WORKSHOPS_TAG, CABINE_FOTOS_TAG, FEIRA_TAG];

        if (Input.GetInstance().IsMouseKeyPressed(Input.MouseButtons.left)) {
            let object = intersectedObjects[0].object;

            for(let tag of changeSceneTags){
                if (object.name === EnviromentsNames[tag]) { 
                    let type = tag.replace(/[0-9]/g, '');
                    let map = tag.replace(/\D/g,'');

                    let onAccept = () => this.ChangeScene({Type: type, Map: map, Tag: "abc"});

                    if(type.includes("Workshop")){
                        onAccept = () => { if (this.json[+map-1]) window.open(this.json[+map-1]); }
                    }else if(type.includes("Feira")){
                        onAccept = () => {
                          Game.GetInstance().gameChat.Unsubscribe([
                            `Sala@${
                              Game.GetInstance().gameClient.myRoom().name
                            }`,
                          ]);
                          Game.GetInstance().gameClient.leaveRoom();
                          Game.GetInstance().gameClient.onJoinLobbyCallback = () => {
                            Game.GetInstance().ChangeScene(
                              new TransitionScene(
                                this.container,
                                this.renderer,
                                { Map: "Feira", Tag: "", Type: "Feira" },
                                { users: [] }
                              )
                            );
                          };
                        }
                    }
                    else if(type.includes("Cabine")){
                      //@ts-ignore
                      window.showCameraModal();
                      return;
                    }

                    let args = {
                        name: tag,
                        onAccept: onAccept,
                        onDecline: this.OnDecline.bind(this),
                    };           
                    
                    //@ts-ignore 
                    window.THREESpace.SetSpaceInfo(args);

                    this.end = true;
                    break;
                }  
            }              
        }  

      } // intersected.length > 0   
    } // !this.end
  } // Update

}