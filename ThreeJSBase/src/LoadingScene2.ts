import { Renderer } from "../node_modules/three/src/Three.js";
import IScene from "./IScene2.js";
import Scene from "./BuildAvatarScene.js";
import AssetsManager from "./AssetsManager.js";
import { items } from "./ItemsDB.js";
import Game from "./GameIsaac.js";
import Input from "./Input.js";

// Cena para dar load em objetos e texturas no inicio do jogo
// testando em GameIsaac.js
export default class LoadingScene extends IScene {
  assetsManager: AssetsManager;
  pathsToLoad: string[] = [];
  texturesToLoad: string[] = [];

  constructor(container: HTMLElement, renderer: THREE.WebGLRenderer) {
    super(container, renderer);

    this.assetsManager = AssetsManager.GetInstance();

    //    this.pathsToLoad.push('models/CharacterNew/char2.glb');
    this.pathsToLoad.push("models/CharacterPoncho/p.glb");
    //    this.pathsToLoad.push('models/CharacterNew/char2.glb');
    //    this.pathsToLoad.push('models/boneco2.glb');

    console.log(this.assetsManager.loading);
    Object.keys(items).forEach((key) => {
      items[key].forEach((e) => {
        if (key !== "skin") {
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

    this.texturesToLoad.push("imgs/night.png");

    console.log(this.pathsToLoad);
    console.log(this.texturesToLoad);

    this.pathsToLoad.forEach((path) => {
      this.assetsManager.LoadObject(path);
    });

    this.texturesToLoad.forEach((path) => {
      this.assetsManager.LoadTexture(path);
    });
  }

  Update(dt: number): void {
    if (!AssetsManager.GetInstance().loading) {
      console.log("Waiting outift to be created...");
      // Game.GetInstance().ChangeScene(new Scene(this.container, this.renderer));
    }
  }
}
