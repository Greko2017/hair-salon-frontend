import { FETCH_PRODUCT_SUCCESS, INITIATE_PRODUCT_FAILURE, INITIATE_PRODUCT_REQUEST } from "./product.constants";
import axios from "axios";
import { API_BASE } from '../../env';
import { message } from 'antd';
const key = 'updatable';
// Product Actions Creator
export const initiateProductRequest = (value) => {
  message.loading({ content: 'Initial request...', key });
  return {
      type: INITIATE_PRODUCT_REQUEST,
      payload: value
  };
};
export const initiateProductFailure = (error) => {
  message.error({ content: 'Error!', key, duration: 2 });
  return {
      type: INITIATE_PRODUCT_FAILURE,
      payload: error,
  };
};

// product Actions Creator
export const fetchProductSuccess = (products) => {
  message.success({ content: 'Product fetched successfully!', key, duration: 2 });
  return {
      type: FETCH_PRODUCT_SUCCESS,
      payload: products
  };
};

// fetch Product
export const fetchProduct = () => {
  // console.log('---- fetchProducts');
  return (dispatch) => {
      dispatch(initiateProductRequest);
      let stored_token = localStorage.getItem('token')
      let token = `Token ${stored_token}`
      axios.defaults.headers.common['Authorization'] = token
      axios
          .get(API_BASE+"/api/product/")
          .then((response) => {
              const products = response.data;
              // console.log('---- fetchProduct products', products);
              dispatch(fetchProductSuccess(products));
              return products
          })
          .catch((error) => {
              console.error('---- fetchProducts error', error);
              const errorMsg = error.message;
              dispatch(initiateProductFailure(errorMsg));
          });
  };
};
