import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux';
import styles from "./OtherChatsCorpo.module.css";
import modules from "./ThreeMainChat.module.css";

function OtherChatsCorpo(props) {
    const tabs = useSelector(state => state.tabs);

    const [inCreateChat, setInCreateChat] = useState(false);
    const [username, setUsername] = useState('');

    // console.log(tabs);

    // let SalaAtual = {};
    // let Grupos = [];

    // Object.keys(tabs.publicTabs).forEach(tabName=>{
    //     console.log(tabName);
    //     if(tabName.startsWith("Sala@")){
    //         SalaAtual = tabs.publicTabs[tabName];
    //     }else if(tabName.startsWith("Group@")){
    //         Grupos.push(tabs.publicTabs[tabName]);
    //     }
    // });

    // console.log({SalaAtual});
    // console.log({Grupos});

    console.log(tabs);

    let content = inCreateChat ? (
        <div style={{height:"100%", width:"100%", display : "flex", flexDirection : "column", backgroundColor:"#1A1426"}}>
            <button className={modules["button"]} style={{height:"10%"}} onClick={()=>{setInCreateChat(false); setUsername('')}}>
                <div style = {{color:"white"}}>
                Voltar
                </div>
            </button>
            <div>
                Insira o nome do amigue que deseja conversar:
            </div>
            <input type="text" value={username} onChange={(event)=>{setUsername(event.target.value)}}></input>
            <button className={modules["button"]} style={{height:"10%"}} onClick={()=>{
                setInCreateChat(false);
            
                if(username.length > 0)
                //create private chat
                window.ThreeChat.SendPrivateMessage(`${username}`, '');
                
                setUsername('');
            }}>
                <div style = {{color:"white"}}>
                Criar
                </div>
            </button>
            <div style = {{color:"white"}}>
                Ou escolha um nome da sua lista de amigues:
            </div>
            {props.friends.map(x =>{
                return <div key={x.username} style= {{color: "white"}} onClick={()=>{
                    setUsername(x.username);
                }}>
                    {x.username}
                </div>
            })}
        </div>
    ) : (
    <div style={{height:"100%", width:"100%", display : "flex", flexDirection : "row", backgroundColor:"#1A1426"}}>
        <div style = {{height : "100%", width : "100%"}}>
            <button className={modules["button"]} style={{height:"10%"}} onClick={()=>{setInCreateChat(true)}}>
                <div style = {{color:"white"}}>
                    Criar um chat privado
                </div>
            </button>
            <div className={styles.container}>
            {
                Object.keys(tabs.privateTabs).map(x=>{
                    return (
                        <div key={x} onClick={()=>{
                            props.setCurrentChat(tabs.privateTabs[x]);
                            props.setPublic(false);
                        }}  className={styles["container-name"]}>
                            <div className={styles["name"]}>{x}</div>
                        </div>
                    );
                })
            }
            </div>
        </div>
    </div>);

    return (
        <div style={{height:"100%", width:"100%", display : "flex", flexDirection : "column", backgroundColor:"#1A1426"}}>
            {content}
        </div>
    );
}

OtherChatsCorpo.propTypes = {
    setCurrentChat : PropTypes.func,
    setPublic : PropTypes.func
}

export default OtherChatsCorpo

