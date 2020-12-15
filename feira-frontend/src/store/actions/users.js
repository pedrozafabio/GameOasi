
export const ADD_USER_IN_TAB = "ADD_USER_IN_TAB";
export const REMOVE_USER_IN_TAB = "REMOVE_USER_IN_TAB";

export const addUserInTab = (channel, isPublic, name) =>{
    return {
        type : ADD_USER_IN_TAB,
        channel : channel,
        user : name,
        isPublic : isPublic
    }
}

export const removeUserInTab = (channel, isPublic, name) =>{
    return {
        type : REMOVE_USER_IN_TAB,
        channel : channel,
        user : name,
        isPublic : isPublic
    }
}