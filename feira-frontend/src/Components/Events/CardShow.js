import React, { Component } from "react";
import styles from "./CardEvent.module.css";

export default class CardShow extends Component{

    render() {
      console.log(this.props.name);
        return <div  className={styles["card-main"]}>
        <div className={styles["card-background"]} style={{backgroundImage: `url(${this.props.backgroundUrl})`}}/>        
        <div className={styles["container-logo2"]}>
            <div className={styles["subtitle"]}>{this.getFormattedDate()}</div>
            <div className={styles["title"]}>{
                ("0" + (this.props.dateInit.getHours())).slice(-2) + ":" + ("0" + (this.props.dateInit.getMinutes())).slice(-2)
                + " - " +
                ("0" + (this.props.dateFinal.getHours())).slice(-2) + ":" + ("0" + (this.props.dateFinal.getMinutes())).slice(-2)
            }</div>
        </div>
        <div className={styles["container-infos"]}>
          <div className={styles["title"]}>{this.props.name}</div>
          <div className={styles["subtitle"]}>{this.props.date}</div>
        </div>
      </div>
    }


    getFormattedDate(){
      let startDate = ("0" + (this.props.dateInit.getDate())).slice(-2) + "/" + ("0" + (this.props.dateInit.getMonth() + 1)).slice(-2);
      let endDate = ("0" + (this.props.dateFinal.getDate())).slice(-2) + "/" + ("0" + (this.props.dateFinal.getMonth() + 1)).slice(-2);
      
      if(startDate != endDate){
        return startDate + " - " + endDate;
      }

      return startDate;
    }
}