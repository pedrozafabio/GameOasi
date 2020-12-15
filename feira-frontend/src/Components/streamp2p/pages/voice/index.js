import dynamic from 'next/dynamic';
import Head from 'next/head';
import React from 'react';
import RoomList from '../../src/room-list/RoomList';
import Voice from '../../src/voice/voice';

const ClientRoom = dynamic(() => import('../../src/room/room'), { ssr: false });

const VoicePage = () => {

  return (
    <div>
      <Head>
        <link type="text/css" rel="stylesheet" href="https://source.zoom.us/1.8.1/css/bootstrap.css" />
        <link type="text/css" rel="stylesheet" href="https://source.zoom.us/1.8.1/css/react-select.css" />
        <script SameSite="Secure" src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
        <script SameSite="Secure" src="https://source.zoom.us/1.8.1/lib/vendor/react.min.js"></script>
        <script SameSite="Secure" src="https://source.zoom.us/1.8.1/lib/vendor/react-dom.min.js"></script>
        <script SameSite="Secure" src="https://source.zoom.us/1.8.1/lib/vendor/redux.min.js"></script>
        <script SameSite="Secure" src="https://source.zoom.us/1.8.1/lib/vendor/redux-thunk.min.js"></script>
        <script SameSite="Secure" src="https://source.zoom.us/1.8.1/lib/vendor/jquery.min.js"></script>
        <script SameSite="Secure" src="https://source.zoom.us/1.8.1/lib/vendor/lodash.min.js"></script>

        <script async src="https://source.zoom.us/zoom-meeting-1.8.1.min.js"></script>
      </Head>
      <ClientRoom />
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

export default VoicePage;
