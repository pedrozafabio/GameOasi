import React from 'react'

import modules from './Card.module.css'

export default function Card(props) {
    return (
        <div className={modules.Card}>
            {props.children}
        </div>
    )
}
