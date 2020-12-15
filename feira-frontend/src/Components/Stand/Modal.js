import React from 'react'

import modules from './Modal.module.css'

export default function Modal(props) {
    console.log(props);
    return (
        <div className={modules.Modal}>
            {props.children}
        </div>
    )
}
