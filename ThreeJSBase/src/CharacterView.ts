import * as THREE from "./../node_modules/three/src/Three.js";
import {items} from "./ItemsDB.js";
import AssetsManager from "./AssetsManager.js";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { Mesh } from "./../node_modules/three/src/Three.js";

export const enum OUTFIT {
    HEAD,
    PONCHO_SIZE,
    PONCHO_TEXTURE,
    HEAD_COLOR,
    BODY_COLOR
};

export default class CharacterView {    
    gltf : GLTF;
    object: THREE.Object3D;
    initializeOutfit : boolean;
    
    // HEAD = 0
    // PONCHO_SIZE = 1
    // PONCHO_TEXTURE = 2
    // HEAD_COLOR = 3
    // BODY_COLOR = 4
    characterOutfit = [1,0,2,0,2];

    constructor(outfit = null) {        
        this.Load('models/CharacterPoncho/2.glb');  
        this.setOutfit(outfit ?? this.characterOutfit );        
    }

    setOutfit(characterOutfit) {
        this.SetHeadModel(characterOutfit[OUTFIT.HEAD]);
        this.SetHeadColor(characterOutfit[OUTFIT.HEAD_COLOR]);
        this.SetBodySize(characterOutfit[OUTFIT.PONCHO_SIZE]);
        this.SetBodyColor(characterOutfit[OUTFIT.BODY_COLOR]);
        this.SetPonchoTexture(characterOutfit[OUTFIT.PONCHO_TEXTURE]);
    }

    SetHeadModel(id : number){
        this.characterOutfit[OUTFIT.HEAD] = id;

        for(let i=0; i < 5; i++){
            this.object.children.find(x => x.name.includes("cabeca" + (i+1))).visible = (i == id);
        }
    }

    SetHeadColor(id : number){
        this.characterOutfit[OUTFIT.HEAD_COLOR] = id;
        let color = items.headColor[id].color;
        let slot = this.object.children.filter(x => x.name.includes('cabeca')); 

        slot.forEach(element => {
            ((<THREE.SkinnedMesh>element).material as THREE.MeshPhysicalMaterial).color = new THREE.Color(color);            
        });

    }

    SetBodyColor(id : number){
        this.characterOutfit[OUTFIT.BODY_COLOR] = id;
        let color = items.bodyColor[id].color;
        let slot = this.object.children.find(x => x.name.includes('corpo'));   
        ((<THREE.SkinnedMesh>slot).material as THREE.MeshPhysicalMaterial).color = new THREE.Color(color);

    }

    SetBodySize(id : number){       
        this.characterOutfit[OUTFIT.PONCHO_SIZE] = id;
        for(let i=0; i < 3; i++){
            this.object.children.find(x => x.name.includes("poncho" + (i+1))).visible = (i == id);
        }
    }

    SetPonchoTexture(id : number) {
        this.characterOutfit[OUTFIT.PONCHO_TEXTURE] = id;
        let slot = this.object.children.filter(x => x.name.includes('poncho')); 
        let texturePath = items.ponchos[id].texture;
        let texture = AssetsManager.GetInstance().LoadTexture(texturePath);

        slot.forEach(element => {
            ((<THREE.SkinnedMesh>element).material as THREE.MeshPhysicalMaterial).map = texture;            
        });
    }

    Load(src: string): void {
        this.gltf = AssetsManager.GetInstance().LoadObject(src);
        this.object = this.gltf.scene.children[0];

        this.object.traverse(x => {
            let mesh = x as THREE.Mesh;
            
            //@ts-ignore
            if(x.isMesh){
                let phongMaterial = new THREE.MeshPhongMaterial({
                    reflectivity: 0,
                    shininess: 0,
                    aoMapIntensity: 0,
                    //@ts-ignore
                    color: mesh.material.color,
                    //@ts-ignore
                    map: mesh.material.map,
                    refractionRatio: 0,
                    skinning : true
                  });

              mesh.material = phongMaterial;
        }});
    }

}
