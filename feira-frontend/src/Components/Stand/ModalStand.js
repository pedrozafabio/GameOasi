import React, { Component } from "react";
import { Modal } from "../BuildAvatar/Modal";
import { MdEvent, MdHelp, MdInfo } from "react-icons/md";
import styles from "./ModalStand.module.css";
import Button2 from "../BuildAvatar/Button2";
import StandPage from "./StandPage";


export default class ModalStand extends Component {


  render() {


    let pages = [
      <div className={styles["container"]}>
        <div className={styles["container-child"]}>
            {this.props.data ?  
            <StandPage stand={this.props.data}></StandPage>
 : "nao tem data"}
        </div>
      </div>,
    ];

    return (
      <Modal
        handleHide={this.props.handleHide}
        visible={this.props.visible}
        pages={pages}
        width="50%"
        height="80%"
        dark
        cw="100%"
        ch="100%"
      />
    );
  }
}
