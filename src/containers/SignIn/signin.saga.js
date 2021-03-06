import { takeLatest, call, put, take, select } from 'redux-saga/effects';
import { push } from 'connected-react-router';

import { POST_SIGN_IN_REQUEST, AUTH_LOGOUT } from './signin.constants';
import { postSignInAPI } from './signin.api';
import { postSignInSuccess, postSignInFailure } from './signin.actions';
import { makeSelectEmail, makeSelectPassword } from './signin.selectors';
import { CLEARSTORE, saveUserData } from 'utils/general.actions';

export function* postSignInSaga() {
  const email = yield select(makeSelectEmail());
  const password = yield select(makeSelectPassword());

  try {
    const res = yield call(postSignInAPI, {
      username: email,
      password: password,
    });
    let token = res.data.access;
    // console.log(`-- postSignInSaga res`, token);
    // console.log(`-- postSignInSagadata`, res.data);
    yield put(saveUserData(res.data));
    yield put(postSignInSuccess(res.data));
    yield put(push('/'));
  } catch (error) {
    yield put(postSignInFailure(error));
    // yield put(push('/signin'));
  }
}

export default function* signInSaga() {
  yield takeLatest(POST_SIGN_IN_REQUEST, postSignInSaga);
}

export function* LogoutSaga() {
  // console.log('In logoutSaga :>> ');
  // yield call(push('/signin'))

  localStorage.removeItem('token');
  localStorage.removeItem('expirationDate');
  localStorage.removeItem('userState');
}
export function* authLogoutSaga() {
  yield take(AUTH_LOGOUT, LogoutSaga);
}
