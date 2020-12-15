import styled from 'styled-components';

export const VideoContainer = styled.div`
  height: 100vh;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  background-color: red;
  >.videozin {
    height: 200px;
    width: 350px;
  }
`;

export const VideoTag = styled.video`
  height: 200px;
  width: 350px;
  /* visibility: hidden; */
`;
export const CanvasTag = styled.canvas`
  height: 200px;
  width: 350px;
`;

export const Container = styled.section`
  width: 100%;
  height: 100vh;
  display: grid;
  grid-template-rows: 60px 1fr 60px;
`;
export const Header = styled.div`
  text-align: center;
  font-size: 2em;
  max-height: calc(100vh - 120px);
`;

export const Label = styled.label`
`;

export const Name = styled.label`
`;

export const Image = styled.img`
  height: 150px;
  width: 150px;
  display: block;
  left: 0;
  right: 0;
  margin: auto;
  position: relative;
  object-fit: cover;
  border-radius: 100%;
`;

export const Person = styled.div`
  width: 350px;
  height: 250px;
  display: inline-block;
  position: relative;
  background-color: 	#eeeeee;
  text-align: center;
  vertical-align: middle;
  padding: 10px 0 30px;
  border-radius: 15px;
  margin: 10px;
`;

export const Wrapper = styled.div`
`;

