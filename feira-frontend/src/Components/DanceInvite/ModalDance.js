import React, { Component } from "react";
import { Modal } from "../BuildAvatar/Modal";
import { MdEvent, MdHelp, MdInfo } from "react-icons/md";
import styles from "./ModalConfirmation.module.css";
import Button2 from "../BuildAvatar/Button2";


export default class ModalDance extends Component {

 
  componentDidMount(){
    
  }


  render() {

    let buttons = [
      {
        name: "Confirmação",
        icon: <MdHelp/>,
      },
    ];


    let pages = [
      <div className={styles["container"]}>
        <div className={styles["container-child"]}>

          {this.props.spaceInfo?.name} te convidou para dançar :)
          <div className={styles["container-buttons"]}>
            <Button2 style={{ padding: "10px", marginRight: "3%" }} onClick={() => { 
              if(this.props.spaceInfo){

                this.props.spaceInfo.onAccept();
              }
              this.props.handleHide()
             } }>
              <MdHelp style={{ paddingRight: "5px" }} />
              SIM
            </Button2>

            <Button2 style={{ padding: "10px", marginRight: "3%" }} onClick={() => {this.props.spaceInfo.onDecline(); this.props.handleHide();}}>
              <MdHelp style={{ paddingRight: "5px" }} />
              NÃO
            </Button2>
            </div>
        </div>
      </div>,
    ];

    return (
      <Modal
        handleHide={() => {this.props.spaceInfo.onDecline(); this.props.handleHide();} }
        visible={this.props.visible}
        pages={pages}
        width="30%"
        height="30%"
        buttons={buttons}
        dark
        noButton
      />
    );
  }
}
