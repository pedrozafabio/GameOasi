import React, { Component } from "react";
import styles from "./HUD.module.css";
import ponchoIcon from "../../assets/icons/poncho.svg";
import { GiVote } from "react-icons/gi";
import {
  MdAdd,
  MdBrightnessHigh,
  MdSettings,
  MdHelp,
  MdEvent,
  MdArrowForward,
  MdPerson,
  MdExitToApp,
  MdImportContacts,
  MdAssignment,
  MdPublic,
} from "react-icons/md";
import Button2 from "../BuildAvatar/Button2";
import Dropdown from "../BuildAvatar/Dropdown";
import ModalOasi from "../HistoryOasi/ModalOasi";
import ModalTerms from "../TermsUse/ModalTerms";
import ModalEvents from "../Events/ModalEvents";

import perfilImage from '../../assets/imgs/perfil.png';
import ModalStand from "../Stand/ModalStand";
import ToggleSwitch from "./ToggleSwitch";
import ModalDance from "../DanceInvite/ModalDance";
import ModalCamera from "../Camera/ModalCamera";

export default class HUD extends Component {
  state = {
    modalDanceVisible : false,
    spaceInfo : null,
    modalOasiVisible: false,
    modalTermsVisible: false,
    modalEventsVisible: false,
    modalStandVisible: false,
    modalStandData: null,
    buttonBackVisible: false,
    buttonVoteVisible: false,
    onBuildAvatarScene : false,
    modalCameraVisible : false
  };

  componentDidMount() {
    window.setButtonBackVisible = this.setButtonBackVisible;
    window.setButtonVoteVisible = this.setButtonVoteVisible;
    window.showStandModal = this.showStandModal.bind(this);
    window.showDanceModal = this.showDanceInvite.bind(this);
    window.hideDanceModal = this.hideDanceInvite.bind(this);
    window.showCameraModal = this.showModalOasi.bind(this, "modalCameraVisible");
    window.THREEHUD =  window.THREEHUD ?? {}
    window.THREEHUD.OnBuildAvatarScene = this.onBuildAvatarScene.bind(this);
  }

  showDanceInvite(spaceInfo){
    this.setState({modalDanceVisible : true, spaceInfo: spaceInfo});
  }

  hideDanceInvite(){
    this.setState({modalDanceVisible : false, spaceInfo: null});
  }

  showStandModal = (standData) =>{
    this.setState({modalStandVisible : true, modalStandData : standData});
  }

  onBuildAvatarScene(value){
    this.setState({onBuildAvatarScene : value});
  }

  setButtonBackVisible = (visible) => {
    this.setState({buttonBackVisible : visible});
  }

  setButtonVoteVisible = (visible) => {
    this.setState({buttonVoteVisible : visible});
  }

  data = [
    {
      value: "Editar Avatar",
      icon: (
        <img src={ponchoIcon} style={{ paddingRight: "10px", width: "16px" }} />
      ),
      onClick: () => {
        window.changeScene({ Type: "EditAvatar" }, []);
      },
    },
    {
      value: "História de Oasi",
      icon: <MdImportContacts style={{ paddingRight: "10px" }} />,
      onClick: () => {
        this.showModalOasi("modalOasiVisible");
      },
    },
    {
      value: "Termos de Uso",
      icon: <MdAssignment style={{ paddingRight: "10px" }} />,
      onClick: () => {
        this.showModalOasi("modalTermsVisible");
      },
    },
    {
      value: "Portal Oasi",
      icon: <MdPublic style={{ paddingRight: "10px" }} />,
      onClick: () => {
        window.open(
          process.env.REACT_APP_OASI_URL || "https://oasi.vc",
          "_self"
        );
      },
    },
    {
      value: "Sair",
      icon: <MdExitToApp style={{ paddingRight: "10px" }} />,
      onClick: () => { window.location.href = "https://oasi.vc/?logout=true"},
    },
  ];

  showModalOasi = (modalVisible) => {
    this.setState({ [modalVisible]: true });
  };

  hideModalOasi = (modalVisible) => {
    this.setState({ [modalVisible]: false });
  };

