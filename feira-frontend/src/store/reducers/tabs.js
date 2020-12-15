import {ADD_TAB, REMOVE_TAB} from '../actions/tabs';

const initialState = {
    publicTabs : {},
    privateTabs : {}
}

export const tabsReducer = (state = initialState, action) =>{
    switch(action.type){
        case ADD_TAB :
            if(action.isPublic){
                state.publicTabs[action.channel.name] = action.channel;
            }else{
                state.privateTabs[action.channel.name] = action.channel;
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
        default :
            return state;
    }
}