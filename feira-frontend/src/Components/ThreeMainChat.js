import React, { useState } from "react";
import Messages from "./Messages";
import modules from "./ThreeMainChat.module.css";
import { MdSend } from "react-icons/md";

//props sendMessageCallback, holds Photon message functions
export default function ThreeMainChat(props) {
  const [messages, setmessages] = useState("");

  return (
    <div className={modules["container-main"]}>
      <div className={modules["container-messages"]}>
        <Messages username={props.username} messages={props.messages}></Messages>
      </div>

      <div className={modules["container-bottom"]}>
        {/* {this.state.currentChat === 'Main' ? <ThreeMainChat ></ThreeMainChat> : null} */}
        <div className={modules["container-emoji"]}>
            <div className={modules["reactions"]}>Reações</div>
           <div className={modules["emoji"]} onClick={() => {props.tab.sendMessage("😍");}}>😍</div>
           <div className={modules["emoji"]} onClick={() => {props.tab.sendMessage("😂");}}>😂</div>
           <div className={modules["emoji"]} onClick={() => {props.tab.sendMessage("😭");}}>😭</div>
           <div className={modules["emoji"]} onClick={() => {props.tab.sendMessage("👏");}}>👏</div>
           <div className={modules["emoji"]} onClick={() => {props.tab.sendMessage("💔");}}>💔</div>
           <div className={modules["emoji"]} onClick={() => {props.tab.sendMessage("❤️");}}>❤️</div>
        </div>

            <form className={modules["container-input"]} onSubmit={(e) => {
                e.preventDefault(); 

                if(messages !== ""){
                    props.tab.sendMessage(messages);
                    setmessages("");
                }
           }}>
          <input
          className={modules["input"]}
            placeholder="Digite aqui sua mensagem"
            onChange={(event) => {
              setmessages(event.target.value);
            }}
            value={messages}
            type="text"
          />

          <button className={modules["button"]} type="submit" >
            <MdSend style={{padding: '4px'}}></MdSend>
          </button>
          </form>
      </div>
    </div>
  );
}
