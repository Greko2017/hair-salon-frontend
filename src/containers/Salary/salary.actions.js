import {FETCH_SALARY_SUCCESS,INITIATE_SALARY_FAILURE,INITIATE_SALARY_REQUEST} from './salary.constants'

import axios from "axios";
import { API_BASE } from '../../env';
import { message } from 'antd';
const key = "updatable"

// salary Actions Creator
export const initiateSalaryRequest = (value) => {
  message.loading({ content: 'Initial request...', key });
  return {
      type: INITIATE_SALARY_REQUEST,
      payload: value
  };
};
export const initiateSalaryFailure = (error) => {
  message.error({ content: 'Error!', key, duration: 2 });
  return {
      type: INITIATE_SALARY_FAILURE,
      payload: error,
  };
};


// Salary Actions Creator
export const fetchSalarySuccess = (salaries) => {
  message.success({ content: 'salary fetched successfully!', key, duration: 2 });
  return {
      type: FETCH_SALARY_SUCCESS,
      payload: salaries
  };
};

// fetch Salary
export const fetchSalaries = () => {
  // console.log('---- fetchSalaries');
  return (dispatch) => {
      dispatch(initiateSalaryRequest);
      let stored_token = localStorage.getItem('token')
      let token = `Token ${stored_token}`
      axios.defaults.headers.common['Authorization'] = token
      axios
          .get(API_BASE+"/api/salary/")
          .then((response) => {
              const salaries = response.data;
              // console.log('---- fetchSalaries salaries', salaries);
              dispatch(fetchSalarySuccess(salaries));
          })
          .catch((error) => {
              // console.error('---- fetchSalaries error', error);
              const errorMsg = error.message;
              dispatch(initiateSalaryFailure(errorMsg));
          });
  };
};
