import React from 'react';
import Peer from '../../src/peer/peer';

const PeerPage = (props) => {

  return (
    <div>
      <button onClick={()=>{props.goBack();}}> back</button>
      <Peer />
    </div>
  )
}

export default PeerPage;
