//agradece Isaque, vlw Isaque

import Peer from 'simple-peer';
import socketIOClient from "socket.io-client";

function addPeer(incomingSignal, callerID, stream, socket) {
  console.log('incomingSignal:', incomingSignal)
  console.log('=> addPeer:')
  const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
  })

  peer.on("signal", signal => {
      socket.emit("room/signal-back", { signal, callerID })
  })

  peer.signal(incomingSignal);

  return peer;
}

const createPeer = (userToSignal, callerID, stream, socket) => {
  console.log('=> createPeer:')
  const peer = new Peer({
    initiator: true,
    trickle: false,
    stream,
  });
  peer.on("signal", signal => {
    socket.emit("room/signal", { userToSignal, callerID, signal })
  })
  return peer;
}


const updateRoom = ({ users, peersRef, setPeers, socket, stream }) => {
  console.log('=> updateRoom');
  const peers = [];
  console.log('users:', users)
  users.forEach(user => {
      const peer = createPeer(user.socket_id, socket.id, stream, socket);
      peersRef.current.push({
          peerID: user.socket_id,
          peer,
      })
      peers.push(peer);
  })
  setPeers(peers);
}

const userJoined = ({ peers, payload, stream, peersRef, setPeers, socket }) => {
  console.log('=> userJoined ');
  console.log('peers:', peers);
  const peer = addPeer(payload.signal, payload.callerID, stream, socket);
  peersRef.current.push({
    peerID: payload.callerID,
    peer,
  });
  
  setPeers([...peers, peer]);
};

const answerBack = ({ payload, peersRef }) => {
  console.log('=> answerBack ');
  const item = peersRef.current.find(p => p.peerID === payload.id);
  console.log('item:', item);
  item.peer.signal(payload.signal);
};

export const joinStream = async ({ setId, peers, setMyStream, peersRef, setPeers }) => {
  console.log('=> joinStream ');
  const socket = await socketIOClient('http://192.168.0.19:8080', {transports: ['websocket']});
  
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: {
      width: { min: 1024*0.5, ideal: 1280, max: 1920 },
      height: { min: 576*0.5, ideal: 720, max: 1080 }
    }
  });
  
  socket.emit('room/set-visitant', { stream_id: stream.id });
  
  console.log('socket:', socket.id)
  setId(socket.id);
  setMyStream(stream)
  
  socket.on('room/update', (users) => updateRoom({ users, peersRef, setPeers, socket, stream }))
  socket.on('room/user-joined', (payload) => userJoined({ payload, stream, peersRef, setPeers, socket, peers }));
  socket.on('room/signal-answer-back', (payload) => answerBack({ payload, stream, peersRef, setPeers, socket }));
  
  // socket.on('BackAnswer', () => console.log('BackAnswer'))
  // socket.on('SessionActive', () => console.log('SessionActive'))
  // socket.on('Disconnect', () => console.log('Disconnect'))
  // socket.on('close-con', (data) => console.log('AHHHHHHHHH', data))
}
  



  // const startPeer = (init, stream, setStreamers, streamers) => {
  //   var peer = new Peer({ initiator: init, stream, trickle: false });
  //   const videoContainer = document.getElementById('video-container');
  //   const video = document.createElement('video');
  //   video.classList.add('videozin');
  //   video.autoplay = true;
  //   video.controls = true;
  //   peer.on('stream', (stream) => {
  //     video.srcObject = stream;
  //     video.id = stream.id;
  //     console.log('video:', [video]);
  //     videoContainer.appendChild(video);
  //     setStreamers([...streamers, stream])
  //   });
  //   return peer;
  // }
  
  
  // const conectPeer = (init, stream, socket, setStreamers, streamers) => {
  //   console.log('makePeer:')
  //   const peer = startPeer(init, stream);
  //   peer.on('signal', function (data) {
  //     console.log('ON - signal make peer:');
  //     socket.emit('Offer', data)
  //   });
  // }
  
  // const frontAnswer = (offer, stream, socket, setStreamers, streamers) => {
  //   let peer = startPeer(false, stream, setStreamers, streamers)
  //   peer.on('signal', (data) => {
  //       socket.emit('Answer', data)
  //   })
  //   peer.signal(offer)
  // }