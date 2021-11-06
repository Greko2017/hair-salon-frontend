import axios from 'axios';
import { API_BASE } from '../../env';
import { message } from 'antd';
import {
  EDIT_PAYROLL_TO_APPROVE_SUCCESS,
  FETCH_PAYROLL_TO_APPROVE_SUCCESS,
  GET_PAYROLL_TO_APPROVE_BY_ID_SUCCESS,
  HANDLE_PAYROLL_TO_APPROVE_MODAL_CANCEL,
  HANDLE_PAYROLL_TO_APPROVE_MODAL_SHOW,
  INITIATE_PAYROLL_TO_APPROVE_FAILURE,
  INITIATE_PAYROLL_TO_APPROVE_REQUEST,
  POST_PAYROLL_TO_APPROVE_SUCCESS,
  SET_PAYROLL_TO_APPROVE_MODAL_ITEM,
  SET_PAYROLL_TO_APPROVE,
} from './payroll_to_approve.constants';

const key = 'updatable';
// payroll Actions Creator
export const initiatePayrollToApproveRequest = value => {
  message.loading({ content: 'Initial request...', key });
  return {
    type: INITIATE_PAYROLL_TO_APPROVE_REQUEST,
    payload: value,
  };
};
export const initiatePayrollToApproveFailure = error => {
  message.error({ content: 'Error!', key, duration: 2 });
  return {
    type: INITIATE_PAYROLL_TO_APPROVE_FAILURE,
    payload: error,
  };
};

// payroll Actions Creator
export const fetchPayrollToApproveSuccess = payrolls => {
  message.success({ content: 'PayrollToApprove fetched successfully!', key, duration: 2 });
  return {
    type: FETCH_PAYROLL_TO_APPROVE_SUCCESS,
    payload: payrolls,
  };
};

// fetch PayrollToApprove
export const fetchPayrollsToApprove = () => {
  // console.log('---- fetchPayrollsToApprove');
  return dispatch => {
    dispatch(initiatePayrollToApproveRequest);
    let stored_token = localStorage.getItem('token');
    let token = `Token ${stored_token}`;
    axios.defaults.headers.common['Authorization'] = token;
    axios
      .get(API_BASE + '/api/payroll_to_approve/')
      .then(response => {
        const payrolls = response.data;
        // console.log('---- fetchPayrollsToApprove payrolls', payrolls);
        dispatch(fetchPayrollToApproveSuccess(payrolls));
      })
      .catch(error => {
        // console.error('---- fetchPayrollsToApprove error', error);
        const errorMsg = error.message;
        dispatch(initiatePayrollToApproveFailure(errorMsg));
      });
  };
};

// Post PayrollToApprove
export const postPayrollToApproveSuccess = payroll => {
  return {
    type: POST_PAYROLL_TO_APPROVE_SUCCESS,
    payload: payroll,
  };
};

// fetch PayrollToApprove
export const postPayrollToApprove = payroll => {
  let _name = computePayrollToApproveName();
  let params = {
    name: _name,
    employee: payroll.employee,
    date_from: payroll.date_from,
    date_to: payroll.date_to,
  };
  return dispatch => {
    dispatch(initiatePayrollToApproveRequest);
    let stored_token = localStorage.getItem('token');
    let token = `Token ${stored_token}`;
    console.log('token :>> ', token);
    axios.defaults.headers.common['Authorization'] = token;
    console.log('postPayrollToApprove params :>> ', params);
    axios
      .post(API_BASE + '/api/payroll/', params)
      .then(response => {
        const payroll = response.data;
        dispatch(postPayrollToApproveSuccess(payroll));
        message.success({ content: 'PayrollToApprove added successfully!', key, duration: 2 });
        return payroll;
      })
      .catch(error => {
        console.error('---- postPayrollToApprove error', error);
        const errorMsg = error.message;
        dispatch(initiatePayrollToApproveFailure(errorMsg));
      })
      .finally(() => dispatch(handlePayrollToApproveModalCancelAction()));
  };
};

// editPayrollToApproveSuccess
export const editPayrollToApproveSuccess = payroll => {
  message.success({ content: 'PayrollToApprove edited successfully!', key, duration: 2 });
  return {
    type: EDIT_PAYROLL_TO_APPROVE_SUCCESS,
    payload: payroll,
  };
};
export const editPayrollToApprove = payroll => {
  console.log('---- editPayrollToApprove', payroll);

  let params = {
    id: payroll.id,
    employee: payroll.employee,
    date_from: payroll.date_from,
    date_to: payroll.date_to,
  };
  let url = `${API_BASE}/api/payroll/${params.id}/`;

  return dispatch => {
    dispatch(initiatePayrollToApproveRequest(payroll));
    let stored_token = localStorage.getItem('token');
    let token = `Token ${stored_token}`;
    axios.defaults.headers.common['Authorization'] = token;
    console.log('---- editPayrollToApprove params', params, 'Token ', token, 'url ', url);
    axios
      .put(url, params)
      .then(response => {
        const payroll = response.data;
        console.log('---- editPayrollToApprove payroll', payroll);
        dispatch(editPayrollToApproveSuccess(payroll));
      })
      .catch(error => {
        console.error('---- initiatePayrollToApproveFailure error', error);
        const errorMsg = error.message;
        dispatch(initiatePayrollToApproveFailure(errorMsg));
      })
      .finally(() => dispatch(handlePayrollToApproveModalCancelAction()));
  };
};

// Modal
export const handlePayrollToApproveModalShowAction = payload => ({
  type: HANDLE_PAYROLL_TO_APPROVE_MODAL_SHOW,
  payload,
});
export const handlePayrollToApproveModalCancelAction = payload => ({
  type: HANDLE_PAYROLL_TO_APPROVE_MODAL_CANCEL,
  payload,
});
export const setPayrollToApproveModalItem = payload => ({ type: SET_PAYROLL_TO_APPROVE_MODAL_ITEM, payload });

// payroll Actions Creator
export const getPayrollToApproveByIdSuccess = payroll => {
  message.success({ content: 'PayrollToApprove fetched successfully!', key, duration: 2 });
  return {
    type: GET_PAYROLL_TO_APPROVE_BY_ID_SUCCESS,
    payload: payroll,
  };
};

export const getPayrollToApproveById = payroll_id => {
  return async dispatch => {
    dispatch(initiatePayrollToApproveRequest);
    let stored_token = localStorage.getItem('token');
    let token = `Token ${stored_token}`;
    axios.defaults.headers.common['Authorization'] = token;
    try {
      let res = await axios.get(`${API_BASE}/api/payroll/${payroll_id}`);
      let payroll = await res.data;
      // console.log('in getPayrollToApproveById :>> ', payroll);
      dispatch(getPayrollToApproveByIdSuccess(payroll));
      return await payroll;
    } catch (error) {
      console.error('in getPayrollToApproveById :>> ', error.message);
      dispatch(initiatePayrollToApproveFailure(error.message));
    }
  };
};

function computePayrollToApproveName() {
  let now = new window.Date();
  let year = now.getFullYear();
  let month = now.getMonth();
  let date = now.getDate();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  let seconds = now.getSeconds();
  return `SPLI_${year}${month <= 9 ? `0${month + 1}` : month + 1}${
    date >= 9 ? `0${date + 1}` : date
  }${hours}${minutes}${seconds}`;
}

// PERMISSIONS
export const setPayrollToApprove = payload => ({ type: SET_PAYROLL_TO_APPROVE, payload });
