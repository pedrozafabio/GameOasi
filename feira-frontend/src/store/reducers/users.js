import {ADD_USER_IN_TAB, REMOVE_USER_IN_TAB} from '../actions/users'
import {ADD_TAB, REMOVE_TAB} from '../actions/tabs'


/*
    holds objects of type channel:{user:true}
*/
const initialState = {
    publicTabs : {},
    privateTabs : {}
}

export const usersReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_TAB :
            if(action.isPublic){
                state.publicTabs[action.channel.name] = {};
            }else{
                state.privateTabs[action.channel.name] = {};
            }
            return {...state}
        case REMOVE_TAB : 
            if(action.isPublic){
                delete state.publicTabs[action.channel.name];
            }else{
                delete state.privateTabs[action.channel.name];
            }
            console.log(action);
            return {...state}
        case ADD_USER_IN_TAB:
            if(action.isPublic){
                state.publicTabs[action.channel][action.user] = true;
            }else{
                state.privateTabs[action.channel][action.user] = true;
            }
            console.log(state);
            return {...state};
        case REMOVE_USER_IN_TAB:
            if(action.isPublic){
                delete state.publicTabs[action.channel][action.user];
            }else{
                delete state.privateTabs[action.channel][action.user];
            }
            return {...state};
        default:
            return state;
    }
}