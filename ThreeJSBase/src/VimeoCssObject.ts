import {CSS3DObject} from 'three/examples/jsm/renderers/CSS3DRenderer';
import * as THREE from 'three';


export default class VimeoCssObject{
    glObject : THREE.Object3D;
    cssObject : THREE.Object3D;
    iframe : HTMLIFrameElement;

    constructor(mesh : THREE.Mesh, videoId : string, toggle = false){
        let rotation = mesh.rotation.clone();

        mesh.rotation.set(0,0,0);
        let material = new THREE.MeshBasicMaterial({
            color: new THREE.Color('black'),
            blending : THREE.NoBlending,            
            side : THREE.DoubleSide,
            opacity: .2
        });
        
        let planeMesh = new THREE.Mesh(mesh.geometry, material);
        planeMesh.position.copy(mesh.position);
        planeMesh.userData.name = "OtherWindow";
        planeMesh.castShadow = true;


        this.glObject = planeMesh;

        let object = new THREE.Box3().setFromObject(this.glObject);
        let info = new THREE.Vector3();
        object.getSize(info);
//
        let iframe = document.createElement('iframe');
        iframe.id=videoId;
        iframe.src = `https://player.vimeo.com/video/${videoId}?api=1&player_id=${videoId}`;
        iframe.setAttribute("height", "720");
        iframe.setAttribute("width", '1280');
        iframe.setAttribute("allowfullscreen", "true");
        iframe.setAttribute("frameborder", "0");

        let cssObject = new CSS3DObject(iframe);
        cssObject.position.set(this.glObject.position.x - (window.innerWidth/2.0), this.glObject.position.y, this.glObject.position.z);
        cssObject.scale.set(info.x/1280.0, info.y/720.0, 0.1);
        cssObject.name = "CssScreen";
        console.log(cssObject);
        
        cssObject.rotation.setFromVector3(this.glObject.rotation.toVector3());

        this.glObject.rotation.copy(rotation);
        cssObject.rotation.copy(rotation);
        this.glObject.name = `Screen${videoId}`;
        this.glObject.userData.playingVideo = false;
        this.glObject.userData.name = "OtherScreen";


        if(toggle){
            iframe.addEventListener('load', ()=>{    
                this.glObject.userData.toggleVideo = ()=>{
                    console.log(this.glObject.userData);
                    if(!this.glObject.userData.playingVideo){
                        iframe.contentWindow?.postMessage({method:"play"}, '*');
                        this.glObject.userData.playingVideo = true;
                    }else{
                        this.glObject.userData.playingVideo = false;
                        iframe.contentWindow?.postMessage({method:"pause"}, '*');
                    }
                }
            }, true);
        }

        this.iframe = iframe;
        this.cssObject = cssObject;
    }
}