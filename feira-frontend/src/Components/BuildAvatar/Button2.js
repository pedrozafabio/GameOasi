import React from 'react'
import styles from './Button2.module.css'

const Button2 = (props) => {

    let border = "";

    if(!props.noborder){
        if(props.disabled){
            border = styles.borderDisabled;
        }else{
            border = styles.border;
        }
    }

    return (
        <div className={(props.disabled ? styles.ButtonDisabled : styles.Button )+ " " + border}  id={props.id} onClick={props.onClick?.bind(this)} style={{ backgroundImage: 'linear-gradient(rgba(234,94,191), rgba(146,68,198))', ...props.style} }>
            {props.children}
        </div>
    )
}


export default Button2;