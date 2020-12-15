import React, { Component } from "react";
import { Modal } from "../BuildAvatar/Modal";
import imageOasi from "../../assets/imgs/img_1.png";
import diamondIcon from "../../assets/icons/diamond.svg";
import { MdEvent, MdHelp, MdInfo } from "react-icons/md";
import styles from "./ModalEvents.module.css";
import CardEvent from "./CardEvent";
import CardShow from "./CardShow";
import Button2 from "../BuildAvatar/Button2";

import events from './events';
import palco1 from './palco1';
import palco2 from './palco2';
import palco3 from './palco3';
import palco4 from './palco4';
import workshop1 from './workshop1';
import workshop2 from './workshop2';
import workshop3 from './workshop3';
import rodada from './rodada';
import galeria1 from './galeriadia';
import galeria2 from './galeriafoda';
import galeria3 from './galeriascs';
import galeria4 from './galeriaclic';
import escolacriacao from './escoladecriacao';
import feira from './feira';
import propulsao from './propulsao';

export default class ModalEvents extends Component {

  state={
  }
 
  componentDidMount(){
    
  }


  render() {
    let shows = [];
    let nomePalco = "";
    let disable = false;
    console.log("nome");
    console.log(this.props.spaceInfo?.name);
    switch(this.props.spaceInfo?.name){
      case "Show1":
        shows = palco1;
        nomePalco = "Palco Poente Ermida";
        // disable = true;
        break;
      case "Show2":
        shows = palco2;
        nomePalco = "Palco Poente Orla";
        // disable = true;
        break;
      case "Show3":
        shows = palco3;
        nomePalco = "Arena Digital Torre de Tv";
        // disable = true;
        break;
      case "Show4":
        shows = palco4;
        nomePalco = "Palco SCS";
        // disable = true;
        break;
      case "Workshop1":
        shows = workshop1;
        nomePalco = "Reverbera";
        // disable = true;
        break;
      case "Workshop2":
        shows = workshop2;
        nomePalco = "Escola de criação";
        // disable = true;
        break;
      case "Workshop3":
        shows = workshop3;
        nomePalco = "Casa Link";
        // disable = true;
        break;
      case "Workshop4":
        // shows = formacaozulene;
        nomePalco = "Conta Comigo";
        disable = true;

        break;
      case "Galeria1":
        shows = galeria3;
        nomePalco = "Shows Permanentes";
        // disable = true;
        
        break;   
      case "Feira":
        shows = feira;
        nomePalco = "Convida Mix";
        // disable = true;
        break;      
      default:
        break;
    }

    let data = this.props.isShow
      ? shows.sort((a,b) => a.dateInit - b.dateInit)
      : events.sort((a,b) => a.dateInit - b.dateInit);
    let now = Date.now();
    let currentEvents = data.filter(x => {
      return now >= x.dateInit && now <= x.dateFinal
    
    });
    let notCurrentEvents = data.filter(x => !(now >= x.dateInit && now <= x.dateFinal));
    let nextEvents = notCurrentEvents.filter(x => now < x.dateInit);
    let prevEvents = notCurrentEvents.filter(x => now > x.dateFinal);



    let buttons = [
      {
        name: this.props.isShow ? nomePalco : "Todos os Eventos",
        icon: <MdEvent/>,
      },
    ];
    let pages = [
      <div className={styles["container"]}>
        <div className={styles["container-child"]}>
          {disable ? null : this.returnButton(this.props.isShow, nomePalco)}
          {currentEvents.length > 0 ? <div className={styles.now}><MdInfo style={{paddingRight: '5px'}}/> Acontencendo Agora!</div> : null}
          {currentEvents.map((x,index) => this.props.isShow 
            ? <CardShow key={index} backgroundUrl={x.banner} logoUrl={x.logo} name={x.name} date={x.description} dateInit={x.dateInit} dateFinal={x.dateFinal} />
            : <CardEvent key={index} backgroundUrl={x.banner} logoUrl={x.logo} name={x.name} date={x.description} />
          )}
          {nextEvents.length > 0 ? <div className={styles.next}> {this.props.isShow ? "Próximas apresentações" : "Próximos eventos"}</div> : null}
          {nextEvents.map((x,index) => this.props.isShow
            ? <CardShow key={index} backgroundUrl={x.banner} logoUrl={x.logo} name={x.name} date={x.description} dateInit={x.dateInit} dateFinal={x.dateFinal} />
            : <CardEvent key={index} backgroundUrl={x.banner} logoUrl={x.logo} name={x.name} date={x.description} />
          )}
          {currentEvents.length === 0 && nextEvents.length === 0
            ? this.emptyModal(this.props.isShow)
            : null
          }
        </div>
      </div>,
    ];

    return (
      <Modal
        handleHide={this.props.handleHide}
        visible={this.props.visible}
        pages={pages}
        width="50%"
        height="60%"
        buttons={buttons}
        dark
      />
    );
  }

  returnButton(isShow, nomePalco){
    if(isShow){
      return (
        <div className={styles["container-buttons"]}>
            <Button2 style={{ padding: "10px", marginRight: "3%" }} onClick={() => { 
              if(this.props.spaceInfo){

                this.props.spaceInfo.onAccept();
              }
              this.props.handleHide()
             } }>
              {nomePalco? `Entrar no Espaço ${nomePalco}` : "Entrar"}
            </Button2>
          </div>
      );
    }

    return null;

  }

  emptyModal(isShow){
    return(
      <div className={styles["empty-text"]}>
        Não existem novos eventos neste espaço no momento. Volte em breve!
      </div>
    );
  }
}
