import {GET_CHARACTER} from "../actions/characters";

const initialState = {
    character: [],
    ready: false
};

export const CharacterReducer = (state = initialState, action) => {
    switch(action.type) {
        case GET_CHARACTER:
            return {...state, character: action.character, ready: true};
        default:
            return state;
    }
}