// import { GPU } from 'gpu.js';
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

// const kernel = new GPU().createKernel(function(v) {
//   return v[this.thread.y][this.thread.x];
// }, {
//   output: [512, 512]
// });

export const Img = styled.img`
  height: 250px;
  width: 400px;
`

export default ({
  id,
  src,
}) => {
  return (
    <canvas
      id={id}
    />
  )
}
