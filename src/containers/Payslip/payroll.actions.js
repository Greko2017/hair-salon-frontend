import axios from 'axios';
import { API_BASE } from '../../env';
import { message } from 'antd';
import {
  EDIT_PAYROLL_SUCCESS,
  FETCH_PAYROLL_SUCCESS,
  GET_PAYROLL_BY_ID_SUCCESS,
  HANDLE_PAYROLL_MODAL_CANCEL,
  HANDLE_PAYROLL_MODAL_SHOW,
  INITIATE_PAYROLL_FAILURE,
  INITIATE_PAYROLL_REQUEST,
  POST_PAYROLL_SUCCESS,
  SET_PAYROLL_MODAL_ITEM,
} from './payroll.constants';

const key = 'updatable';
// payroll Actions Creator
export const initiatePayrollRequest = value => {
  message.loading({ content: 'Initial request...', key });
  return {
    type: INITIATE_PAYROLL_REQUEST,
    payload: value,
  };
};
export const initiatePayrollFailure = error => {
  message.error({ content: 'Error!', key, duration: 2 });
  return {
    type: INITIATE_PAYROLL_FAILURE,
    payload: error,
  };
};

// payroll Actions Creator
export const fetchPayrollSuccess = payrolls => {
  message.success({ content: 'Payroll fetched successfully!', key, duration: 2 });
  return {
    type: FETCH_PAYROLL_SUCCESS,
    payload: payrolls,
  };
};

// fetch Payroll
export const fetchPayrolls = () => {
  // console.log('---- fetchPayrolls');
  return dispatch => {
    dispatch(initiatePayrollRequest);
    let stored_token = localStorage.getItem('token');
    let token = `Token ${stored_token}`;
    axios.defaults.headers.common['Authorization'] = token;
    axios
      .get(API_BASE + '/api/payroll/')
      .then(response => {
        const payrolls = response.data;
        // console.log('---- fetchPayrolls payrolls', payrolls);
        dispatch(fetchPayrollSuccess(payrolls));
      })
      .catch(error => {
        // console.error('---- fetchPayrolls error', error);
        const errorMsg = error.message;
        dispatch(initiatePayrollFailure(errorMsg));
      });
  };
};

// Post Payroll
export const postPayrollSuccess = payroll => {
  return {
    type: POST_PAYROLL_SUCCESS,
    payload: payroll,
  };
};

// fetch Payroll
export const postPayroll = payroll => {
  let _name = computePayrollName();
  let params = {
    name: _name,
    employee: payroll.employee,
    date_from: payroll.date_from,
    date_to: payroll.date_to,
  };
  return dispatch => {
    dispatch(initiatePayrollRequest);
    let stored_token = localStorage.getItem('token');
    let token = `Token ${stored_token}`;
    console.log('token :>> ', token);
    axios.defaults.headers.common['Authorization'] = token;
    console.log('postPayroll params :>> ', params);
    axios
      .post(API_BASE + '/api/payroll/', params)
      .then(response => {
        const payroll = response.data;
        dispatch(postPayrollSuccess(payroll));
        message.success({ content: 'Payroll added successfully!', key, duration: 2 });
        return payroll;
      })
      .catch(error => {
        console.error('---- postPayroll error', error);
        const errorMsg = error.message;
        dispatch(initiatePayrollFailure(errorMsg));
      })
      .finally(() => dispatch(handlePayrollModalCancelAction()));
  };
};

// editPayrollSuccess
export const editPayrollSuccess = payroll => {
  message.success({ content: 'Payroll edited successfully!', key, duration: 2 });
  return {
    type: EDIT_PAYROLL_SUCCESS,
    payload: payroll,
  };
};
export const editPayroll = payroll => {
  console.log('---- editPayroll', payroll);

  let params = {
    id: payroll.id,
    employee: payroll.employee,
    date_from: payroll.date_from,
    date_to: payroll.date_to,
  };
  if (payroll.status) {
    params.status = payroll.status;
  }
  let url = `${API_BASE}/api/payroll/${params.id}/`;

  return dispatch => {
    dispatch(initiatePayrollRequest(payroll));
    let stored_token = localStorage.getItem('token');
    let token = `Token ${stored_token}`;
    axios.defaults.headers.common['Authorization'] = token;
    console.log('---- editPayroll params', params, 'Token ', token, 'url ', url);
    axios
      .put(url, params)
      .then(response => {
        const payroll = response.data;
        console.log('---- editPayroll payroll', payroll);
        dispatch(editPayrollSuccess(payroll));
      })
      .catch(error => {
        console.error('---- initiatePayrollFailure error', error);
        const errorMsg = error.message;
        dispatch(initiatePayrollFailure(errorMsg));
      })
      .finally(() => dispatch(handlePayrollModalCancelAction()));
  };
};

// Modal
export const handlePayrollModalShowAction = payload => ({ type: HANDLE_PAYROLL_MODAL_SHOW, payload });
export const handlePayrollModalCancelAction = payload => ({ type: HANDLE_PAYROLL_MODAL_CANCEL, payload });
export const setPayrollModalItem = payload => ({ type: SET_PAYROLL_MODAL_ITEM, payload });

// payroll Actions Creator
export const getPayrollByIdSuccess = payroll => {
  message.success({ content: 'Payroll fetched successfully!', key, duration: 2 });
  return {
    type: GET_PAYROLL_BY_ID_SUCCESS,
    payload: payroll,
  };
};

export const getPayrollById = payroll_id => {
  return async dispatch => {
    dispatch(initiatePayrollRequest);
    let stored_token = localStorage.getItem('token');
    let token = `Token ${stored_token}`;
    axios.defaults.headers.common['Authorization'] = token;
    try {
      let res = await axios.get(`${API_BASE}/api/payroll/${payroll_id}`);
      let payroll = await res.data;
      // console.log('in getPayrollById :>> ', payroll);
      dispatch(getPayrollByIdSuccess(payroll));
      return await payroll;
    } catch (error) {
      console.error('in getPayrollById :>> ', error.message);
      dispatch(initiatePayrollFailure(error.message));
    }
  };
};

function computePayrollName() {
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
