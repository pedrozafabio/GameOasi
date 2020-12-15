import { Vector3 } from 'three';
import {CSS3DObject} from '../node_modules/three/examples/jsm/renderers/CSS3DRenderer.js';

const VideoElement = (id : string, x : number, y : number, z : number, rotation : Vector3, w : number, h : number)=>{

    let iframe = document.createElement("iframe");
    iframe.style.width = `${w}px`;
    iframe.style.height = `${h}px`;
    iframe.style.border = '0px';
    iframe.src = `https://www.youtube.com/embed/${id}`;
    iframe.allow= "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture";

    return iframe;
}

export default {
    VideoElement
};