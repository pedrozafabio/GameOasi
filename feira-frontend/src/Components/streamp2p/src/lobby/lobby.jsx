import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const Container = styled.section`
  max-width: 900px;
  display: flex;
  height: 100vh;
  padding: 0 20px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  @media (max-width: 768px) {
    height: auto;
    margin: 30px 0;
  }
`;
const Input = styled.input`
  box-sizing: unset;
  background-color: #686868;
  appearance: none;
  border: 1px solid #1a1a1a;
  padding: 3px 5px;
  border-radius: 5px;
  margin: 0;
  width: 150px;
`;
const Label = styled.label`
`;

const Error = styled.label`
  color: red;
`;

const Button = styled.button`
  border-radius: 5px;
  margin: 0;
  background-color: #686868;
  padding: 4px 7px;
  margin-top: 20px;
  width: 100%;
`;
const Group = styled.div`
  width: 300px;
  padding: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
`;

const Lobby = ({
  onSubmit, name, setName,
  room, setRoom, error,
}) => {
  return (
    <Container>
      <Group>
        <Label>Nome</Label>
        <Input value={name} onChange={({ target }) => setName(target.value)} />
      </Group>
      <Group>
        <Label>sala ID</Label>
        <Input value={room} onChange={({ target }) => setRoom(target.value)} />
      </Group>
      <Error>{error}</Error>
      <Button onClick={() => onSubmit({ name, room })}>
        Entrar
      </Button>
    </Container>
  )
}

export default Lobby;
