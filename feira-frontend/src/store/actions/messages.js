export const ADD_PUBLIC_MESSAGE = 'ADD_PUBLIC_MESSAGE'

export const ADD_PRIVATE_MESSAGE = 'ADD_PRIVATE_MESSAGE'

export const addPublicMessage = (message, channel) =>{
    return {
        type : ADD_PUBLIC_MESSAGE,
        message : message,
        channel : channel
    };
};

export const addPrivateMessage = (message, channel) =>{
    return {
        type : ADD_PRIVATE_MESSAGE,
        message : message,
        channel : channel
    };
};