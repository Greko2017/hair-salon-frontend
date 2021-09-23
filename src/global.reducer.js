import produce from 'immer';
import { POST_SIGN_IN_SUCCESS, AUTH_LOGOUT } from 'containers/SignIn/signin.constants';

const token = localStorage.getItem('token');
const userState = token && token.toString().length > 20 ? { token: token } : {};
export const initialState = {
  ...userState,
};

/* eslint-disable default-case, no-param-reassign */
const appReducer = (state = initialState, action) =>
  produce(state, draft => {
    let token_string = action && action.payload && action.payload.access ? action.payload.access.toString() : '';
    switch (action.type) {
      case POST_SIGN_IN_SUCCESS:
        // console.log(`token`, action.payload)
        localStorage.setItem('token', action.payload.access);
        if (token_string.length > 30) {
          draft.token = action.payload.access;
          draft.username = action.payload.username;
          state = {
            ...state,
            token: action.payload.access,
            username: action.payload.username,
          };
        }
        break;
      case AUTH_LOGOUT:
        if (token_string.length > 30) {
          state = {
            ...state,
            token: undefined,
          };
        }
        draft.token = undefined;
        localStorage.removeItem('token');
        localStorage.removeItem('expirationDate');
        break;
    }
  });

export default appReducer;
