import socketIOClient from "socket.io-client";
import React, { useContext, useEffect, useState } from 'react';
import Store from '../../store/Store';
import Lobby from '../lobby/lobby';
import {
  Container, Content, RoomsList,
  RoomCard, Label, Header,
} from './roomList.style';
import { sortByParticipants } from '../utils/room.util';

import axios from 'axios';

import PeerPage from '../../pages/peer/index';

const roomEntry = ({ setError, name, room, state, dispatch }) => {
  console.log('roomEntry -> state', state);
  console.log(room);
  if (!name) {
    setError('Informe um nome');
    return;
  }
  if (!room) {
    setError('Informe uma sala');
    return;
  }
  state.socket.on('participants', (data) => dispatch({
    type: 'SET_ROOM',
    data,
  }));
  dispatch({
    type: 'SET_AUTH',
    data: {
      ...state.auth,
      name,
      room,
    },
  });
};

const getRooms = async (dispatch) => {
  const rooms = await fetch('https://stream-back.oasi.vc/get-rooms', {
    method: 'get'
  }).catch(error =>{
    console.log(error);
  });

  console.log('getRooms -> rooms', rooms);
  const response = await rooms.json();
  const sortedRooms = sortByParticipants({ roomList: response.rooms });
  console.log('getRooms -> response', sortedRooms);
  dispatch({
    type: 'SET_ALL_ROOMS',
    data: sortedRooms,
  });

}

const connectSocket = async ({ dispatch }) => {
  const socket = await socketIOClient('https://stream-back.oasi.vc', { transports: ['websocket'] });

  socket.on('updated_rooms', ((rooms) => {
  console.log('connectSocket -> rooms', rooms);
    dispatch({
      type: 'SET_ALL_ROOMS',
      data: rooms,
    });
  }))
  dispatch({
    type: 'SET_SOCKET',
    socket,
  });
}

const RoomList = () => {
  const { state, dispatch } = useContext(Store);
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [error, setError] = useState('');

  const [onRoom, setOnRoom] = useState(false);

  console.log(state);

  let EnterRoom = (name, roomName) =>{
    console.log(`${name} entering ${roomName}`);
    console.log(state);
    setName(name);
    setRoom(roomName);
    setOnRoom(true);
    roomEntry({setError, name, "room":roomName, dispatch, state});
  }

  let LeaveRoom = ()=>{
    setName('');
    setRoom('');
    setOnRoom(false);
    dispatch({
      type: 'SET_AUTH',
      data: {
        ...state.auth,
        name:'',
        room:'',
      },
    });
  }

  window.StreamObject = {};
  window.StreamObject.EnterRoom = EnterRoom.bind(this);

  window.StreamObject.LeaveRoom = LeaveRoom.bind(this);
  useEffect(() => {
    getRooms(dispatch)
    connectSocket({ dispatch });
  }, []);

  let component = ((!state.auth.room || state.auth.room === '' ) ? null : <PeerPage goBack={()=>{
    LeaveRoom();
  }}/>) ;

  return (
    <div style={{position:"sticky", zIndex:"300"}}>
      {
        component
      }
    </div>
  )
}

export default RoomList;