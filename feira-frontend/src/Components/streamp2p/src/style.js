import styled from "styled-components";

export const Button = styled.button`
  background-color: rgba(104, 104, 104, .8);
  font-size: 2em;
  border: none;
  padding: 5px 50px;
  margin: 20px;
  width: 200px;
  height: 200px;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: rgb(104, 104, 104);
  }
`;

export const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ID = styled.h1`
  font-size: .9em;
  color: #686868;
  margin: 0;
  padding: 5px;
`;