import * as THREE from "./../node_modules/three/src/Three.js";
import IGameObject from './IGameObject'
import AssetsManager from "./AssetsManager.js";
import TextureAnimator from "./TextureAnimator.js";
import { Vector3 } from "./../node_modules/three/src/Three.js";

export default class SponsorBalloon implements IGameObject {
    
    object : THREE.Object3D;
    scene : THREE.Scene;
    name : string;
    textureAnimator : TextureAnimator;
    material : THREE.MeshBasicMaterial;

    posInit : THREE.Vector3;
    offsetY = 3;
    time = 0;

    constructor(scene: THREE.Scene, position?, scale?) {
        this.scene = scene;
        this.name = "SponsorBalloon";
        this.InitializeObject(position ?? new THREE.Vector3(0,0,0), scale ?? new THREE.Vector3(1,1,1));
    }

    Update(dt: number): void {
        if(!this.object)
            return;       

        this.textureAnimator?.Update(dt);
        this.MovementUpdate(dt);
    }

    MovementUpdate(dt : number) {
        
        if(this.time >= Math.PI*2)
            this.time = 0;

        this.time += dt;

        let temp = new THREE.Vector3().copy(this.posInit);
        let final = new THREE.Vector3().copy(this.posInit).add(new Vector3(0, this.offsetY, 0))
        let pos = temp.lerp(final, Math.sin(this.time));
        this.object.position.copy(pos);
    }

    InitializeObject(pos, scale) : void {
        this.textureAnimator = new TextureAnimator(AssetsManager.GetInstance().LoadTexture('models/Palco_Arvore/balaoUVModelo2.png'), 2, 1, 2);
        this.object = AssetsManager.GetInstance().LoadObject('models/Palco_Arvore/balao.glb').scene.children[0];
        //@ts-ignore
        this.object.children[0].material.map = this.textureAnimator.texture;
        this.object.position.copy(pos);
        this.object.scale.copy(scale);     
        this.posInit = new THREE.Vector3();
        this.posInit.copy(this.object.position);
        this.scene.add(this.object);        
    }
}
