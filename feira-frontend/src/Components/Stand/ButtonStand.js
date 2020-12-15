import React from 'react'
import styles from './ButtonStand.module.css'

const ButtonStand = (props) => {

    return (
        <div className={styles["button"]}  id={props.id} onClick={props.onClick?.bind(this)}>
            <div className={styles["button-icon"]}>{props.icon}</div>
            {props.children}
        </div>
    )
}


export default ButtonStand;