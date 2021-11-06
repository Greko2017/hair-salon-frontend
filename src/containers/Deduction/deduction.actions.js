import axios from 'axios';
import { API_BASE } from '../../env';
import { message } from 'antd';
import {
  INITIATE_DEDUCTION_FAILURE,
  INITIATE_DEDUCTION_REQUEST,
  GET_DEDUCTION_BY_PARENT_ID_SUCCESS,
  HANDLE_DEDUCTION_MODAL_SHOW,
  HANDLE_DEDUCTION_MODAL_CANCEL,
  SET_DEDUCTION_MODAL_ITEM,
  DEDUCTION_EDIT_EDITING_KEY,
  EDIT_DEDUCTION_SUCCESS,
  DELETE_DEDUCTION_SUCCESS,
  POST_DEDUCTION_SUCCESS,
} from './deduction.constants';
import { getPayrollById } from 'containers/Payslip/payroll.actions';

const key = 'updatable';
// deduction Actions Creator
export const initiateDeductionRequest = value => {
  message.loading({ content: 'Initial request...', key });
  return {
    type: INITIATE_DEDUCTION_REQUEST,
    payload: value,
  };
};
export const initiateDeductionFailure = error => {
  message.error({ content: 'Error!', key, duration: 2 });
  return {
    type: INITIATE_DEDUCTION_FAILURE,
    payload: error,
  };
};

// deduction Actions Creator
export const getDeductionsByParentIdSuccess = deduction => {
  message.success({ content: 'Deduction fetched successfully!', key, duration: 2 });
  return {
    type: GET_DEDUCTION_BY_PARENT_ID_SUCCESS,
    payload: deduction,
  };
};

export const getDeductionsByParentId = parent_id => {
  return async dispatch => {
    dispatch(initiateDeductionRequest);
    let stored_token = localStorage.getItem('token');
    let token = `Token ${stored_token}`;
    axios.defaults.headers.common['Authorization'] = token;
    try {
      let res = await axios.get(`${API_BASE}/api/deduction_by_parent_id/?parent_id=${parent_id}`);
      let deductions = await res.data;
      // console.log('in getDeductionsByParentId :>> ', deductions);
      dispatch(getDeductionsByParentIdSuccess(deductions));
      return await deductions;
    } catch (error) {
      console.error('in getDeductionsByParentId :>> ', error.message);
      dispatch(initiateDeductionFailure(error.message));
    }
  };
};

export const deductionEditEditingKey = value => {
  return {
    type: DEDUCTION_EDIT_EDITING_KEY,
    payload: value,
  };
};

// editDeductionSuccess
export const editDeductionSuccess = deduction => {
  console.log('---- editDeductionSuccess deduction', deduction);
  message.success({ content: 'Service Line edited successfully!', key, duration: 2 });
  return {
    type: EDIT_DEDUCTION_SUCCESS,
    payload: deduction,
  };
};

export const editDeduction = deduction => {
  let params = {
    id: deduction.id,
    parent: deduction.parent,
    name: deduction.name,
    amount: deduction.amount,
    description: deduction.description,
  };

  let url = `${API_BASE}/api/payroll_deduction/${params.id}/`;
  console.log('---- editDeduction params', params, deduction);
  return dispatch => {
    dispatch(initiateDeductionRequest(params));
    let stored_token = localStorage.getItem('token');
    let token = `Token ${stored_token}`;
    axios.defaults.headers.common['Authorization'] = token;
    axios
      .put(url, params)
      .then(response => {
        const deduction = response.data;
        console.log('---- editDeduction deduction', deduction);
        dispatch(editDeductionSuccess(deduction));
      })
      .catch(error => {
        console.error('---- editDeduction error', error);
        const errorMsg = error.message;
        dispatch(initiateDeductionFailure(errorMsg));
      })
      .finally(() => dispatch(getPayrollById(params.parent)));
  };
};

export const deleteDeductionSuccess = response => {
  console.log('in deleteDeductionSuccess deduction', response);
  message.success({ content: 'deleted successfully!', key, duration: 3 });
  return {
    type: DELETE_DEDUCTION_SUCCESS,
    payload: response,
  };
};

export const deleteDeduction = deduction => {
  console.log('---- deleteOtherPays', deduction);

  let params = {
    id: deduction.id,
    parent: deduction.parent.id,
  };
  let url = `${API_BASE}/api/payroll_deduction/${params.id}/`;

  return dispatch => {
    dispatch(initiateDeductionRequest(deduction.id));
    let stored_token = localStorage.getItem('token');
    let token = `Token ${stored_token}`;
    axios.defaults.headers.common['Authorization'] = token;
    console.log('---- deleteDeduction params', params, 'Token ', token, 'url ', url);
    axios
      .delete(url, params)
      .then(response => {
        // console.log('---- deleteDeduction deduction', response);
        dispatch(deleteDeductionSuccess(deduction.id));
      })
      .catch(error => {
        console.error('---- deleteDeduction error', error);
        const errorMsg = error.message;
        dispatch(initiateDeductionFailure(errorMsg));
      })
      .finally(() => dispatch(getPayrollById(params.parent)));
  };
};

// Post Deduction
export const postDeductionSuccess = deduction => {
  return {
    type: POST_DEDUCTION_SUCCESS,
    payload: deduction,
  };
};

// fetch Deduction
export const postDeduction = deduction => {
  let params = {
    parent: deduction.parent,
    name: deduction.name,
    description: deduction.description,
    amount: deduction.amount,
  };
  return dispatch => {
    dispatch(initiateDeductionRequest);
    let stored_token = localStorage.getItem('token');
    let token = `Token ${stored_token}`;
    axios.defaults.headers.common['Authorization'] = token;
    axios.defaults.headers.common['Content-Type'] = 'application/json';
    axios.defaults.headers.common['accept'] = 'application/json';
    console.log('postDeduction params :>> ', params);
    axios
      .post(API_BASE + '/api/payroll_deduction/', params)
      .then(response => {
        const deduction = response.data;
        dispatch(postDeductionSuccess(deduction));
        message.success({ content: 'Deduction added successfully!', key, duration: 2 });
        return deduction;
      })
      .catch(error => {
        console.error('---- postDeduction error', error);
        const errorMsg = error.message;
        dispatch(initiateDeductionFailure(errorMsg));
      })
      .finally(() => {
        dispatch(handleDeductionModalCancelAction());
        dispatch(getPayrollById(params.parent));
      });
  };
};

// Deduction modal
export const handleDeductionModalShowAction = payload => ({ type: HANDLE_DEDUCTION_MODAL_SHOW, payload });
export const handleDeductionModalCancelAction = payload => ({ type: HANDLE_DEDUCTION_MODAL_CANCEL, payload });
export const setDeductionModalItem = payload => ({ type: SET_DEDUCTION_MODAL_ITEM, payload });
