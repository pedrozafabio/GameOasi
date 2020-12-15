import React, { Component } from "react";
import styles from "./CardEvent.module.css";

export default class CardEvent extends Component{

    render() {
        return <div  className={styles["card-main"]}>
        <div className={styles["card-background"]} style={{backgroundImage: `url(${this.props.backgroundUrl})`}}/>        
        <div className={styles["container-logo"]}>
          <img className={styles["logo"]} src={this.props.logoUrl} />
        </div>
        <div className={styles["container-infos"]}>
          <div className={styles["title"]}>{this.props.name}</div>
          <div className={styles["subtitle"]}>{this.props.date}</div>
        </div>
      </div>
    }
}