import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react'

export default function ViewCamera() {
    const [stream, setStream] = useState(null);

    useEffect(() => {
        async function GetStream(){
            try {
                const stream = await navigator.mediaDevices.getUserMedia({video: {
                    width: { min: 320, ideal: 640, max: 1920 },
                    height: { min: 180, ideal: 360, max: 1080 }                    
                  },
                  audio: false
            
                
                });
                setStream(stream);
            } catch(err) {
            // Removed for brevity
            console.log(err);
            }
        }

        if(!stream){
            GetStream();
        }else{
            return ()=>{
                stream.getTracks().forEach(track => {
                    track.stop();
                  });
            }
        }
    }, [stream, setStream]);

    return stream;
}
