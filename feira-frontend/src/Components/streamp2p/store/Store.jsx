/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';

const Store = React.createContext();

export const initialState = {
  auth: {type : "peer"},
  socket: null,
  rooms: [],
  room: null,
};

export const reducer = (state, action) => {
  console.log(action);
  if (action.type === 'SET_ROOM')console.log('reducer -> action', action);
  switch (action.type) {
    case 'SET_AUTH':
      return { ...state, auth: action.data };
    case 'SET_ROOM':
      return { ...state, room: action.data };
    case 'SET_ALL_ROOMS':
      return { ...state, rooms: action.data };
    case 'SET_SOCKET':
      return { ...state, socket: action.socket };
    default:
      return state;
  }
};

export const StoreProvider = (props) => {
  const { children, value } = props;
  return <Store.Provider value={value}>{children}</Store.Provider>;
};

StoreProvider.propTypes = {
  children: PropTypes.node,
  value: PropTypes.object.isRequired,
};

StoreProvider.defaultProps = {
  children: [],
};

export default Store;
