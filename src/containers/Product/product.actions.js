import axios from 'axios';
import { API_BASE } from '../../env';
import { message } from 'antd';
import {
  DELETE_PRODUCT_SUCCESS,
  EDIT_PRODUCT_SUCCESS,
  FETCH_PRODUCT_SUCCESS,
  GET_PRODUCT_BY_ID_SUCCESS,
  HANDLE_PRODUCT_MODAL_CANCEL,
  HANDLE_PRODUCT_MODAL_SHOW,
  INITIATE_PRODUCT_FAILURE,
  INITIATE_PRODUCT_REQUEST,
  POST_PRODUCT_SUCCESS,
  SET_PRODUCT_MODAL_ITEM,
} from './product.constants';

const key = 'updatable';
// product Actions Creator
export const initiateProductRequest = value => {
  message.loading({ content: 'Initial request...', key });
  return {
    type: INITIATE_PRODUCT_REQUEST,
    payload: value,
  };
};
export const initiateProductFailure = error => {
  message.error({ content: 'Error!', key, duration: 2 });
  return {
    type: INITIATE_PRODUCT_FAILURE,
    payload: error,
  };
};

// product Actions Creator
export const fetchProductSuccess = products => {
  message.success({ content: 'Product fetched successfully!', key, duration: 2 });
  return {
    type: FETCH_PRODUCT_SUCCESS,
    payload: products,
  };
};

// fetch Product
export const fetchProduct = () => {
  // console.log('---- fetchProduct');
  return dispatch => {
    dispatch(initiateProductRequest);
    let stored_token = localStorage.getItem('token');
    let token = `Token ${stored_token}`;
    axios.defaults.headers.common['Authorization'] = token;
    axios
      .get(API_BASE + '/api/product/')
      .then(response => {
        const products = response.data;
        // console.log('---- fetchProduct products', products);
        dispatch(fetchProductSuccess(products));
      })
      .catch(error => {
        // console.error('---- fetchProduct error', error);
        const errorMsg = error.message;
        dispatch(initiateProductFailure(errorMsg));
      });
  };
};

// Post Product
export const postProductSuccess = product => {
  return {
    type: POST_PRODUCT_SUCCESS,
    payload: product,
  };
};

// fetch Product
export const postProduct = product => {
  let params = {
    name: product.name,
    category_id: product.category,
    selling_price: product.selling_price,
    cost_price: product.cost_price,
  };
  if (product.status) {
    params.status = product.status;
  }
  return dispatch => {
    dispatch(initiateProductRequest);
    let stored_token = localStorage.getItem('token');
    let token = `Token ${stored_token}`;
    console.log('token :>> ', token);
    axios.defaults.headers.common['Authorization'] = token;
    console.log('postProduct params :>> ', params);
    axios
      .post(API_BASE + '/api/product/', params)
      .then(response => {
        const product = response.data;
        dispatch(postProductSuccess(product));
        message.success({ content: 'Product added successfully!', key, duration: 2 });
        return product;
      })
      .catch(error => {
        console.error('---- postProduct error', error);
        const errorMsg = error.message;
        dispatch(initiateProductFailure(errorMsg));
      })
      .finally(() => dispatch(handleProductModalCancelAction()));
  };
};

// editProductSuccess
export const editProductSuccess = product => {
  message.success({ content: 'Product edited successfully!', key, duration: 2 });
  return {
    type: EDIT_PRODUCT_SUCCESS,
    payload: product,
  };
};
export const editProduct = product => {
  console.log('---- editProduct', product);
  let params = {
    id: product.id,
    name: product.name,
    category_id: product.category,
    selling_price: product.selling_price,
    cost_price: product.cost_price,
  };
  if (product.status) {
    params.status = product.status;
  }
  let url = `${API_BASE}/api/product/${params.id}/`;

  return dispatch => {
    dispatch(initiateProductRequest(product));
    let stored_token = localStorage.getItem('token');
    let token = `Token ${stored_token}`;
    axios.defaults.headers.common['Authorization'] = token;
    console.log('---- editProduct params', params, 'Token ', token, 'url ', url);
    axios
      .put(url, params)
      .then(response => {
        const product = response.data;
        console.log('---- editProduct product', product);
        dispatch(editProductSuccess(product));
      })
      .catch(error => {
        console.error('---- initiateProductFailure error', error);
        const errorMsg = error.message;
        dispatch(initiateProductFailure(errorMsg));
      })
      .finally(() => dispatch(handleProductModalCancelAction()));
  };
};

// Modal
export const handleProductModalShowAction = payload => ({ type: HANDLE_PRODUCT_MODAL_SHOW, payload });
export const handleProductModalCancelAction = payload => ({ type: HANDLE_PRODUCT_MODAL_CANCEL, payload });
export const setProductModalItem = payload => ({ type: SET_PRODUCT_MODAL_ITEM, payload });

// product Actions Creator
export const getProductByIdSuccess = product => {
  message.success({ content: 'Product fetched successfully!', key, duration: 2 });
  return {
    type: GET_PRODUCT_BY_ID_SUCCESS,
    payload: product,
  };
};

export const getProductById = product_id => {
  return async dispatch => {
    dispatch(initiateProductRequest);
    let stored_token = localStorage.getItem('token');
    let token = `Token ${stored_token}`;
    axios.defaults.headers.common['Authorization'] = token;
    try {
      let res = await axios.get(`${API_BASE}/api/product/${product_id}`);
      let product = await res.data;
      // console.log('in getProductById :>> ', product);
      dispatch(getProductByIdSuccess(product));
      return await product;
    } catch (error) {
      console.error('in getProductById :>> ', error.message);
      dispatch(initiateProductFailure(error.message));
    }
  };
};

export const deleteProductSuccess = response => {
  // console.log('in deleteProductSuccess product', response);
  message.success({ content: 'deleted successfully!', key, duration: 3 });
  return {
    type: DELETE_PRODUCT_SUCCESS,
    payload: response,
  };
};

export const deleteProduct = id => {
  let params = {
    id: id,
  };
  let url = `${API_BASE}/api/product/${params.id}/`;

  return dispatch => {
    dispatch(initiateProductRequest(id));
    let stored_token = localStorage.getItem('token');
    let token = `Token ${stored_token}`;
    axios.defaults.headers.common['Authorization'] = token;
    console.log('---- deleteProduct params', params, 'Token ', token, 'url ', url);
    axios
      .delete(url, params)
      .then(response => {
        console.log('---- deleteProduct product', response);
        dispatch(deleteProductSuccess(id));
      })
      .catch(error => {
        console.error('---- deleteProduct error', error);
        const errorMsg = error.message;
        dispatch(initiateProductFailure(errorMsg));
      });
  };
};
