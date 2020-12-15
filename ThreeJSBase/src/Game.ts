import Stack from "./Stack.js";
import IScene from "./IScene.js";
import * as THREE from "../node_modules/three/src/Three.js";
import Stats from '../node_modules/three/examples/jsm/libs/stats.module.js';
import Input from "./Input.js";
import GameClient from './GameClient.js';
import GameChat from "./GameChat.js";
import LoadingScene from "./LoadingScene.js";
import {CSS3DRenderer} from "../node_modules/three/examples/jsm/renderers/CSS3DRenderer.js"
import {CSS2DRenderer} from "../node_modules/three/examples/jsm/renderers/CSS2DRenderer.js"
import TransitionScene from "./TransitionScene.js";

export default class Game {
    scenes: Stack<IScene>;
    container: any;
    cssContainer : HTMLElement;
    clock: THREE.Clock;
    renderer: THREE.WebGLRenderer;
    cssRenderer : CSS3DRenderer;
    css2dRenderer : CSS2DRenderer;
    stats : any;
    input : Input;
    gameClient : GameClient;
    gameChat : GameChat;
    gameClientConnected : boolean;
    gameChatConnected : boolean;
    waitingForConnection : boolean;
    usePostProcessing = false;

    static instance : Game;

    static GetInstance() : Game{
        if(Game.instance)
            return Game.instance;
            
        new Game();
        return Game.instance;
    }

    randomInt(min, max) {
        return min + Math.floor((max - min) * Math.random());
    }

    generateRandomOutfit(){   
       return [this.randomInt(0,5),this.randomInt(0,3), this.randomInt(0,5),this.randomInt(0,4), this.randomInt(0,4)];
    }
    // HEAD = 0
    // PONCHO_SIZE = 1
    // PONCHO_TEXTURE = 2
    // HEAD_COLOR = 3
    // BODY_COLOR = 4

    setOutfit(user){
        this.gameClient.myActor().setCustomProperty("roupa", [user.headTexture.textureId, user.ponchoSize.sizeId, user.ponchoTexture.textureId, user.headColor.colorId, user.bodyColor.colorId]);    
    }


    private constructor() { //Make login first, then add scene
        //@ts-ignore
        console.log(NODE_ENV);        

        Game.instance = this;
        //@ts-ignore
        window.togglePP = this.togglePostProcessing.bind(this);
        //@ts-ignore
        window.pp = this.usePostProcessing;

        //@ts-ignore
        window.changeScene = this.ChangeScenePhoton;
        
        //Create photon clients
        this.gameClient = new GameClient();
        //@ts-ignore
        let userId = window.user.username;
        
        this.gameClient.myActor().setName(userId);
        //@ts-ignore
        this.setOutfit(window.user);
        //@ts-ignore
        window.SetPhotonOutfit = this.setOutfit.bind(this);
        
        //@ts-ignore
        this.gameClient.setUserId(userId);
        this.gameClient.Connect();

        this.gameClient.onJoinLobbyCallback = ()=>{
            this.gameClientConnected = true;
        }

        this.gameChat = new GameChat();
        this.gameChat.setUserId(userId);
        this.gameChat.Connect();

        this.gameChat.onConnectedToFrontEnd = () =>{
            this.gameChatConnected = true;
        }
        
        //Create Scene
        this.scenes = new Stack<IScene>();
        this.clock = new THREE.Clock();

        
        this.container = document.querySelector('#scene-container');
        this.cssContainer = document.querySelector("#scene-container-css");
        
        this.CreateRenderer();
        // this.scenes.Push(new Scene(this.container, this.gameClient, this.gameChat));
        this.scenes.Push(new LoadingScene(this.container, this.renderer));
        this.renderer.setAnimationLoop(() => {
            this.Update();
            this.Render();
            
            this.input.Update();
        })
        
        this.input = Input.GetInstance();

        this.stats = Stats();
        // document.body.appendChild(this.stats.dom);
        
        window.addEventListener("resize", ()=>{this.onScreenResize()});

        document.addEventListener( 'visibilitychange', ( event ) => {
            if(document.hidden){
                this.clock.stop();
            }else{
                this.clock.start();
            }
        }, false );
    }

    onScreenResize() {
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.cssRenderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.css2dRenderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }

    Render(): void {
        this.scenes.Top()?.Render();
        // if(this.input.IsKeyPressed("k")){ //takes a screenshot of the canvas and open in new tab
        //     window.open(this.renderer.domElement.toDataURL("image/png"));
        // }
        this.renderer.renderLists.dispose();
    }

    togglePostProcessing(){
        this.usePostProcessing = !this.usePostProcessing;
        this.scenes.Top().usePostProcessing = this.usePostProcessing;
        //@ts-ignore
        window.pp = this.usePostProcessing;
    }

    Update(): void {
        

        const delta = this.clock.getDelta();
        this.scenes.Top()?.Update(delta);
        this.stats.update();

    }

    CreateRenderer(): void {
        this.renderer = new THREE.WebGL1Renderer({ antialias: true, alpha: true });
        this.renderer.setClearColor(0x000000, 0.1);
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.gammaFactor = 2.2;
        this.renderer.physicallyCorrectLights = true;
        this.renderer.domElement.id = "game-canvas";
        this.container.appendChild(this.renderer.domElement);
        this.renderer.shadowMap.enabled= true;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.5;

        this.cssRenderer = new CSS3DRenderer();
        this.cssRenderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.cssRenderer.domElement.id = "cssrenderer-canvas";
        this.cssContainer.appendChild(this.cssRenderer.domElement);

        this.css2dRenderer = new CSS2DRenderer();
        this.css2dRenderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.css2dRenderer.domElement.style.position = 'absolute';
        this.css2dRenderer.domElement.style.top = '0px';
        document.body.appendChild(this.css2dRenderer.domElement);
        this.css2dRenderer.domElement.style.pointerEvents = 'none';
    }

    PushScene(scene : IScene) : void{
        this.scenes.Push(scene);
    }

    ChangeScene(scene : IScene) : void{
        this.scenes.Top().dispose();
        this.scenes.Pop();
        this.scenes.Push(scene);
    }

    PopScene(scene : IScene) : void{
        this.scenes.Pop();
    }

    stop(): void {
        this.renderer.setAnimationLoop(null);
    }

    ChangeScenePhoton = (data : any, users?) : void => {
        Game.GetInstance().gameChat.Unsubscribe([`Sala@${Game.GetInstance().gameClient.myRoom().name}`]);
        // this.gui.close();
        // this.gui.destroy();
        if(this.gameClient.isInLobby()){
            Game.GetInstance().ChangeScene(new TransitionScene(this.container, this.renderer, data, {users: users}));
        }else{
            Game.GetInstance().gameClient.leaveRoom();
            Game.GetInstance().gameClient.onJoinLobbyCallback = ()=>{
                Game.GetInstance().ChangeScene(new TransitionScene(this.container, this.renderer, data, {users: users}));
            }
        }
    }
}