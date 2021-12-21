import axios from 'axios';
import { API_BASE } from '../../env';
import { message } from 'antd';
import {
  DELETE_CUSTOMER_SUCCESS,
  EDIT_CUSTOMER_SUCCESS,
  FETCH_CUSTOMER_SUCCESS,
  HANDLE_CUSTOMER_MODAL_CANCEL,
  HANDLE_CUSTOMER_MODAL_SHOW,
  INITIATE_CUSTOMER_FAILURE,
  INITIATE_CUSTOMER_REQUEST,
  POST_CUSTOMER_SUCCESS,
  SET_CUSTOMER_MODAL_ITEM,
} from './customer.constants';

const key = 'updatable';

// customer Actions Creator
export const initiateCustomerRequest = value => {
  message.loading({ content: 'Initial request...', key });
  return {
    type: INITIATE_CUSTOMER_REQUEST,
    payload: value,
  };
};
export const initiateCustomerFailure = error => {
  message.error({ content: 'Error!', key, duration: 2 });
  return {
    type: INITIATE_CUSTOMER_FAILURE,
    payload: error,
  };
};

// customer Actions Creator
export const fetchCustomerSuccess = customers => {
  message.success({ content: 'Customer fetched successfully!', key, duration: 2 });
  return {
    type: FETCH_CUSTOMER_SUCCESS,
    payload: customers,
  };
};

// fetch Customer
export const fetchCustomers = () => {
  // console.log('---- fetchCustomers');
  return dispatch => {
    dispatch(initiateCustomerRequest);
    let stored_token = localStorage.getItem('token');
    let token = `Token ${stored_token}`;
    axios.defaults.headers.common['Authorization'] = token;
    axios
      .get(API_BASE + '/api/customer/')
      .then(response => {
        const customers = response.data;
        // console.log('---- fetchCustomers customers', customers);
        dispatch(fetchCustomerSuccess(customers));
      })
      .catch(error => {
        // console.error('---- fetchCustomers error', error);
        const errorMsg = error.message;
        dispatch(initiateCustomerFailure(errorMsg));
      });
  };
};

// editCustomerSuccess
export const editCustomerSuccess = customer => {
  message.success({ content: 'Customer edited successfully!', key, duration: 2 });
  return {
    type: EDIT_CUSTOMER_SUCCESS,
    payload: customer,
  };
};

export const handleCustomerModalShowAction = payload => ({ type: HANDLE_CUSTOMER_MODAL_SHOW, payload });
export const handleCustomerModalCancelAction = payload => ({ type: HANDLE_CUSTOMER_MODAL_CANCEL, payload });
export const setCustomerModalItem = payload => ({ type: SET_CUSTOMER_MODAL_ITEM, payload });

// Post Customer
export const postCustomerSuccess = customer => {
  return {
    type: POST_CUSTOMER_SUCCESS,
    payload: customer,
  };
};

// fetch Customer
export const postCustomer = customer => {
  let params = {
    email: customer.email,
    firstname: customer.first_name,
    lastname: customer.last_name,
    payment_method: customer.payment_method,
    phone_number: customer.phone_number,
  };
  return dispatch => {
    dispatch(initiateCustomerRequest);
    let stored_token = localStorage.getItem('token');
    let token = `Token ${stored_token}`;
    console.log('token :>> ', token);
    axios.defaults.headers.common['Authorization'] = token;
    axios.defaults.headers.common['Content-Type'] = 'application/json';
    axios.defaults.headers.common['accept'] = 'application/json';
    console.log('postCustomer params :>> ', params);
    axios
      .post(API_BASE + '/api/customer/', params)
      .then(response => {
        const customer = response.data;
        dispatch(postCustomerSuccess(customer));
        message.success({ content: 'Customer added successfully!', key, duration: 2 });
        return customer;
      })
      .catch(error => {
        console.error('---- postCustomer error', error);
        const errorMsg = error.message;
        dispatch(initiateCustomerFailure(errorMsg));
      })
      .finally(() => dispatch(handleCustomerModalCancelAction()));
  };
};

export const editCustomer = customer => {
  console.log('---- editCustomer', customer);

  let params = {
    id: customer.id,
    email: customer.email,
    firstname: customer.first_name,
    lastname: customer.last_name,
    payment_method: customer.payment_method,
    phone_number: customer.phone_number,
  };
  let url = `${API_BASE}/api/customer/${params.id}/`;

  return dispatch => {
    dispatch(initiateCustomerRequest(customer));
    let stored_token = localStorage.getItem('token');
    let token = `Token ${stored_token}`;
    axios.defaults.headers.common['Authorization'] = token;
    // console.log('---- editCustomer params', params, 'Token ', token, 'url ', url);
    axios
      .put(url, params)
      .then(response => {
        const customer = response.data;
        console.log('---- editCustomer customer', customer);
        dispatch(editCustomerSuccess(customer));
      })
      .catch(error => {
        console.error('---- initiateCustomerFailure error', error);
        const errorMsg = error.message;
        dispatch(initiateCustomerFailure(errorMsg));
      })
      .finally(() => dispatch(handleCustomerModalCancelAction()));
  };
};

export const deleteCustomerSuccess = response => {
  // console.log('in deleteCustomerSuccess customer', response);
  message.success({ content: 'deleted successfully!', key, duration: 3 });
  return {
    type: DELETE_CUSTOMER_SUCCESS,
    payload: response,
  };
};

export const deleteCustomer = id => {
  let params = {
    id: id,
  };
  let url = `${API_BASE}/api/customer/${params.id}/`;

  return dispatch => {
    dispatch(initiateCustomerRequest(id));
    let stored_token = localStorage.getItem('token');
    let token = `Token ${stored_token}`;
    axios.defaults.headers.common['Authorization'] = token;
    console.log('---- deleteCustomer params', params, 'Token ', token, 'url ', url);
    axios
      .delete(url, params)
      .then(response => {
        console.log('---- deleteCustomer customer', response);
        dispatch(deleteCustomerSuccess(id));
      })
      .catch(error => {
        console.error('---- deleteCustomer error', error);
        const errorMsg = error.message;
        dispatch(initiateCustomerFailure(errorMsg));
      });
  };
};

function computeCustomerName() {
  let now = new window.Date();
  let year = now.getFullYear();
  let month = now.getMonth();
  let date = now.getDate();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  let seconds = now.getSeconds();
  return `SERVICE_${year}${month <= 9 ? `0${month + 1}` : month + 1}${
    date >= 9 ? `0${date + 1}` : date
  }${hours}${minutes}${seconds}`;
}
