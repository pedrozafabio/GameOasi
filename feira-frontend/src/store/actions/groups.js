export const ADD_GROUP = "ADD_GROUP";
export const REMOVE_GROUP = "REMOVE_GROUP"

export const addGroup = (groupName) =>{
    return {
        type : ADD_GROUP,
        name : groupName
    }
}

export const removeGroup = (groupName) =>{
    return {
        type : REMOVE_GROUP,
        name : groupName
    }
}