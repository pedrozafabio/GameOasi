import React from 'react'
import Button2 from './Button2';
import styles from './Dropdown.module.css'
import { MdBrightnessHigh } from "react-icons/md";

const Dropdown = (props) => {

    return (
        <div className={styles.dropdown}>
            <div className={styles.test}>
                {props.children}
            </div>
            <div className={styles["dropdown-content"]}>
                {props.data.map((element, index) => <div key={index} className={index !== props.data.length - 1 ? styles.borderBottom : undefined}  onClick={element.onClick}>
                    {element.icon} {element.value}
                </div>)}
            </div>
        </div>
    )
}

//{ value : "", onClick: "", icon}

export default Dropdown;