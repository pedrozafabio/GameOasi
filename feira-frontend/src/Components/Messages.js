import React, { useEffect } from 'react'

import modules from './Messages.module.css'

export default function Messages(props) {
    useEffect(() => {
        // let element = document.getElementById("Messages");
        // element.scrollTop = element.scrollHeight;
    })

    return (
        <div id={"Messages"} className={modules.MessageContainer}>
            {props.messages?.slice().reverse().map((message, index)=>{

                let m = message.indexOf(':');

                let name = message.slice(0, m);
                let resto = message.slice(m+1, message.length);
                let frase = <div style={{padding: '8px 6px'}}><b>{name}</b> {": " + resto} </div>; 

                let fraseByMe = props.username === name;
                

                return (
                <div className={modules.m + " " + (fraseByMe? modules.flexEnd : modules.flexStart)} key={message + index}>                    
                    <div className={fraseByMe ? (modules.OtherMessage + " " + modules.you ): (modules.Message + " " + modules.me)} >
                    {frase}
                </div></div>);
            }
            )}
        </div>
    )
}
