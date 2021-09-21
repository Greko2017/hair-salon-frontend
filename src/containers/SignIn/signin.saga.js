import { takeLatest, call, put, take, select } from 'redux-saga/effects';
import { push } from 'connected-react-router';

import { POST_SIGN_IN_REQUEST, AUTH_LOGOUT } from './signin.constants';
import { postSignInAPI } from './signin.api';
import { postSignInSuccess, postSignInFailure } from './signin.actions';
import { makeSelectEmail, makeSelectPassword } from './signin.selectors';

export function* postSignInSaga() {
  const email = yield select(makeSelectEmail());
  const password = yield select(makeSelectPassword());

  try {
    const res = yield call(postSignInAPI, {
      username:email,
      password:password
     });
     let token = res.data.access
    //  console.log(`res`, token)
    yield put(postSignInSuccess(token));
    yield put(push('/service'));
  } catch (error) {
    yield put(postSignInFailure(error));
  }
}

export default function* signInSaga() {
  yield takeLatest(POST_SIGN_IN_REQUEST, postSignInSaga);
}

export function* LogoutSaga(){
  // console.log('In logoutSaga :>> ');
  // yield call(push('/signin'))
}
export function* authLogoutSaga(){
  yield take(AUTH_LOGOUT, LogoutSaga);
}

