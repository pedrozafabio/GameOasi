import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styles from "./OtherChatsCorpo.module.css";
import modules from "./ThreeMainChat.module.css";

import ThreeGroupChat from '../Components/ThreeGroupChat'

import instance from '../axios/axios-ClientAPI';

import {addGroup, removeGroup} from '../store/actions/groups'

import { v4 as uuidv4 } from 'uuid';

export default function GroupChat(props) {
    const [onCreateGroup, setOnCreateGroup] = useState(false);
    const [friends, setFriends] = useState([]);
    const [groupName, setGroupName] = useState('');
    const [selectedFriends, setSelectedFriends] = useState({});
    const [onAddFriend, setOnaddFriend] = useState(false);
    const [friendName, setFriendName] = useState('');
    const [currentChat, setCurrentChat] = useState({});
    const [onPublicChat, setOnPublicChat] = useState(false);
    const tabs = useSelector(state => state.tabs);
    let dispatch = useDispatch();

    const fetchFriends = async ()=>{
        instance.post("api/v1/characters/ida", {headers:{Authorization : `Bearer ${localStorage.getItem('token')}`}}).then(response =>{
            console.log(response);
            if(response.status >= 200 && response.status < 300){
                setFriends(response.data.data.friends);
            }
        }).catch(error =>{

        });
    }

    useEffect(() => {
        fetchFriends();
        return;
    }, [setOnCreateGroup]);

    let content = onCreateGroup ? (<div style={{height:"100%", width:"100%", display : "flex", flexDirection : "column", backgroundColor:"#1A1426"}}>
        <button className={modules["button"]} style={{height:"10%"}} onClick={()=>{
            setOnCreateGroup(false);
            setGroupName('');
        }}>
            <div style = {{color:"white"}}>
                Voltar
            </div>
        </button>
        <input type="text" value={groupName} onChange={(event)=>{setGroupName(event.target.value)}}></input>
        <button className={modules["button"]} style={{height:"10%"}} onClick={()=>{
            setOnCreateGroup(false);
            if(Object.keys(selectedFriends).length > 0 && groupName.length > 0){
                //create group
                Object.keys(selectedFriends).forEach(element => {
                    console.log("sending message to "+element);
                    let group = `Group@${groupName}#${uuidv4()}`;
                    window.ThreeChat.SendPrivateMessage(element, `/*/JoinGroup ${group}`);
                    dispatch(addGroup(`${group}`));
                });
            }
            setGroupName('');
        }}>
            <div style = {{color:"white"}}>
                Criar
            </div>
        </button>
        <div>
            Selecione os usuários que deseja adicionar ao grupo:
        </div>
            {
                friends.map(x=>{
                    return (
                    <div key={x.username} className={styles["container-name"]} >
                        <input type="checkbox" value={selectedFriends[x.username]} onChange={(event)=>{
                            let newState = {...selectedFriends};
                            newState[x.username] = event.target.checked;
                            setSelectedFriends(newState);
                        }} />
                        {x.username}
                    </div>)
                })
            }
        
    </div>) : onAddFriend ? (
        <div style={{height:"100%", width:"100%", display : "flex", flexDirection : "column", backgroundColor:"#1A1426"}}>
            <button className={modules["button"]} style={{height:"10%"}} onClick={()=>{setOnaddFriend(false);}}>
                <div style = {{color:"white"}}>
                    Voltar
                </div>
            </button>
            <input type="text" value={friendName} onChange={(event)=>{setFriendName(event.target.value)}}></input>
            <button className={modules["button"]} style={{height:"10%"}} onClick={()=>{
                setOnaddFriend(false);
                if(friendName.length > 0){
                    window.ThreeChat.SendPrivateMessage(friendName, `/*/AddFriend`);
                }
            }}>
                <div style = {{color:"white"}}>
                    Adicionar
                </div>
            </button>
        </div>
    ) : (
        <div style={{height:"100%", width:"100%", display : "flex", flexDirection : "column", backgroundColor:"#1A1426"}}>
            <button className={modules["button"]} style={{height:"10%"}} onClick={()=>{setOnCreateGroup(true)}}>
                <div style = {{color:"white"}}>
                    Criar um grupo
                </div>
            </button>
            <button className={modules["button"]} style={{height:"10%"}} onClick={()=>{setOnaddFriend(true)}}>
                <div style = {{color:"white"}}>
                    Adicionar um amigo
                </div>
            </button>
            {
                Object.keys(tabs.publicTabs).filter(x=>x.startsWith("Group@")).map(tab =>{
                    return (<div key={tab} onClick={()=>{
                        setCurrentChat(tabs.publicTabs[tab]);
                        setOnPublicChat(true);
                    }}  className={styles["container-name"]}>
                        <div className={styles["name"]}>{tab.split("Group@")[1].split("#")[0]}</div>
                    </div>);
                })
            }
        </div>);

        content = Object.keys(currentChat).length > 0 ? <ThreeGroupChat
            tab={currentChat} 
            goBack={()=>{setCurrentChat({})}} 
            public={onPublicChat} 
            exitChat={()=>{
                window.ThreeChat.ChatClient.Unsubscribe(
                    [
                        currentChat.name
                    ]
                );
                setCurrentChat({});
        }}></ThreeGroupChat> : content;

    return (
        <div style={{height:"100%", width:"100%", display : "flex", flexDirection : "column", backgroundColor:"#1A1426"}}>
            {content}
        </div>
    )
}