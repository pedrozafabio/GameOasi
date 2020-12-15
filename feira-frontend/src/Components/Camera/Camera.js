import React from 'react'
import { useRef } from 'react'
import ViewCamera from './ViewCamera'

export default function Camera() {
    const videoRef = useRef();
    const mediaStream = ViewCamera();

    if(mediaStream && videoRef.current && !videoRef.current.srcObject){
        videoRef.current.srcObject = mediaStream;
    }

    return (<video id="video" style={{width:"100%", height:"100%"}} ref={videoRef} autoPlay playsInline muted controls={false}/>)
}
