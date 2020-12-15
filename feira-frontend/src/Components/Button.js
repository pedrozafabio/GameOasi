import React from 'react'

import modules from './Button.module.css'

export default function Button(props) {
    return (
        <div className={modules.Button} onClick={props.onClick?.bind(this)} style={props.selected ? {backgroundColor:"#ffa31a"} : null}>
            {props.children}
        </div>
    )
}
