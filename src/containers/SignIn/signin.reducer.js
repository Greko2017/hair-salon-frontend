import produce from 'immer';
import { ON_CHANGE_EMAIL, ON_CHANGE_PASSWORD, POST_SIGN_IN_SUCCESS } from './signin.constants';

export const initialState = {
  singInForm: {
    email: '',
    password: '',
  },
};

/* eslint-disable default-case, no-param-reassign */
const signInReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case ON_CHANGE_EMAIL:
        draft.singInForm.email = action.payload;
        draft.singInForm.username = action.payload;
        break;
      case POST_SIGN_IN_SUCCESS:
        draft.user = action.payload.user;
        draft.username = action.payload.username;
        break;
      case ON_CHANGE_PASSWORD:
        draft.singInForm.password = action.payload;
        break;
      default:
        return state;
    }
  });

export default signInReducer;
