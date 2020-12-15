import React, { useState } from 'react'

export default function ThreeChatTab(props) {
    //props: message channel
    //       messages as state
    //       channel name

    return (
        <div onClick={props.onClick.bind(this)}>
            {props.name}
        </div>
    )
}
