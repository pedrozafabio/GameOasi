import { BiCodeCurly } from "react-icons/bi";
import axios from "../../axios/axios-instance";
import {
  GET_ME_FAILED,
  GET_ME_START,
  GET_ME_SUCCESS,
  AUTH_LOGOUT,
  UPDATE_CHARACTER_START,
  UPDATE_CHARACTER_SUCCESS,
  UPDATE_CHARACTER_FAILED,
} from "../reducers/auth";

export const getMe = (token, restart = true) => {
    return dispatch => {
        if(restart)
          dispatch(getUserStart());
  
        // console.log(token);
        const config = {
            method: 'get',
            url : '/api/v1/characters/ida',
            withCredentials : true,
            headers: {Authorization: `Bearer ${token}`}
        }

  
        axios(config)
        .then(response => {                
                // console.log(response.headers); 
                // console.log(response.data);            
                dispatch(getUserSuccess(response.data.data));
                // dispatch(signupSuccess(response.data.token))
                // dispatch(actions.auth(obj.username, obj.password));
            })
            .catch(err => {
                // console.log(err.response.data.error);
                dispatch(getUserFailed("error"));
                // dispatch(signupFail(err.response.data.error));
            });
    }
  }

export const getUserStart = () => {
  return {
    type: GET_ME_START,
  };
};

export const getUserSuccess = (character) => {
  window.user = character;
  return {
    type: GET_ME_SUCCESS,
    character: character,
  };
};

export const getUserFailed = (error) => {
  return {
    type: GET_ME_FAILED,
    error: error,
  };
};

export const updateCharacter = (characterId, data, token) => {
  return (dispatch) => {
    dispatch(updateCharacterStart());
    // console.log(token);
    const config = {
      method: "put",
      url: "/api/v1/characters/" + characterId,
      withCredentials: true,
      data : data,      
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios(config)
      .then((response) => {
        dispatch(updateCharacterSuccess(response.data.data));
        window.changeScene({ Type: "Map" }, []);
        
        
      })
      .catch((err) => {
        dispatch(updateCharacterFailed("error"));
      });
    };
  };
  
  export const updateCharacterStart = () => {
    return {
      type: UPDATE_CHARACTER_START,
    };
  };
  
  export const updateCharacterSuccess = (character) => {
    window.user = character;
    window.SetPhotonOutfit(character);
    return {
    type: UPDATE_CHARACTER_SUCCESS,
    character: character,
  };
};

export const updateCharacterFailed = (error) => {
  return {
    type: UPDATE_CHARACTER_FAILED,
    error: error,
  };
};
