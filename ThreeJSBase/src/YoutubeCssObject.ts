import { CSS3DObject } from "../node_modules/three/examples/jsm/renderers/CSS3DRenderer.js";
import * as THREE from "../node_modules/three/src/Three.js";

export default class YoutubeCssObject{
    glObject : THREE.Object3D;
    cssObject : THREE.Object3D;
    iframe : HTMLIFrameElement;
    
    constructor(mesh : THREE.Mesh, private videoId : string, private playlist = false, autoplay=1, toggle=false){
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

        let iframe = document.createElement('iframe');
        iframe.src = `https://www.youtube.com/embed${playlist ? `?listType=playlist&list=${videoId}&enablejsapi=1&autoplay=${autoplay}` : `/${videoId}?enablejsapi=1`}&disable_polymer=true`;
        iframe.allow="accelerometer; autoplay; encrypted-media; gyroscope; fullscreen; "
        iframe.style.border = '0px';
        iframe.style.width = '1280px';
        iframe.style.height = '720px';
        
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
        //     console.log("loaded");
        //     this.glObject.userData.playVideo = ()=>{
        //         iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
        //         this.glObject.userData.playingVideo = true;
        //     }
    
        //     this.glObject.userData.stopVideo = ()=>{
        //         this.glObject.userData.playingVideo = false;
        //         iframe.contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}', '*');
        //     }

            this.glObject.userData.toggleVideo = ()=>{
                console.log(this.glObject.userData);
                if(!this.glObject.userData.playingVideo){
                    if(playlist){
                        iframe.src = `https://www.youtube.com/embed${playlist ? `?listType=playlist&list=${videoId}&enablejsapi=1&autoplay=${1}` : `/${videoId}?enablejsapi=1`}&disable_polymer=true`;
                        iframe.contentWindow?.postMessage('{"event":"command","func":"playVideoAt","args":0}', '*');
                    }else{
                        iframe.contentWindow?.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
                    }
                    this.glObject.userData.playingVideo = true;
                }else{
                    this.glObject.userData.playingVideo = false;
                    iframe.contentWindow?.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
                }
            }
            //iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
        }, true);
    }

        this.iframe = iframe;

        this.cssObject = cssObject;        
    }


    resetAutoplay(){
        this.iframe.src = `https://www.youtube.com/embed${this.playlist ? `?listType=playlist&list=${this.videoId}&enablejsapi=1&autoplay=${0}` : `/${this.videoId}?enablejsapi=1`}&disable_polymer=true`;

    }

    Dispose(){
        document.removeChild(this.iframe);
    }
}