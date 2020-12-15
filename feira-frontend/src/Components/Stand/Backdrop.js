import React from 'react'

import modules from './Backdrop.module.css'

export default function Backdrop(props) {
    return (
        <div onClick={()=>{
            props.onClick();
        }}
            className={modules.Backdrop}
        >            
        </div>
    )
}
