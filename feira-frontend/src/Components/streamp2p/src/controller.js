import RecordRTC, { StereoAudioRecorder } from 'recordrtc';
import ss from "socket.io-stream";
import Peer from 'simple-peer';
import socketIOClient from "socket.io-client";
import { Video } from './style';

export const enterAtRoom = ({ socket, name, room, store }) => {
  socket.on('participants', (room) => {
    store.dispatch({
      type: 'SET_AUTH',
      data: {
        name, room,
      },
    });
    store.dispatch({
      type: 'SET_ROOM',
      data: room
    });
  });
  socket.emit('enter_room', {
    room_id: room,
    name: name,
  });
}

export const joinStream = async ({ setId, setMyStream, setSocket }) => {
  const socket = await socketIOClient('https://api-poc-feira.resystem.org', { transports: ['websocket'] });
  
  console.log('https://api-poc-feira.resystem.org:  ')
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: {
      width: 400,
      height: 250 
    }
  });
  
  setId(socket.id);
  setMyStream(stream);
  setSocket(socket);
}
  