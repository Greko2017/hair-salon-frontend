import produce from 'immer';
import { POST_SIGN_IN_SUCCESS, AUTH_LOGOUT, SAVE_USER_DATA_GENERAL } from 'containers/SignIn/signin.constants';

const token = localStorage.getItem('token');
// const userState = token && token.toString().length > 20 ? { token: token, user: {}, username: '' } : {};
export const initialState = {
  user: loadFromLocalStorage()?.user || {},
  token: loadFromLocalStorage()?.access || undefined,
  username: loadFromLocalStorage()?.user.username || undefined,
};

/* eslint-disable default-case, no-param-reassign */
const appReducer = (state = initialState, action) =>
  produce(state, draft => {
    let token_string = action && action.payload && action.payload.access ? action.payload.access.toString() : '';
    switch (action.type) {
      case POST_SIGN_IN_SUCCESS:
        // console.log(`token`, action.payload)
        localStorage.setItem('token', action.payload.access);
        // if (token_string.length > 30) {
        draft.token = action.payload.access;
        draft.username = action.payload.username;
        draft.user = action.payload.user;
        // return {
        //   ...state,
        //   token: action.payload.access,
        //   username: action.payload.username,
        //   user: action.payload.user,
        // };
        // }
        break;
      case AUTH_LOGOUT:
        if (token_string.length > 30) {
          // return {
          //   ...state,
          //   token: undefined,
          // };
          draft.token = undefined;
        }
        // draft.token = undefined;
        localStorage.removeItem('token');
        localStorage.removeItem('expirationDate');
        localStorage.removeItem('userState');
      // break;
      default:
        return state;
    }
  });

export default appReducer;

const initGeneralReducerState = {
  user: loadFromLocalStorage()?.user || {},
  token: loadFromLocalStorage()?.token || {},
};
export const generaleReducer = (state = initGeneralReducerState, { type, payload }) => {
  switch (type) {
    case SAVE_USER_DATA_GENERAL:
      saveUserState(payload);
      return { ...state, user: payload.user, token: payload.token };

    default:
      return state;
  }
};

const saveUserState = state => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('userState', serializedState);
  } catch (err) {
    console.log('-- saveUserState err :>> ', err);
  }
};

function loadFromLocalStorage() {
  try {
    const serializedStore = window.localStorage.getItem('userState');
    if (serializedStore === null) return undefined;
    return JSON.parse(serializedStore);
  } catch (e) {
    console.log(e);
    return undefined;
  }
}

// https://stackoverflow.com/questions/46673204/react-redux-state-lost-after-refresh
// React-Redux state lost after refresh
