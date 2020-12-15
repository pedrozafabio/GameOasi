/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { StoreProvider, reducer, initialState } from '../store/Store';

export default class MyApp extends App {
  constructor(props) {
    super(props);
    this.state = { ...initialState };
    this.dispatch = this.dispatch.bind(this);
  }

  dispatch(action) {
    this.setState((prevState) => reducer(prevState, action));
  }

  render() {
    const { Component, pageProps } = this.props;
    return (
      <StoreProvider value={{
        state: this.state,
        dispatch: this.dispatch,
      }}
      >
          <Component {...pageProps} />
      </StoreProvider>
    );
  }
}
