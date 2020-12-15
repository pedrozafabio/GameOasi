import styled from "styled-components";

export const Container = styled.section`
  display: grid;
  background-color: #373737;
  grid-template-columns: 1fr 300px;
  justify-content: center;
  align-items: center;
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
  }
`;

export const RoomsList = styled.div`
  height: calc(100vh - 75px);
  padding: 10px;
  @media (max-width: 768px) {
    height: auto
  }
`;

export const Content = styled.div`
`;

export const Label = styled.label`
`;

export const RoomCard = styled.div`
  display: grid;
  background-color: rgba(104, 104, 104, .8);
  margin: 5px 0;
  padding: 20px;
  cursor: pointer;
  justify-content: space-between;
  align-items: center;
  display: flex;
  &:hover {
    background-color: rgba(104, 104, 104, 1);
  }
`;
export const Header = styled.div`
  background-color: #686868;
  margin: 5px 0;
  padding: 20px;
  justify-content: space-between;
  align-items: center;
  display: flex;
`;
