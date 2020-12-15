import * as THREE from "./../node_modules/three/src/Three.js";
import IGameObject from './IGameObject'
import {items} from "./ItemsDB.js";
import AssetsManager from "./AssetsManager.js";
import { SkinnedMesh } from "./../node_modules/three/src/Three.js";
import CharacterView from "./CharacterView.js";



export default class Character implements IGameObject{

    name: string;    
    mixer: THREE.AnimationMixer;
    object: THREE.Object3D;
    scene: THREE.Scene;
    initializeOutfit : boolean;
    
    characterView : CharacterView;

    constructor(scene: THREE.Scene) {   
        this.scene = scene;       
        this.Load();
        //@ts-ignore
        window.character = {};
        //@ts-ignore
        window.character.rotate = (e) => { this.rotate(e) };
        //@ts-ignore
        window.character.SetOutfit = (characterOutfit) => { this.characterView.setOutfit(characterOutfit)}
    }

    rotate(step){
        let rotation = this.object.rotation;
        this.object.rotation.set(rotation.x, rotation.y+step, rotation.z);      
    }

    Update(dt: number): void { 
        this.mixer?.update(dt);    
    }    

    Load(): void {
        //@ts-ignore
        this.characterView = new CharacterView([window.user.headTexture.textureId, window.user.ponchoSize.sizeId, window.user.ponchoTexture.textureId, window.user.headColor.colorId, window.user.bodyColor.colorId]);
        this.object = this.characterView.object;
        this.object.position.set(-2.5,-1,4);
        this.scene.add(this.object);
        const animation = this.characterView.gltf.animations[2];
        this.mixer = new THREE.AnimationMixer(this.object);
        const action = this.mixer.clipAction(animation);
        action.play();        
    }

}
