import React, { Component } from "react";
import { GiVote } from "react-icons/gi";
import Button2 from "../BuildAvatar/Button2";
import styles from "./HUD.module.css";


export default class Hotkeys extends Component {
  state = {
    visible : false
  };

  componentDidMount() {
    window.setHotkeysVisible = this.setVisible.bind(this);
  }

  setVisible(visible){
    this.setState({visible : visible});
  }

  render() {

    let buttons=[0,0,0];


    return (

      this.state.visible ?

      <div className={styles["root-div"]}>
        <div className={styles["hotkeys-div"]}>
          {buttons.map((x,index) => <Button2 key={index} style={{ padding: "10px 15px"}} onClick={() => {
            if(window.dance)
              window.dance(index);
          }}>{index+1}</Button2>)}
          </div>
          <div className={styles["hint"]}>
            Convide uma nômade para dançar, clicando nela com o botão direito do mouse (; 
          </div>
      </div>
     : null);
  }
}
