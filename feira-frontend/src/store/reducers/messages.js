import {ADD_PRIVATE_MESSAGE, ADD_PUBLIC_MESSAGE} from '../actions/messages';


const initialState = {
    privateMessages : {},
    publicMessages : {},
}

export const messagesReducer = (state = initialState, action) =>{
    switch(action.type){
        case ADD_PUBLIC_MESSAGE :
            if(action.channel in state.publicMessages){
                state.publicMessages[action.channel].push(action.message);
            }else{
                state.publicMessages[action.channel] = [action.message];
            }

            return {...state};

        case ADD_PRIVATE_MESSAGE:
            if(action.channel in state.privateMessages){
                state.privateMessages[action.channel].push(action.message);
            }else{
                state.privateMessages[action.channel] = [action.message];
            }

            return {...state};
        default:
            return state;
    }
}

