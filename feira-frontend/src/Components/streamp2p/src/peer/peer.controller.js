import Peer from 'simple-peer';
// import socketIOClient from "socket.io-client";
// import { Video } from './style';

function addPeer(incomingSignal, callerID, stream, socket, store) {
  console.log('addPeer -> incomingSignal', incomingSignal);
  const { room } = store.state.auth;
  const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
  })

  peer.on("signal", signal => {
    console.log('addPeer -> emit - room/signal-back');
    store.state.socket.emit("room/signal-back", { signal, callerID, room })
  })

  peer.signal(incomingSignal);

  return peer;
}

const createPeer = (userToSignal, stream, socket, store) => {
  console.log('createPeer -> userToSignal', userToSignal);
  const { room } = store.state.auth;

  const peer = new Peer({
    initiator: true,
    trickle: false,
    stream,
  });
  peer.on("signal", signal => {
    console.log('createPeer -> room/signal',);
    store.state.socket.emit("room/signal", { userToSignal, callerID: socket.id, signal, room })
  })
  return peer;
}


const updateRoom = ({ payload, peersRef, setPeers, store, stream }) => {
  console.log('updateRoom -> store', store);
  console.log('updateRoom -> updateRoom');
  const peers = [];
  payload.participants.filter((p) => p.socket_id !== store.state.socket.id).forEach(user => {
    // if (store.state.room) {
    //   console.log('updateRoom -> store.state.room', store.state.room);
    //   const has = store.state.room.participants.find((p) => p.socket_id === user.socket_id);
    //   console.log('updateRoom -> has', has);
    //   if (has) {
    //     return;
    //   }
    // }
      const peer = createPeer(user.socket_id, stream, store.state.socket, store);
      peersRef.current.push({
          peerID: user.socket_id,
          peer,
      })
      peers.push({
        peerID: user.socket_id,
        peer,
    });
  })
  setPeers(peers);
}

const userJoined = ({ peers, payload, stream, peersRef, setPeers, store }) => {
  const hasPeer = peersRef.current.find(({ peerID }) => peerID === payload.callerID);
  if (hasPeer) return;
  const peer = addPeer(payload.signal, payload.callerID, stream, store.socket, store);
  peersRef.current.push({
    peerID: payload.callerID,
    peer,
  });
  
  setPeers([...peers, {
    peerID: payload.callerID,
    peer,
  }]);
};

const answerBack = ({ payload, peersRef }) => {
  const item = peersRef.current.find(p => p.peerID === payload.id);
  item.peer.signal(payload.signal);
};

export const joinStream = async ({ peers, stream, store, peersRef, setPeers }) => {
  const { room, name, type } = store.state.auth
  console.log('joinStream -> type', type);
  store.state.socket.emit('enter_room', { room_id: room, name, type });
  
  store.state.socket.on('participants', (payload) => updateRoom({ payload, peersRef, setPeers, store, stream }))
  store.state.socket.on('room/user-joined', (payload) => userJoined({ payload, stream, peersRef, store, setPeers, peers }));
  store.state.socket.on('room/signal-answer-back', (payload) => answerBack({ payload, stream, peersRef, setPeers }));
  
  // socket.on('BackAnswer', () => console.log('BackAnswer'))
  // socket.on('SessionActive', () => console.log('SessionActive'))
  // socket.on('Disconnect', () => console.log('Disconnect'))
  // socket.on('close-con', (data) => console.log('AHHHHHHHHH', data))
}