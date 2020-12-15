import React, { useEffect, useState } from 'react'
import {Modal} from './BuildAvatar/Modal'

import styles from './Invitation.module.css'
import modules from "./ThreeMainChat.module.css";

export default function Invitation() {
    const [currentInvitation, setCurrentInvitation] = useState({});
    
    const addInvitation = (invitation) =>{
        setCurrentInvitation(invitation);
        setTimeout(()=>{setCurrentInvitation({})}, 10000);
    };

    useEffect(() => {   
        window.THREEInvitation = window.THREEInvitation ?? {}; 
        window.THREEInvitation.AddInvitation = addInvitation;           
    });

    console.log(currentInvitation);

    return (
        <Modal width="30%" height="30%" visible = {Object.keys(currentInvitation).length > 0}
            handleHide = {()=>{setCurrentInvitation({})}}
        >
            <div>
                {`${currentInvitation.message}`}
            </div>

            <button className={modules["button"]} onClick={()=>{
                currentInvitation.onAccept();
                setCurrentInvitation({});
            }}>
                Aceitar
            </button>
            <button className={modules["button"]} onClick={()=>{
                setCurrentInvitation({});
            }} >
                Rejeitar
            </button>
        </Modal>
    )
}
