import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { tabsReducer } from "./store/reducers/tabs";
import { messagesReducer } from "./store/reducers/messages";
import { groupsReducer } from "./store/reducers/groups";
import { usersReducer } from "./store/reducers/users";
import { CharacterReducer } from "./store/reducers/characters";
import { applyMiddleware, combineReducers, createStore } from "redux";
import AuthReducer from "./store/reducers/auth";
import { Provider } from "react-redux";
import ReduxThunk from "redux-thunk";

const rootReducer = combineReducers({
  tabs: tabsReducer,
  messages: messagesReducer,
  groups: groupsReducer,
  users: usersReducer,
  characters: CharacterReducer,
  auth: AuthReducer,
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
      
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
