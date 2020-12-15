import Head from 'next/head'
import React, { useContext, useEffect } from 'react';
import dynamic from "next/dynamic";
import { useRouter } from 'next/router'
import { Wrapper, Button } from '../src/style';
import styled from 'styled-components';
import Store from '../store/Store';


export const Main = styled.main`
  background-color: #373737;
  height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const goToRooms = ({ router, store, type }) => {
  store.dispatch({
    type: 'SET_AUTH',
    data: {
      type
    },
  });
  router.push('/rooms');
};
const goToPeerRooms = () => {

};


export default function Home() {
  const router = useRouter();
  const store = useContext(Store);
  return (
    <div className="container">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Main>
        <Wrapper>
          <Button onClick={() => goToRooms({ router, store, type: 'peer' })}>
            Peer to Peer
          </Button>
          <Button onClick={() => router.push('/voice')}>
            Zoom
          </Button>
          <Button onClick={() => window.open('https://us02web.zoom.us/j/2910003426?pwd=T3FycXhOZ0hQK3BnVTk3SDJHeGYvUT09', '_blank').focus()}>
            Zoom link
          </Button>
        </Wrapper>
      </Main>
      <style jsx global>{`
        html, body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
            background-color: #373737;
            padding: none;
            margin: 0;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  )
}
