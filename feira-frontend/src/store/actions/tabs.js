export const ADD_TAB = "ADD_TAB";
export const REMOVE_TAB = "REMOVE_TAB";

export const addTab = (channel, isPublic)=>{
    return {
        type : ADD_TAB,
        channel : channel,
        isPublic : isPublic
    };
}

export const removeTab = (channel, isPublic) =>{
    return{
        type : REMOVE_TAB,
        channel : channel,
        isPublic : isPublic
    };
}