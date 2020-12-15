// import React, { useState } from 'react'
// import { useSelector } from 'react-redux';
// import Messages from './Messages'
// import modules from './ThreeMainChat.module.css'

// //props sendMessageCallback, holds Photon message functions
// export default function ThreeOtherChat(props) { 
//     const [message, setmessage] = useState('');

//     console.log(props.tab);
//     const messages = useSelector(state=>{
//         console.log({state});
//         return (props.public ? state.messages.publicMessages[props.tab.name] : state.messages.privateMessages[props.tab.name])}
//         );
//     console.log({messages});
//     return (
//         <div className={modules.MainBody}>
//             {/* <div style={{flex:2, overflowY: "auto"}}> */}
//             <div onClick={()=>{
//                 props.goBack();
//             }}>
//                 Voltar
//             </div>
//             <Messages messages={messages}></Messages>
//             {/* </div> */}
//             <div style={{display:"flex",flexDirection:"row"}}>
//                 {/* {this.state.currentChat === 'Main' ? <ThreeMainChat ></ThreeMainChat> : null} */}
//                 <input placeholder="Type your message" onChange={event=>{setmessage(event.target.value)}} type="text"></input>
//                 <button onClick={()=>{
//                     props.tab.sendMessage(message);
//                 }}>Send</button>
//             </div>
//         </div>
//     )
// }


/// Add go back!!

import React, { useState } from "react";
import Messages from "./Messages";
import modules from "./ThreeMainChat.module.css";
import { MdSend, MdArrowBack } from "react-icons/md";
import { useSelector } from "react-redux";

//props sendMessageCallback, holds Photon message functions
export default function ThreePrivateChat(props) {
  const [message, setmessage] = useState("");

  const messages = useSelector(state=>{
    console.log({state});
    return (props.public ? state.messages.publicMessages[props.tab.name] : state.messages.privateMessages[props.tab.name])}
    );

  return (
    <div className={modules["container-main"]}>
      <div style={{width:"100%", display:"flex", flexDirection:"row", justifyContent:"space-between"}}>
        <div>
          {props.tab.name}
        </div>
        <button className={modules["button"]} onClick={()=>{props.goBack();}}>
          <MdArrowBack></MdArrowBack>
        </button>
      </div>
      <div className={modules["container-messages"]}>
        <Messages username={props.username} messages={messages}></Messages>
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

                if(message !== ""){
                    props.tab.sendMessage(message);
                    setmessage("");
                }
           }}>
          <input
          className={modules["input"]}
            placeholder="Digite aqui sua mensagem"
            onChange={(event) => {
              setmessage(event.target.value);
            }}
            value={message}
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

