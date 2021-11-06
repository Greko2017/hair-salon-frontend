import axios from 'axios';
import { API_BASE } from '../../env';
import { message } from 'antd';
import {
  DELETE_CATEGORY_SUCCESS,
  EDIT_CATEGORY_SUCCESS,
  FETCH_CATEGORY_SUCCESS,
  GET_CATEGORY_BY_ID_SUCCESS,
  HANDLE_CATEGORY_MODAL_CANCEL,
  HANDLE_CATEGORY_MODAL_SHOW,
  INITIATE_CATEGORY_FAILURE,
  INITIATE_CATEGORY_REQUEST,
  POST_CATEGORY_SUCCESS,
  SET_CATEGORY_MODAL_ITEM,
} from './category.constants';

const key = 'updatable';
// category Actions Creator
export const initiateCategoryRequest = value => {
  message.loading({ content: 'Initial request...', key });
  return {
    type: INITIATE_CATEGORY_REQUEST,
    payload: value,
  };
};
export const initiateCategoryFailure = error => {
  message.error({ content: 'Error!', key, duration: 2 });
  return {
    type: INITIATE_CATEGORY_FAILURE,
    payload: error,
  };
};

// category Actions Creator
export const fetchCategorySuccess = categories => {
  message.success({ content: 'Category fetched successfully!', key, duration: 2 });
  return {
    type: FETCH_CATEGORY_SUCCESS,
    payload: categories,
  };
};

// fetch Category
export const fetchCategory = () => {
  // console.log('---- fetchCategory');
  return dispatch => {
    dispatch(initiateCategoryRequest);
    let stored_token = localStorage.getItem('token');
    let token = `Token ${stored_token}`;
    axios.defaults.headers.common['Authorization'] = token;
    axios
      .get(API_BASE + '/api/category/')
      .then(response => {
        const categories = response.data;
        // console.log('---- fetchCategory categories', categories);
        dispatch(fetchCategorySuccess(categories));
      })
      .catch(error => {
        // console.error('---- fetchCategory error', error);
        const errorMsg = error.message;
        dispatch(initiateCategoryFailure(errorMsg));
      });
  };
};

// Post Category
export const postCategorySuccess = category => {
  return {
    type: POST_CATEGORY_SUCCESS,
    payload: category,
  };
};

// fetch Category
export const postCategory = category => {
  let params = {
    name: category.name,
    description: category.description,
  };
  if (category.status) {
    params.status = category.status;
  }
  return dispatch => {
    dispatch(initiateCategoryRequest);
    let stored_token = localStorage.getItem('token');
    let token = `Token ${stored_token}`;
    console.log('token :>> ', token);
    axios.defaults.headers.common['Authorization'] = token;
    console.log('postCategory params :>> ', params);
    axios
      .post(API_BASE + '/api/category/', params)
      .then(response => {
        const category = response.data;
        dispatch(postCategorySuccess(category));
        message.success({ content: 'Category added successfully!', key, duration: 2 });
        return category;
      })
      .catch(error => {
        console.error('---- postCategory error', error);
        const errorMsg = error.message;
        dispatch(initiateCategoryFailure(errorMsg));
      })
      .finally(() => dispatch(handleCategoryModalCancelAction()));
  };
};

// editCategorySuccess
export const editCategorySuccess = category => {
  message.success({ content: 'Category edited successfully!', key, duration: 2 });
  return {
    type: EDIT_CATEGORY_SUCCESS,
    payload: category,
  };
};
export const editCategory = category => {
  console.log('---- editCategory', category);
  let params = {
    id: category.id,
    name: category.name,
    description: category.description,
  };
  if (category.status) {
    params.status = category.status;
  }
  let url = `${API_BASE}/api/category/${params.id}/`;

  return dispatch => {
    dispatch(initiateCategoryRequest(category));
    let stored_token = localStorage.getItem('token');
    let token = `Token ${stored_token}`;
    axios.defaults.headers.common['Authorization'] = token;
    console.log('---- editCategory params', params, 'Token ', token, 'url ', url);
    axios
      .put(url, params)
      .then(response => {
        const category = response.data;
        console.log('---- editCategory category', category);
        dispatch(editCategorySuccess(category));
      })
      .catch(error => {
        console.error('---- initiateCategoryFailure error', error);
        const errorMsg = error.message;
        dispatch(initiateCategoryFailure(errorMsg));
      })
      .finally(() => dispatch(handleCategoryModalCancelAction()));
  };
};

// Modal
export const handleCategoryModalShowAction = payload => ({ type: HANDLE_CATEGORY_MODAL_SHOW, payload });
export const handleCategoryModalCancelAction = payload => ({ type: HANDLE_CATEGORY_MODAL_CANCEL, payload });
export const setCategoryModalItem = payload => ({ type: SET_CATEGORY_MODAL_ITEM, payload });

// category Actions Creator
export const getCategoryByIdSuccess = category => {
  message.success({ content: 'Category fetched successfully!', key, duration: 2 });
  return {
    type: GET_CATEGORY_BY_ID_SUCCESS,
    payload: category,
  };
};

export const getCategoryById = category_id => {
  return async dispatch => {
    dispatch(initiateCategoryRequest);
    let stored_token = localStorage.getItem('token');
    let token = `Token ${stored_token}`;
    axios.defaults.headers.common['Authorization'] = token;
    try {
      let res = await axios.get(`${API_BASE}/api/category/${category_id}`);
      let category = await res.data;
      // console.log('in getCategoryById :>> ', category);
      dispatch(getCategoryByIdSuccess(category));
      return await category;
    } catch (error) {
      console.error('in getCategoryById :>> ', error.message);
      dispatch(initiateCategoryFailure(error.message));
    }
  };
};

export const deleteCategorySuccess = response => {
  // console.log('in deleteCategorySuccess category', response);
  message.success({ content: 'deleted successfully!', key, duration: 3 });
  return {
    type: DELETE_CATEGORY_SUCCESS,
    payload: response,
  };
};

export const deleteCategory = id => {
  let params = {
    id: id,
  };
  let url = `${API_BASE}/api/category/${params.id}/`;

  return dispatch => {
    dispatch(initiateCategoryRequest(id));
    let stored_token = localStorage.getItem('token');
    let token = `Token ${stored_token}`;
    axios.defaults.headers.common['Authorization'] = token;
    console.log('---- deleteCategory params', params, 'Token ', token, 'url ', url);
    axios
      .delete(url, params)
      .then(response => {
        console.log('---- deleteCategory category', response);
        dispatch(deleteCategorySuccess(id));
      })
      .catch(error => {
        console.error('---- deleteCategory error', error);
        const errorMsg = error.message;
        dispatch(initiateCategoryFailure(errorMsg));
      });
  };
};
