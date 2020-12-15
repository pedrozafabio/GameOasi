import React, { Component, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import ThreeEntry from "./ThreeEntry";
import OtherDivs from "./OtherDivs";
import { connect, Provider, useDispatch } from "react-redux";
import { applyMiddleware, combineReducers, createStore } from "redux";
import ThreeChat from "./Components/ThreeChat";
import { tabsReducer } from "./store/reducers/tabs";
import { messagesReducer } from "./store/reducers/messages";
import { groupsReducer } from "./store/reducers/groups";
import { usersReducer } from "./store/reducers/users";
import { CharacterReducer } from "./store/reducers/characters";
import Invitation from "./Components/Invitation";
import EnterSpace from "./Components/EnterSpace";
import EditAvatar from "./Components/BuildAvatar/EditAvatar";
import HUD from "./Components/HUD/HUD";
import Stand from "./Components/Stand/Stand";
import { Modal } from "./Components/BuildAvatar/Modal";
import { BiWorld } from "react-icons/bi";
import ReduxThunk from "redux-thunk";
import AuthReducer from "./store/reducers/auth";
import { getMe } from "../src/store/actions/auth";
import Redirect from "./Components/Redirect/Redirect";
import qs from 'qs';
import Loading from "./Components/Loading";
import Hotkeys from "./Components/HUDHotkeys/HUD";

import RoomList from './Components/streamp2p/src/room-list/RoomList';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { StoreProvider, reducer, initialState } from './Components/streamp2p/store/Store';
import Countdown from "./Components/Countdown";

import ModalCamera from './Components/Camera/ModalCamera'

class App extends Component {
  constructor(props){
    super();
    this.state = {...initialState, ...{
      threeEntryComponent : <ThreeEntry/>,
      token : null,
      HUDvisible : false
    }}
  }
  

  componentDidMount() {
    // console.log(window.location.search);
    window.showToast = this.showToast.bind(this);

    let params = qs.parse(window.location.search, { ignoreQueryPrefix: true });
    // console.log(params);
    localStorage.setItem("token", params.t);

    let token = localStorage.getItem("token") ?? "NOTOKEN"
    this.props.getMe(token);

    this.setState({token : token});
  }

  hideHUD(){
    this.setState({HUDvisible: false})
  }

  streamDispatch(action) {
    this.setState((prevState) => reducer(prevState, action));
  }

  showHUD(){
    this.setState({HUDvisible: true})
  }

  showToast(str, type){

    switch(type){
      case "error":
        toast.error(str); break;
      case "success":
        toast.success(str); break;
      default:
        toast.info(str); break;

    }

  }

  render() {
    let game = null;

    if(!this.props.loading){
      if(this.props.character){
        game = <div className="App">
        <Invitation></Invitation>
        <EnterSpace></EnterSpace>
        <EditAvatar></EditAvatar>
        <Hotkeys></Hotkeys>
        {/* <Stand></Stand> */}
        <ThreeChat />
        <StoreProvider value={{
            state: this.state,
            dispatch: this.streamDispatch.bind(this),
          }}>
          { <RoomList /> }
        </StoreProvider>
        <HUD token={this.state.token} visible={this.state.HUDvisible}></HUD>
        <Loading onStart={this.hideHUD.bind(this)} onFinish={this.showHUD.bind(this)}/>
         <ToastContainer />
        
       {this.state.threeEntryComponent}
      </div>
      }
    }

    if(this.props.error){
      // game = <Redirect></Redirect>
    }

    return game;
  }
}

const mapStateToProps = state => {
  return {
      character: state.auth.character,
      loading : state.auth.loading,
      error : state.auth.error
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getMe: (token) => dispatch(getMe(token)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
