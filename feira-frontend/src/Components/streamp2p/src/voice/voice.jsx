import React, { useState, useEffect, useRef, useContext } from 'react';
// import gpu from 'gpu.js';
import Store from '../../store/Store';
import { initStream } from './voice.controller';
import {
  Container, Header, Label, Image, Name,
  Person, Wrapper,
} from './voice.style';
import { useRouter } from 'next/router';

const getMultimedia = async ({ setStream }) => {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    // video: {
    //   width: { min: 1024, ideal: 1280, max: 1920 },
    //   height: { min: 576, ideal: 720, max: 1080 }
    // }
  });
  setStream(stream);
}

const Voice = ({
}) => {
  const store = useContext(Store);
  const router = useRouter();
  const [stream, setStream] = useState(null);
  useEffect(() => {
    if (!store.state.auth.type || !store.state.auth.name || !store.state.auth.room) {
      router.push('/');
      return;
    }
    getMultimedia({ setStream });
    initStream({ socket: store.state.socket, stream, store });
  }, []);
  return (
    <Container>
      <Header>
        <Label>{`sala: ${store.state.room ? store.state.room.room_id : ''}`}</Label>
      </Header>
      <Wrapper>
        {store.state.room ? (
          store.state.room.participants.map((p) => (
            <Person>
              <Image
                src={`https://robohash.org/${p.name.replace(/ /g, '')}`}
              />
              <Name>{p.name}</Name>
            </Person>
          ))
        ) : null}
      </Wrapper>
      <Label>{store.state.socket ? store.state.socket.id : ''}</Label>
    </Container>
  )
}

export default Voice;
