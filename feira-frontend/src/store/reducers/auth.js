
const initialState = {
  character : null,
  error : null,
  loading : false,
  loadingUpdate : false,
  errorUpdating : null
};

export const GET_ME_START = "GET_ME_START";
export const GET_ME_FAILED = "GET_ME_FAILED";
export const GET_ME_SUCCESS = "GET_ME_SUCCESS";
export const AUTH_LOGOUT = "AUTH_LOGOUT";

export const UPDATE_CHARACTER_START = "UPDATE_CHARACTER_START";
export const UPDATE_CHARACTER_SUCCESS = "UPDATE_CHARACTER_SUCCESS";
export const UPDATE_CHARACTER_FAILED = "UPDATE_CHARACTER_FAILED";


const reducer = (state = initialState, action) => {
  switch (action.type) {

    case AUTH_LOGOUT:
      return {
        ...state,
        character: null,
        error: null,
        loading: false,
      };

    case GET_ME_START:
      return {
        ...state,
        character: null,
        loading : true,
        error: null,
      };

    case GET_ME_FAILED:
      return {
        ...state,
        character: null,
        loading : false,
        error: action.error,
      };

    case GET_ME_SUCCESS:
      return {
        ...state,
        character: action.character,
        loading : false,
        error: null,
      };

      case UPDATE_CHARACTER_START:
        return {
          ...state,
          loadingUpdate: true,
          errorUpdating: null
        }
      case UPDATE_CHARACTER_SUCCESS:
        return {
          ...state,
          
          character: action.character,
          loadingUpdate: false,
          errorUpdating: null
        }
      case UPDATE_CHARACTER_FAILED:
        return{
          ...state,
          loadingUpdate: false,
          errorUpdating: action.error
        }

    default:
      return state;
  }
};

export default reducer;
