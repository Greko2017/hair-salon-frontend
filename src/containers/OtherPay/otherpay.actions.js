import axios from 'axios';
import { API_BASE } from '../../env';
import { message } from 'antd';
import {
  INITIATE_OTHER_PAYS_FAILURE,
  INITIATE_OTHER_PAYS_REQUEST,
  GET_OTHER_PAYS_BY_PARENT_ID_SUCCESS,
  HANDLE_OTHER_PAYS_MODAL_SHOW,
  HANDLE_OTHER_PAYS_MODAL_CANCEL,
  SET_OTHER_PAYS_MODAL_ITEM,
  OTHER_PAYS_EDIT_EDITING_KEY,
  EDIT_OTHER_PAYS_SUCCESS,
  DELETE_OTHER_PAYS_SUCCESS,
  POST_OTHER_PAYS_SUCCESS,
} from './otherpay.constants';
import { getPayrollById } from 'containers/Payslip/payroll.actions';

const key = 'updatable';
// other_pays Actions Creator
export const initiateOtherPaysRequest = value => {
  message.loading({ content: 'Initial request...', key });
  return {
    type: INITIATE_OTHER_PAYS_REQUEST,
    payload: value,
  };
};
export const initiateOtherPaysFailure = error => {
  message.error({ content: 'Error!', key, duration: 2 });
  return {
    type: INITIATE_OTHER_PAYS_FAILURE,
    payload: error,
  };
};

// other_pays Actions Creator
export const getOtherPaysByParentIdSuccess = other_pays => {
  message.success({ content: 'OtherPays fetched successfully!', key, duration: 2 });
  return {
    type: GET_OTHER_PAYS_BY_PARENT_ID_SUCCESS,
    payload: other_pays,
  };
};

export const getOtherPaysByParentId = parent_id => {
  return async dispatch => {
    dispatch(initiateOtherPaysRequest);
    let stored_token = localStorage.getItem('token');
    let token = `Token ${stored_token}`;
    axios.defaults.headers.common['Authorization'] = token;
    try {
      let res = await axios.get(`${API_BASE}/api/other_pays_by_parent_id/?parent_id=${parent_id}`);
      let other_pays = await res.data;
      // console.log('in getOtherPaysByParentId :>> ', other_pays);
      dispatch(getOtherPaysByParentIdSuccess(other_pays));
      return await other_pays;
    } catch (error) {
      console.error('in getOtherPaysByParentId :>> ', error.message);
      dispatch(initiateOtherPaysFailure(error.message));
    }
  };
};

export const otherPaysEditEditingKey = value => {
  return {
    type: OTHER_PAYS_EDIT_EDITING_KEY,
    payload: value,
  };
};

// editOtherPaysSuccess
export const editOtherPaysSuccess = other_pays => {
  console.log('---- editOtherPaysSuccess other_pays', other_pays);
  message.success({ content: 'Service Line edited successfully!', key, duration: 2 });
  return {
    type: EDIT_OTHER_PAYS_SUCCESS,
    payload: other_pays,
  };
};

export const editOtherPays = other_pays => {
  let params = {
    id: other_pays.id,
    parent: other_pays.parent,
    name: other_pays.name,
    amount: other_pays.amount,
    description: other_pays.description,
  };

  let url = `${API_BASE}/api/payroll_other_pay/${params.id}/`;
  console.log('---- editOtherPays params', params, other_pays);
  return dispatch => {
    dispatch(initiateOtherPaysRequest(params));
    let stored_token = localStorage.getItem('token');
    let token = `Token ${stored_token}`;
    axios.defaults.headers.common['Authorization'] = token;
    axios
      .put(url, params)
      .then(response => {
        const other_pays = response.data;
        console.log('---- editOtherPays other_pays', other_pays);
        dispatch(editOtherPaysSuccess(other_pays));
      })
      .catch(error => {
        console.error('---- editOtherPays error', error);
        const errorMsg = error.message;
        dispatch(initiateOtherPaysFailure(errorMsg));
      })
      .finally(() => dispatch(getPayrollById(params.parent)));
  };
};

export const deleteOtherPaysSuccess = response => {
  // console.log('in deleteOtherPaysSuccess other_pays', response);
  message.success({ content: 'deleted successfully!', key, duration: 3 });
  return {
    type: DELETE_OTHER_PAYS_SUCCESS,
    payload: response,
  };
};

export const deleteOtherPays = other_pay => {
  console.log('---- deleteOtherPays', other_pay);

  let params = {
    id: other_pay.id,
    parent: other_pay.parent.id,
  };
  let url = `${API_BASE}/api/payroll_other_pay/${params.id}/`;

  return dispatch => {
    dispatch(initiateOtherPaysRequest(other_pay.id));
    let stored_token = localStorage.getItem('token');
    let token = `Token ${stored_token}`;
    axios.defaults.headers.common['Authorization'] = token;
    console.log('---- deleteOtherPays params', params, 'Token ', token, 'url ', url);
    axios
      .delete(url, params)
      .then(response => {
        // console.log('---- deleteOtherPays other_pays', response);
        dispatch(deleteOtherPaysSuccess(other_pay.id));
      })
      .catch(error => {
        console.error('---- deleteOtherPays error', error);
        const errorMsg = error.message;
        dispatch(initiateOtherPaysFailure(errorMsg));
      })
      .finally(() => dispatch(getPayrollById(params.parent)));
  };
};

// Post OtherPays
export const postOtherPaysSuccess = other_pays => {
  return {
    type: POST_OTHER_PAYS_SUCCESS,
    payload: other_pays,
  };
};

// fetch OtherPays
export const postOtherPays = other_pays => {
  let params = {
    parent: other_pays.parent,
    name: other_pays.name,
    description: other_pays.description,
    amount: other_pays.amount,
  };
  return dispatch => {
    dispatch(initiateOtherPaysRequest);
    let stored_token = localStorage.getItem('token');
    let token = `Token ${stored_token}`;
    axios.defaults.headers.common['Authorization'] = token;
    axios.defaults.headers.common['Content-Type'] = 'application/json';
    axios.defaults.headers.common['accept'] = 'application/json';
    console.log('postOtherPays params :>> ', params);
    axios
      .post(API_BASE + '/api/payroll_other_pay/', params)
      .then(response => {
        const other_pays = response.data;
        dispatch(postOtherPaysSuccess(other_pays));
        message.success({ content: 'OtherPays added successfully!', key, duration: 2 });
        return other_pays;
      })
      .catch(error => {
        console.error('---- postOtherPays error', error);
        const errorMsg = error.message;
        dispatch(initiateOtherPaysFailure(errorMsg));
      })
      .finally(() => {
        dispatch(handleOtherPaysModalCancelAction());
        dispatch(getPayrollById(params.parent));
      });
  };
};

// OtherPays modal
export const handleOtherPaysModalShowAction = payload => ({ type: HANDLE_OTHER_PAYS_MODAL_SHOW, payload });
export const handleOtherPaysModalCancelAction = payload => ({ type: HANDLE_OTHER_PAYS_MODAL_CANCEL, payload });
export const setOtherPaysModalItem = payload => ({ type: SET_OTHER_PAYS_MODAL_ITEM, payload });
