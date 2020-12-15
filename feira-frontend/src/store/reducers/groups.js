import { bindActionCreators } from 'redux';
import {ADD_GROUP, REMOVE_GROUP} from '../actions/groups';


const initialState = {
    myGroups : {}
}

export const groupsReducer = (state = initialState, action) =>{
    switch(action.type){
        case ADD_GROUP:
            {
                let groups = {...state};
                groups[action.name] = true;
                return groups;
            }
        case REMOVE_GROUP:
            {
            let groups = {...state};
            delete groups[action.name];
            return groups;
            }
        default:
            return state;
    }
}

