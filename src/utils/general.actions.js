import { SAVE_USER_DATA_GENERAL } from 'containers/SignIn/signin.constants';

export const saveUserData = payload => ({ type: SAVE_USER_DATA_GENERAL, payload });

export const CLEARSTORE = () => ({ type: 'CLEARSTORE' });
