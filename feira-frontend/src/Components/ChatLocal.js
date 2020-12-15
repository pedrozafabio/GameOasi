import React, { useEffect, useState } from 'react'
import ThreeOtherChat from './ThreeOtherChat'

import modules from './ThreeChat.module.css'
import { useSelector } from 'react-redux';
import ThreeChatCreateGroup from './ThreeChatCreateGroup';
import ThreeShowChats from './ThreeShowChats';
import OtherChatsCorpo from './OtherChatsCorpo';

export default function ChatLocal(props) {
    const [currentChat, setCurrentChat] = useState({});
    const [onPublicChat, setOnPublicChat] = useState(false);

    const tabs = useSelector(state => state.tabs);
    const character = useSelector(state => state.auth.character);

    let SalaAtual = {};
    let Grupos = [];

    Object.keys(tabs.publicTabs).forEach(tabName=>{
        console.log(tabName);
        if(tabName.startsWith("Sala@")){
            SalaAtual = tabs.publicTabs[tabName];
        }else if(tabName.startsWith("Group@")){
            Grupos.push(tabs.publicTabs[tabName]);
        }
    });

    useEffect( () => {
        setCurrentChat(SalaAtual);
        setOnPublicChat(true);
    }, [tabs]);

    return ( <ThreeOtherChat username={character.username} tab={currentChat} goBack={()=>{setCurrentChat({})}} public={onPublicChat}/>)
}
