import React, { useEffect, useState } from 'react'

import modules from './EnterSpace.module.css'
import ModalConfirmation from './ModalConfirmation/ModalConfirmation';
import ModalEvents from "./Events/ModalEvents";

/*
    spaceInfo = {
        name: string,
        descriptiion : string,
        ticket : string,
        onAccept : function () void : void
    }
*/

export default function EnterSpace() {
    const [spaceInfo, setSpaceInfo] = useState(null);
    
    useEffect(() => {
        window.THREESpace = window.THREESpace ?? {};
        window.THREESpace.SetSpaceInfo = setSpaceInfo;
    })
    
    return (
        // <ModalConfirmation 
        // visible={spaceInfo !== null} 
        // handleHide={() => {setSpaceInfo(null); spaceInfo.onDecline();}} 
        // spaceInfo={spaceInfo}
        // />
        <ModalEvents
          visible={spaceInfo !== null}
          handleHide={() => {setSpaceInfo(null); spaceInfo.onDecline();}}
          isShow={true}
          spaceInfo={spaceInfo}
        />
    )
}
