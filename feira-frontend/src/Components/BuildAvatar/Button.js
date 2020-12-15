import React from "react";
import styles from "./Button.module.css";

const Button = (props) => {
  let selected = props.selected === props.id;
  let color = props.colorSelected && selected ? props.colorSelected : props.color;

  return (
    <div
      className={styles["container"]}
      id={props.id}
      style={{backgroundColor: color}}
      onClick={props.onClick?.bind(this)} >
      <div className={styles["container-content"]}>
        {props.icon ? <div className={styles.icon}>{props.icon}</div> : null}
        <div>{props.children}</div>
      </div>
    </div>
  );
};

export default Button;
