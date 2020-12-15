import { GUI } from "../node_modules/three/examples/jsm/libs/dat.gui.module.js";

export default interface IGameObject{
    object: THREE.Object3D;
    scene: THREE.Scene;
    name : string;
    Update(dt : number) : void;
}