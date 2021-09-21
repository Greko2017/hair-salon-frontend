import {FETCH_EMPLOYEE_SUCCESS,INITIATE_EMPLOYEE_FAILURE,INITIATE_EMPLOYEE_REQUEST} from './employee.contants'

import axios from "axios";
import { API_BASE } from '../../env';
import { message } from 'antd';
const key = "updatable"

// employee Actions Creator
export const initiateEmployeeRequest = (value) => {
  message.loading({ content: 'Initial request...', key });
  return {
      type: INITIATE_EMPLOYEE_REQUEST,
      payload: value
  };
};
export const initiateEmployeeFailure = (error) => {
  message.error({ content: 'Error!', key, duration: 2 });
  return {
      type: INITIATE_EMPLOYEE_FAILURE,
      payload: error,
  };
};


// Employee Actions Creator
export const fetchEmployeeSuccess = (employees) => {
  message.success({ content: 'employee fetched successfully!', key, duration: 2 });
  return {
      type: FETCH_EMPLOYEE_SUCCESS,
      payload: employees
  };
};

// fetch Employee
export const fetchEmployees = () => {
  // console.log('---- fetchEmployees');
  return (dispatch) => {
      dispatch(initiateEmployeeRequest);
      let stored_token = localStorage.getItem('token')
      let token = `Token ${stored_token}`
      axios.defaults.headers.common['Authorization'] = token
      axios
          .get(API_BASE+"/api/employee/")
          .then((response) => {
              const employees = response.data;
              // console.log('---- fetchEmployees employees', employees);
              dispatch(fetchEmployeeSuccess(employees));
          })
          .catch((error) => {
              // console.error('---- fetchEmployees error', error);
              const errorMsg = error.message;
              dispatch(initiateEmployeeFailure(errorMsg));
          });
  };
};
