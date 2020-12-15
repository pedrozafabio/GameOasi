import React, { useState } from 'react'
import ThreePrivateChat from './ThreePrivateChat'
import styles from "./ThreeChat.module.css";
import modules from './ThreeChat.module.css'
import { useSelector } from 'react-redux';
import ThreeChatCreateGroup from './ThreeChatCreateGroup';
import ThreeShowChats from './ThreeShowChats';
import OtherChatsCorpo from './OtherChatsCorpo';
import { useEffect } from 'react';
import instance from '../axios/axios-ClientAPI'

export default function ThreeOtherChats(props) {
    const [currentChat, setCurrentChat] = useState({});
    const [onCreateGroup, setOnCreateGroup] = useState(false);
    const [onPublicChat, setOnPublicChat] = useState(false);
    const [onGroup, setOnGroup] = useState(false);
    const [friends, setFriends] = useState([]);

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

    let body;

    if (Object.keys(currentChat).length > 0){
        body = <ThreePrivateChat tab={currentChat} goBack={()=>{setCurrentChat({})}} public={onPublicChat}></ThreePrivateChat>
    }else if(!onGroup){
        body = <OtherChatsCorpo setCurrentChat={setCurrentChat.bind(this)} setPublic={setOnPublicChat.bind(this)} friends={friends} />
    }else{
        body = <ThreeChatCreateGroup onBack={()=>{setOnCreateGroup(false)}}></ThreeChatCreateGroup>

    }
    

    return (
        <div className={styles["container-content"]} style={{height:"100%"}}>
            {body}
        </div>
    )
}
