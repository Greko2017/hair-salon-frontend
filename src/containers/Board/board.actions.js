import axios from 'axios';
import { API_BASE } from 'env';
import {
  GET_POSTS_REQUEST,
  GET_POSTS_FAILURE,
  GET_POSTS_SUCCESS,
  POST_POSTS_REQUEST,
  POST_POSTS_SUCCESS,
  POST_POSTS_FAILURE,
  HANDLE_MODAL_SHOW,
  HANDLE_MODAL_CANCEL,
  ON_CHANGE_TITLE,
  ON_CHANGE_TEXT,
  ON_CHANGE_ADD_PHOTO,
  ON_CHANGE_DEL_PHOTO,
  BOARD_TOTAL_SALE,
  BOARD_TOTAL_SERVICE,
  BOARD_TOTAL_CUSTOMER,
  BEST_PERFORMED_EMPLOYEE_SERVICE,
  HANDLE_BOARD_MODAL_SHOW,
  HANDLE_BOARD_MODAL_CANCEL,
  SET_BOARD_MODAL_ITEM,
} from './board.constants';

export const getPostsAction = payload => ({ type: GET_POSTS_REQUEST, payload });
export const getPostsSuccess = payload => ({ type: GET_POSTS_SUCCESS, payload });
export const getPostsFailure = payload => ({ type: GET_POSTS_FAILURE, payload });

export const postPostsAction = payload => ({ type: POST_POSTS_REQUEST, payload });
export const postPostsSuccess = payload => ({ type: POST_POSTS_SUCCESS, payload });
export const postPostsFailure = payload => ({ type: POST_POSTS_FAILURE, payload });

export const handleModalShowAction = payload => ({ type: HANDLE_MODAL_SHOW, payload });
export const handleModalCancelAction = payload => ({ type: HANDLE_MODAL_CANCEL, payload });

export const onChangeTitleAction = payload => ({ type: ON_CHANGE_TITLE, payload });
export const onChangeTextAction = payload => ({ type: ON_CHANGE_TEXT, payload });
export const onChangeAddPhotoAction = payload => ({ type: ON_CHANGE_ADD_PHOTO, payload });
export const onChangeDelPhotoAction = payload => ({ type: ON_CHANGE_DEL_PHOTO, payload });

// BestPerformEmployeeService
export const getBestPerformEmployeeServiceSuccess = payload => ({ type: BEST_PERFORMED_EMPLOYEE_SERVICE, payload });

export const getBestPerformEmployeeService = ({ date_min, date_max, service_name }) => {
  // console.log(` -- In getBestPerformEmployeeService:`, date_min, date_max, service_name);
  return dispatch => {
    let stored_token = localStorage.getItem('token');
    let token = `Token ${stored_token}`;
    axios.defaults.headers.common['Authorization'] = token;
    axios
      .get(API_BASE + `/api/best_employee/?date_min=${date_min}&?date_max=${date_max}`)
      .then(response => {
        const employee_service_performance = response.data;
        dispatch(getBestPerformEmployeeServiceSuccess(employee_service_performance));
        // console.log(`In getTotalServiceSuccess`, employee_service_performance);
        return employee_service_performance;
      })
      .catch(error => {
        console.error('---- getBestPerformEmployeeService error', error);
      });
  };
};

export const getTotalSaleSuccess = payload => ({ type: BOARD_TOTAL_SALE, payload });

export const getTotalSale = ({ date_min, date_max, service_name }) => {
  // console.log(` -- In getTotalSale:`, date_min, date_max, service_name);
  return dispatch => {
    let stored_token = localStorage.getItem('token');
    let token = `Token ${stored_token}`;
    // console.log('token :>> ', token);
    axios.defaults.headers.common['Authorization'] = token;
    axios
      .get(
        API_BASE + `/api/saleline/?date_min=${date_min}&?date_max=${date_max}?service_name=null`,
        // `/api/saleline/?date_min=${date_min}&&?date_max=${date_max}?service_name=${service_name || undefined}`,
      )
      .then(response => {
        const salelines = response.data;
        dispatch(getTotalSaleSuccess(salelines));
        // console.log(`In getTotalSaleSuccess`, salelines);
        return salelines;
      })
      .catch(error => {
        console.error('---- getTotalSale error', error);
      });
  };
};
//
// Total Service
export const getTotalServiceSuccess = payload => ({ type: BOARD_TOTAL_SERVICE, payload });

export const getTotalService = ({ date_min, date_max, service_name }) => {
  // console.log(` -- In getTotalService:`, date_min, date_max, service_name);
  return dispatch => {
    let stored_token = localStorage.getItem('token');
    let token = `Token ${stored_token}`;
    axios.defaults.headers.common['Authorization'] = token;
    axios
      .get(API_BASE + `/api/serviceline/?date_min=${date_min}&?date_max=${date_max}?service_name=null`)
      .then(response => {
        const servicelines = response.data;
        dispatch(getTotalServiceSuccess(servicelines));
        // console.log(`In getTotalServiceSuccess`, servicelines);
        return servicelines;
      })
      .catch(error => {
        // console.error('---- getTotalService error', error);
      });
  };
};

export const getTotalCustomerSuccess = payload => ({ type: BOARD_TOTAL_CUSTOMER, payload });

export const getTotalCustomer = ({ date_min, date_max, first_name, last_name }) => {
  // console.log(` -- In getTotalCustomer:`, date_min, date_max);
  return dispatch => {
    let stored_token = localStorage.getItem('token');
    let token = `Token ${stored_token}`;
    axios.defaults.headers.common['Authorization'] = token;
    axios
      .get(API_BASE + '/api/number_of_customer/')
      .then(response => {
        const total_customer = response.data;
        dispatch(getTotalCustomerSuccess(total_customer));
        // console.log(`In getTotalCustomerSuccess`, total_customer);
        return total_customer;
      })
      .catch(error => {
        console.error('---- getTotalCustomer error', error);
      });
  };
};

// Modal
export const handleBoardModalShowAction = payload => ({ type: HANDLE_BOARD_MODAL_SHOW, payload });
export const handleBoardModalCancelAction = payload => ({ type: HANDLE_BOARD_MODAL_CANCEL, payload });
export const setBoardModalItem = payload => ({ type: SET_BOARD_MODAL_ITEM, payload });
