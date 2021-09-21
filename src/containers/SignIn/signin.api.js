import request from 'utils/request';
import {WEB_SITE_DOMAIN} from 'utils/constants'

export function postSignInAPI(payload) {
  return request.post(`${WEB_SITE_DOMAIN}/api/v1/api-token-auth/`, payload);
}