  render() {
    return (

      this.props.visible ?

      <div className={styles["root-div"]}>
        <div className={styles["root-div-children"]}>
          
          <div className={styles["root-user-image"]}>
            <div className={styles["user-image"]}>
              <Dropdown data={this.state.onBuildAvatarScene ? this.data.slice(1) : this.data} noborder>
                <img
                  className={styles.avatar}
                  src={perfilImage}
                />
                <div className={styles["user-config-button"]}>
                  <Button2
                    noborder
                    style={{
                      backgroundImage: undefined,
                      backgroundColor: "#000000",
                      borderRadius: "100% 100% 100% 100%",
                    }}
                  >
                    <MdSettings size="24px" style={{ padding: "5px" }} />
                  </Button2>
                </div>
              </Dropdown>              
            </div>
            
          </div>
          <div>  <ToggleSwitch initialValue={window.pp} labelFalse="Melhor Desempenho" labelTrue="Melhor Aparência" onClick={()=>{window.togglePP()}}> </ToggleSwitch>
          </div>

          <div className={styles.menuContainer}>
            <div className={styles.leftContainer}>
              <div className={styles.nivelContainer}>
                <div className={styles.nivelLabel}>nível</div>
                <div className={styles.number}>2</div>
              </div>
              <div className={styles.sliderContainer}>
                <input
                  className={styles.slider}
                  type="range"
                  min="1"
                  max="100"
                  value="80"
                  disabled
                />
                <div className={styles.progressContainer}>13/13</div>
              </div>
            </div>
            <div className={styles["center-container"]}>
              <img src="https://www.w3schools.com/howto/img_avatar.png" />
              <div className={styles.centerDescription}>
                <div
                  className={styles.nivelLabel}
                  style={{ textAlign: "left" }}
                >
                  próximo evento:
                </div>
                <div style={{ textAlign: "left" }}>
                  Feira da musica em 30 min
                </div>
              </div>
              <div className={styles["center-container-button"]}>
                <Button2
                  noborder
                  style={{
                    backgroundImage: undefined,
                    backgroundColor: "rgba(64,64,64)",
                    width: "80%",
                  }}
                >
                  <MdArrowForward style={{ padding: "5px" }} />{" "}
                </Button2>
              </div>
            </div>
            <div className={styles.rightContainer}>
              <div>
                <MdBrightnessHigh size="30px" />
              </div>
              <div className={styles.number2}>984</div>
              <Button2>
                <MdAdd style={{ padding: "10px" }} />{" "}
              </Button2>
            </div>
          </div>
          <div className={styles["buttons-div"]}>
        

          {this.state.buttonVoteVisible ? (
              <Button2
                style={{ padding: "10px", marginRight: "3%" }}
                onClick={() => {
                  window.open("https://oasi.vc/jury/mostra-de-clipes?t=" + this.props.token);
                }}
              >
                <GiVote style={{ paddingRight: "5px" }} />
                VOTAR
              </Button2>
            ) : null}

            <Button2
              style={{ padding: "10px", marginRight: "3%" }}
              onClick={() => {
                this.showModalOasi("modalEventsVisible");
              }}
            >
              <MdEvent style={{ paddingRight: "5px" }} />
              EVENTOS
            </Button2>

              
            {/* <Button2 style={{ padding: "10px", marginRight: "3%" }}>
              <MdHelp style={{ paddingRight: "5px" }} />
              AJUDA
            </Button2> */}

            
            {this.state.buttonBackVisible ? (
              <Button2
                style={{ padding: "10px", marginRight: "3%" }}
                onClick={() => {
                  window.changeScene({ Type: "Map" }, []);
                }}
              >
                <MdExitToApp style={{ paddingRight: "5px" }} />
                VOLTAR
              </Button2>
            ) : null}

            
          </div>
        </div>
        <ModalEvents
          visible={this.state.modalEventsVisible}
          handleHide={() => {
            this.hideModalOasi("modalEventsVisible");
          }}
          isShow={false}
        />
        <ModalOasi
          visible={this.state.modalOasiVisible}
          handleHide={() => {
            this.hideModalOasi("modalOasiVisible");
          }}
        />
        <ModalTerms
          visible={this.state.modalTermsVisible}
          handleHide={() => {
            this.hideModalOasi("modalTermsVisible");
          }}
        />

        <ModalStand
          visible={this.state.modalStandVisible}
          data={this.state.modalStandData}
          handleHide={() => {
            this.hideModalOasi("modalStandVisible");
          }}
        />

        <ModalDance
          visible={this.state.modalDanceVisible}
          handleHide={this.hideModalOasi.bind(this,"modalDanceVisible")}
          spaceInfo={this.state.spaceInfo}


        />

      <ModalCamera 
        visible ={this.state.modalCameraVisible}
        handleHide={this.hideModalOasi.bind(this, "modalCameraVisible")}
      />


      </div>
     : null);
  }
}
