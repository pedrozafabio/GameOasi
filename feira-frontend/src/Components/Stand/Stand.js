import React, { useEffect, useState } from 'react'
import Backdrop from './Backdrop';
import Modal from './Modal';
import StandPage from './StandPage';
import { MdClose } from 'react-icons/md';
import modules from "../ThreeMainChat.module.css";

export default function Stand() {
    const [showStand, setShowStand] = useState(false);
    const [standInfo, setStandInfo] = useState(null);

    useEffect(() => {
        window.THREEStand = window.THREEStand ?? {
            SetStand : SetStand
        }
    });

    const SetStand = (info)=>{
        setShowStand(true);
        setStandInfo(info);
        console.log(info);
    }

    return (
        <div>
            {
                (showStand && standInfo != null) ? (
                <div>
                    <Backdrop onClick={()=>{
                        setShowStand(false);
                        setStandInfo(null);
                    }}></Backdrop>
                    <Modal>
                        <div style={{display:"flex", flexDirection:"row-reverse"}}>
                            <button onClick={()=>{
                            setShowStand(false);
                            setStandInfo(null);
                                }} className={modules.button}>
                                <MdClose></MdClose>
                            </button>
                        </div>
                        <StandPage stand={standInfo}></StandPage>
                    </Modal>
                </div>
                )
                : 
                null
            }            
        </div>
    )
}
