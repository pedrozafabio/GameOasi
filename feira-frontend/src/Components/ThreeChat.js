import React, { Component } from "react";
import ThreeChatMessage from "./ThreeChatMessage";
import ThreeChatTab from "./ThreeChatTab";

import styles from "./ThreeChat.module.css";
import ThreeMainChat from "./ThreeMainChat";
import ThreeOtherChats from "./ThreeOtherChats";
import { connect } from "react-redux";

import { addTab, removeTab } from "../store/actions/tabs";
import { addPrivateMessage, addPublicMessage } from "../store/actions/messages";
import { addUserInTab, removeUserInTab } from "../store/actions/users";
import {
  MdHelp,
  MdPublic,
  MdPeople,
  MdEvent,
  MdChat,
  MdLocalActivity,
} from "react-icons/md";
import { TiArrowMinimise } from "react-icons/ti";
import Button from "./BuildAvatar/Button";
import Button2 from "./BuildAvatar/Button2";
import ChatLocal from "./ChatLocal";
import GroupChat from "./GroupChat";

const numberOfMessages = 30;

class ThreeChat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      publicTabs: {},
      privateTabs: {},
      currentChat: "",
      onMainChat: true,
      message: "",
      publicMessages: {},
      privateMessages: {},
      onChat: {},
      visible: false,
      buttonSelected: 0,
      minimized: false
    };
    window.ThreeChat = window.ThreeChat ?? {};
    window.ThreeChat.setVisible = this.setVisible;
  }

  setVisible = (visible) => {
    this.setState({ visible: visible });
  };

  componentDidMount() {
    window.ThreeChat.CreateTab = this.createTab.bind(this);
    window.ThreeChat.RemoveTab = this.removeTab.bind(this);
    window.ThreeChat.CreatePrivateTab = this.createPrivateTab.bind(this);
    window.ThreeChat.RemovePrivateTab = this.removePrivateTab.bind(this);
    window.ThreeChat.ReportOnline = this.reportOnline.bind(this);
    window.ThreeChat.PublicTab = {};
    window.ThreeChat.PrivateTab = {};
  }

  createTab(tab) {
    window.ThreeChat.PublicTab[tab.name] = {};
    window.ThreeChat.PublicTab[tab.name].AddMessage = (message) => {
      console.log(message);
      this.props.addPublicMessage(message, tab.name);
    };

    this.props.addTab(tab, true);
  }

  reportOnline(tab, user) {
    this.props.addUserInTab(tab, true, user);
  }

  removeTab(tab) {
    delete window.ThreeChat.PublicTab[tab.name];

    this.props.removeTab(tab, true);
  }

  createPrivateTab(tab) {
    window.ThreeChat.PrivateTab[tab.name] = {};
    window.ThreeChat.PrivateTab[tab.name].AddMessage = (message) => {
      console.log(message);

      this.props.addPrivateMessage(message, tab.name);
    };

    this.props.addTab(tab, false);
  }

  removePrivateTab(tab) {
    delete window.ThreeChat.PrivateTab[tab.name];

    this.props.removeTab(tab, false);
  }

  render() {
    let buttons = [
      {
        name: "Geral",
        icon: <MdPublic />,
      },
      {
        name: "Grupo",
        icon: <MdLocalActivity />,
      },
      {
        name: "Privado",
        icon: <MdPeople />,
      },
    ];

    let leftMenu = (
      <div className={styles["container-left-buttons"]}>
        {buttons.map((element, index) => (
          <Button
            key={index}
            id={index}
            color="rgba(64,64,64)"
            colorSelected="rgba(29,29,29)"
            icon={element.icon}
            selected={this.state.buttonSelected}
            onClick={(e) => {
              this.setState({ buttonSelected: index });
            }}
          >
            {element.name}
          </Button>
        ))}
        <div
          className={styles["minimize-button"]}
          onClick={() => {
            this.setState({ minimized: true });
          }}
        >
          {" "}
          <TiArrowMinimise />{" "}
        </div>
      </div>
    );

    let chats = (
      <ThreeMainChat
        username={this.props.character.username}
        tab={this.props.tabs.publicTabs.Main}
        messages={this.props.messages.publicMessages.Main}
      ></ThreeMainChat>
    );

    // if (this.state.buttonSelected === 0) {
    //   chats = <ChatLocal />;
    // } else 
    if (this.state.buttonSelected === 1) {
      chats = <GroupChat />;
    } else if (this.state.buttonSelected === 2) {
      chats = <ThreeOtherChats />;
    }

    return this.state.visible ? (
      <div className={styles["main"]}>
        {this.state.minimized ? (
          <div style={{ pointerEvents: "all", margin: "2vw" }}>
            {" "}
            <Button2
              style={{ padding: "10px", marginRight: "3%" }}
              onClick={() => {
                this.setState({ minimized: false });
              }}
            >
              {" "}
              <MdChat style={{ paddingRight: "5px" }} /> Chat{" "}
            </Button2>{" "}
          </div>
        ) : (
          <div className={styles["container-main"]}>
            <div className={styles["container-buttons"]}>{leftMenu}</div>
            {/* <div className={styles["container-submenu"]}>              
            </div> */}
            <div className={styles["container-content"]}>
              {
                chats
                // <ThreeOtherChats />
              }
            </div>
          </div>
        )}
      </div>
    ) : null;
  }

  /*{Object.keys(this.state.tabs).map(x=>(
                    <ThreeChatTab key={x} name={x}/>
                ))}
                <input onChange={(event)=>{console.log(event.target.value);}}></input>*/
}

const mapStateToProps = (state) => {
  return {
    tabs: state.tabs,
    messages: state.messages,
    character: state.auth.character,
  };
};

export default connect(mapStateToProps, {
  addTab,
  removeTab,
  addPublicMessage,
  addPrivateMessage,
  addUserInTab,
  removeUserInTab,
})(ThreeChat);
