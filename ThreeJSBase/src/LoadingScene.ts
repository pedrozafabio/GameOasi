import { Renderer } from "../node_modules/three/src/Three.js";
import AssetsManager from "./AssetsManager.js";
import Game from "./Game.js";
import IScene from "./IScene.js";
import { items } from "./ItemsDB.js";
import MapScene from "./MapScene.js";
import Scene from "./Scene.js";
import TransitionScene from "./TransitionScene.js";

export default class LoadingScene extends IScene {

    pathsToLoad: string[] = [];
    texturesToLoad: string[] = [];

    constructor(container: HTMLElement, renderer: THREE.WebGLRenderer) {
        super(container, renderer);
        this.Load();
        this.LoadObjects();
        this.LoadTextures();
    }
    Load() {
        // this.pathsToLoad.push('models/CharacterPoncho/p.glb');
        this.pathsToLoad.push('models/CharacterPoncho/2.glb');

        this.pathsToLoad.push('models/Palco_Arvore/palco.glb');
        this.pathsToLoad.push('models/Palco_Arvore/navmesh.glb');

        this.pathsToLoad.push('models/Palco_Casulo/palco.glb');
        this.pathsToLoad.push('models/Palco_Casulo/navmesh.glb');

        this.pathsToLoad.push('models/Palco_Cubo/palco.glb');
        this.pathsToLoad.push('models/Palco_Cubo/navmesh.glb');
        this.pathsToLoad.push('models/mapa/mapa-convida.glb');
        // this.pathsToLoad.push('models/galeria/galeria.glb');
        this.pathsToLoad.push('models/galeria/galeria_convida.glb');
        // this.pathsToLoad.push('models/galeria/galeria_clicse.glb');
        // this.pathsToLoad.push('models/galeria/galeria_foda.glb');
        // this.pathsToLoad.push('models/galeria/galeria_d.glb');
        this.pathsToLoad.push("models/feiraDeExposicaoConvida.glb");
        // this.pathsToLoad.push('models/Palco_Arvore/balao.glb');
        
        this.texturesToLoad.push('imgs/night.png');
        this.texturesToLoad.push('imgs/nigh2.jpg');
        this.texturesToLoad.push('imgs/nigh3.jpg');
        // this.texturesToLoad.push('models/Palco_Arvore/balaoUVModelo2.png');
        // this.texturesToLoad.push('textures/instructions/1.png');
        this.texturesToLoad.push('textures/ta.jpg');
        // this.texturesToLoad.push('textures/instructions/2.png');

        Object.keys(items).forEach(key => {

            items[key].forEach(e => {

                if (key !== 'skin') {
                    let path = e.path;
                    let texturepath = e.texture;

                    if (path) {
                        if (!this.pathsToLoad.includes(path)) {
                            this.pathsToLoad.push(path);
                        }
                    }

                    if (texturepath) {
                        if (!this.texturesToLoad.includes(texturepath)) {
                            this.texturesToLoad.push(texturepath);
                        }
                    }
                }

            });
        });
    }

    LoadObjects () : void {       

        this.pathsToLoad.forEach(path => {
            AssetsManager.GetInstance().LoadObject(path);
        });
    }

    LoadTextures() : void {
        this.texturesToLoad.forEach(path => {
            AssetsManager.GetInstance().LoadTexture(path);
        });
    }

    Update(dt: number): void {
        if (Game.GetInstance().gameChatConnected && Game.GetInstance().gameClientConnected && !AssetsManager.GetInstance().loading) {
            Game.GetInstance().ChangeScene(new TransitionScene(this.container, this.renderer, { 'Map': 'main', 'Type': "Map", Tag: '' }, { users: [] }));
        }
    }

}