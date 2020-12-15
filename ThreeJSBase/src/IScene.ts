import * as THREE from '../node_modules/three/src/Three.js'
import IGameObject from "./IGameObject.js";
import HUD from './HUD.js';
import { DepthTexture } from '../node_modules/three/src/Three.js';
import { EffectComposer } from '../node_modules/three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from '../node_modules/three/examples/jsm/postprocessing/RenderPass.js';
import Game from './Game.js';

export default abstract class IScene {    
    container: HTMLElement;
    camera: THREE.Camera;
    scene: THREE.Scene;
    gameObjects: IGameObject[];
    otherActors : {};
    renderer : THREE.WebGLRenderer;
    composer: EffectComposer;

    usePostProcessing : boolean = false;

    constructor(container : HTMLElement, renderer : THREE.WebGLRenderer){
        this.container = container;
        this.gameObjects = [];
        this.otherActors = {};
        this.renderer = renderer;
    
        this.composer = new EffectComposer(renderer);        
    }

    abstract Update(dt: number) : void;
    
    Render(): void {
        if (this.scene && this.camera) {
            if (this.usePostProcessing) {
                this.composer.render();
            } else {
                this.renderer.render(this.scene, this.camera);
            }
        }
    }

    initHUD() : void {}
    dispose() : void{
        this.container.style.pointerEvents = 'auto';
        let cssRendererElement = Game.GetInstance().cssRenderer.domElement.firstChild;
        let cssRendererElement2 = Game.GetInstance().css2dRenderer.domElement;

        while(cssRendererElement2.firstChild){
            cssRendererElement2.removeChild(cssRendererElement2.firstChild);
        }

        while(cssRendererElement.firstChild){
            cssRendererElement.removeChild(cssRendererElement.firstChild);
        }
    }

    ConnectToRoom(settings : any){ 
       
        if(Game.GetInstance().gameClient.isInLobby()){
            Game.GetInstance().gameClient.ConnectToRoom(
                settings
            );
        }
    }
}