import React, { Component, useState } from "react";
import Button from "../Button";
import styles from "../BuildAvatar/Modal.module.css";

import { MdClose } from "react-icons/md";

//example
{/* <Modal
  handleHide={this.hideModal}
  visible={this.state.visible}
  buttons={[{ name: "teste", icon: <BiWorld /> }, { name: "teste" }]}
  pages={[
    <div>
      <img src="https://www.vippng.com/png/detail/53-535688_img-img-smartphone.png"></img>
      testes
    </div>,
    "saddassad",
  ]}
>
  {" "}
  saddsadassa
</Modal>; */}

export const ModalCopy = (props) => {
  const [buttonSelected, setButtonSelected] = useState(0);

  let renderPage = props.children;
  let buttons = props.buttons?.length > 0;
  let flexStyle = buttons ? styles["space-between"] : styles["flex-end"];

  let width = props.width ?? "50%";
  let height = props.height ?? "50%";

  let darkScrollbar = props.dark ? styles["scroll-dark"] : styles["scroll-light"];
  let darkBG = props.dark ? styles["d"] : styles["l"];

  if (props.pages) {
    renderPage = props.pages[buttonSelected];
  }
  let leftMenu = null;
  if (buttons) {
    leftMenu = (
      <div className={styles["container-left-buttons"]}>
        {props.buttons.map((element, index) => (
          <Button
            key={index}
            id={index}
            color="rgba(64,64,64)"
            colorSelected="rgba(29,29,29)"
            icon={element.icon}
            selected={buttonSelected}
            onClick={(e) => {
              setButtonSelected(index);
            }}
          >
            {element.name}
          </Button>
        ))}
      </div>
    );
  }

  return props.visible ? (
    <div>
      <div
        className={styles["container-main"] + " " + styles["zindex-0"]}
        onClick={props.handleHide}
        style={{alignItems:"flex-start"}}
      ></div>
      <div className={styles["container-main"] + " " + styles["zindex-1"]}>
      <div
          className={styles["container-buttons"] + " " + flexStyle}
          style={{ width: width }}
        >
          {leftMenu}
          { !props.noButton ?    <div className={styles["container-right-buttons"]}>
            <Button onClick={props.handleHide} icon={<MdClose />}>
              Fechar
            </Button>
          </div>: null}
        </div> 
        <div
          className={styles["container-content"] + " " + darkBG}
          style={{width: width, height: height }}
        >
          <div className={styles["content"] +" " + darkBG +" " + darkScrollbar} style={{width: props.cw?? '96%', height: props.ch ?? '95%'}}>{renderPage}</div>
        </div>
      </div>
    </div>
  ) : null;
};
