import Stack from "./Stack.js";
import IScene from "./IScene2.js";
import * as THREE from "../node_modules/three/src/Three.js";
import Scene from "./Scene.js";
import Stats from '../node_modules/three/examples/jsm/libs/stats.module.js';
import Input from "./Input.js";
import GameClient from './GameClient.js';
import {v4 as uuid} from './../node_modules/uuid/dist/esm-browser/index.js';
import GameChat from "./GameChat.js";
import LoadingScene from "./LoadingScene.js";
import LoadingScene2 from "./LoadingScene2.js";
import {CSS3DRenderer} from "../node_modules/three/examples/jsm/renderers/CSS3DRenderer.js"
import TestingScene from "./TestingScene.js";
import TestingScene2 from "./TestingScene2.js";
import TestingScene3 from "./TestingScene3.js";

export default class Game {
    scenes: Stack<IScene>;
    container: any;
    cssContainer : HTMLElement;
    clock: THREE.Clock;
    renderer: THREE.WebGLRenderer;
    cssRenderer : CSS3DRenderer;
    stats : any;
    input : Input;
    gameClient : GameClient;
    gameChat : GameChat;
    gameClientConnected : boolean;
    gameChatConnected : boolean;
    waitingForConnection : boolean;

    static instance : Game;

    static GetInstance() : Game{
        if(Game.instance)
            return Game.instance;
        new Game();
        return Game.instance;
    }

    private constructor() { //Make login first, then add scene
        
        Game.instance = this;        
        
        //Create Scene
        this.scenes = new Stack<IScene>();
        this.clock = new THREE.Clock();
        
        this.container = document.querySelector('#scene-container');
        this.cssContainer = document.querySelector("#scene-container-css");
        
        this.CreateRenderer();
        this.scenes.Push(new LoadingScene2(this.container, this.renderer));
        this.renderer.setAnimationLoop(() => {
            this.Update();
            this.Render();
            
            this.input.Update();
        })
        
        this.input = Input.GetInstance();

        this.stats = Stats();
        document.body.appendChild(this.stats.dom);
        
        window.addEventListener("resize", ()=>{this.onScreenResize()});
    }

    onScreenResize() {
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.cssRenderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }

    Render(): void {
        this.scenes.Top()?.Render();
        // if(this.input.IsKeyPressed("k")){ //takes a screenshot of the canvas and open in new tab
        //     window.open(this.renderer.domElement.toDataURL("image/png"));
        // }
        this.renderer.renderLists.dispose();
    }

    Update(): void {
        const delta = this.clock.getDelta();
        this.scenes.Top()?.Update(delta);
        this.stats.update();
    }

    CreateRenderer(): void {
        this.renderer = new THREE.WebGL1Renderer({ antialias: true, alpha: true });
        this.renderer.setClearColor(0x000000, 0);
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
    }

    PushScene(scene : IScene) : void{
        this.scenes.Push(scene);
    }

    ChangeScene(scene : IScene) : void{
        this.scenes.Pop();
        this.scenes.Push(scene);
    }

    PopScene(scene : IScene) : void{
        this.scenes.Pop();
    }

    stop(): void {
        this.renderer.setAnimationLoop(null);
    }
}