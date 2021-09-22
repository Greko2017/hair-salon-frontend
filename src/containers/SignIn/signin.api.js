import request from 'utils/request';
import { WEB_SITE_DOMAIN } from 'utils/constants';
import { API_BASE } from 'env';

export function postSignInAPI(payload) {
  return request.post(`${API_BASE}/api/v1/api-token-auth/`, payload);
}
