import React, { useState } from 'react'
import { useDispatch } from 'react-redux';

import {addGroup, removeGroup} from '../store/actions/groups'

export default function ThreeChatCreateGroup(props) {
    const [selectedFriends, setSelectedFriends] = useState({});
    const friends = ["Kappa", "Byte", "Aaaaaa", "123456", "41414141"];
    const [groupName, setGroupName] = useState('');

    let dispatch = useDispatch();

    const HandleChange = (event) =>{
        const name = event.target.name;
        const value = event.target.value;

        if(value){
            setSelectedFriends({...selectedFriends, ...{[name] : true}});
        }else{
            let nextSelectedFriends = {...selectedFriends};
            delete nextSelectedFriends[name];
            setSelectedFriends(nextSelectedFriends);
        }
    }

    console.log(selectedFriends);

    return (
        <div>
            <button onClick={()=>{if(props.onBack) props.onBack(false)}}>Voltar</button>
            <input type='text' onChange={(e)=>{setGroupName(e.target.value)}}></input>
            <button disabled={groupName.length === 0 && window.ThreeChat.SendPrivateMessage !== undefined} onClick={()=>{
                Object.keys(selectedFriends).forEach(element => {
                    console.log("sending message to "+element);
                    window.ThreeChat.SendPrivateMessage(element, `/*/JoinGroup Group@${groupName}`);
                    dispatch(addGroup(`Group@${groupName}`));
                });
            }}>Send</button>
            {friends.map((x,i)=>{
                return (
                    <div key={`${x}${i}`} style={{display:"flex", flexDirection: "row"}}>
                        <input type="checkbox" name={x} value={x} onChange={HandleChange}></input>
                        {x}
                    </div>
                );
            })}
        </div>
    )
}
