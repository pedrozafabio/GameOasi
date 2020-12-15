import React from 'react';
import RoomList from '../../src/room-list/RoomList';

export default function Rooms() {

  return (
    <div>
      <RoomList />
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
