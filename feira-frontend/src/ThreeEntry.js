import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';

import './main.css'

export default function ThreeEntry( props) {
    const dispatch = useDispatch();

    const modules =[
        "modules/three.js",
        "modules/Photon-Javascript_SDK.js",
        "modules/simplepeer.min.js",
        "modules/socket.io.slim.js",
        "modules/three.proton.js",
        "modules/three-pathfinding.umd.js",
        "entry.js",
        "modules/youtubeiFrameAPI.js",
        "https://embed.twitch.tv/embed/v1.js"
    ];

    const scriptsTags = [];

    useEffect(() => {
        modules.forEach(module => {
            console.log(`${module}`);
            let script = document.createElement('script');
            script.src = `${module}`;
            script.crossOrigin="anonymous";
            script.async = false;
            scriptsTags.push(document.body.appendChild(script));
        });
        
        return () => {
            scriptsTags.forEach(
                script=>{
                    document.body.removeChild(script);
                }
            );
        }
    });
    
    return (
        <div ref={props.ref}>
            <div id="scene-container-css"></div>
            <div id="scene-container"></div>
            <img id="canvas-image"></img>
        </div>
    )
}
