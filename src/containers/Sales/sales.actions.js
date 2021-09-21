import axios from "axios";
import { API_BASE } from '../../env';
import { message } from 'antd';
import { DELETE_SALES_SUCCESS, EDIT_SALES_SUCCESS, FETCH_SALES_SUCCESS, HANDLE_SALES_MODAL_CANCEL, HANDLE_SALES_MODAL_SHOW, INITIATE_SALES_FAILURE, INITIATE_SALES_REQUEST, POST_SALES_SUCCESS, SET_SALES_MODAL_ITEM } from "./sales.constants";

const key = 'updatable';

// sale Actions Creator
export const initiateSaleRequest = (value) => {
  message.loading({ content: 'Initial request...', key });
  return {
      type: INITIATE_SALES_REQUEST,
      payload: value
  };
};
export const initiateSaleFailure = (error) => {
  message.error({ content: 'Error!', key, duration: 2 });
  return {
      type: INITIATE_SALES_FAILURE,
      payload: error,
  };
};


// sale Actions Creator
export const fetchSaleSuccess = (sales) => {
  message.success({ content: 'Sale fetched successfully!', key, duration: 2 });
  return {
      type: FETCH_SALES_SUCCESS,
      payload: sales
  };
};


// fetch Sale
export const fetchSales = () => {
  // console.log('---- fetchSales');
  return (dispatch) => {
      dispatch(initiateSaleRequest);
      let stored_token = localStorage.getItem('token')
      let token = `Token ${stored_token}`
      axios.defaults.headers.common['Authorization'] = token
      axios
          .get(API_BASE+"/api/sale/")
          .then((response) => {
              const sales = response.data;
              // console.log('---- fetchSales sales', sales);
              dispatch(fetchSaleSuccess(sales));
          })
          .catch((error) => {
              // console.error('---- fetchSales error', error);
              const errorMsg = error.message;
              dispatch(initiateSaleFailure(errorMsg));
          });
  };
};

// editSaleSuccess
export const editSaleSuccess = (sale) => {
    message.success({ content: 'Sale edited successfully!', key, duration: 2 });
    return {
        type: EDIT_SALES_SUCCESS || 'EDIT_SALE_SUCCESS',
        payload: sale,
    };
};

export const handleSaleModalShowAction = payload => ({ type: HANDLE_SALES_MODAL_SHOW, payload });
export const handleSaleModalCancelAction = payload => ({ type: HANDLE_SALES_MODAL_CANCEL, payload });
export const setSaleModalItem = payload => ({ type: SET_SALES_MODAL_ITEM, payload });

// Post Sale
export const postSaleSuccess = (sale) => {
  return {
      type: POST_SALES_SUCCESS,
      payload: sale,
  };
};

// fetch Sale
export const postSale = (sale) => {
  let _name = computeSaleName()
    let params = {
      "name": _name,
      "saler_id": sale.saler,
      "customer_id": sale.customer
  }
  return (dispatch) => {
      dispatch(initiateSaleRequest);
      let stored_token = localStorage.getItem('token')
      let token = `Token ${stored_token}`
      console.log('token :>> ', token);
      axios.defaults.headers.common['Authorization'] = token
      axios.defaults.headers.common['Content-Type'] = 'application/json'
      axios.defaults.headers.common['accept'] = 'application/json'
      console.log('postSale params :>> ', params);
      axios
          .post(API_BASE+"/api/sale/", params)
          .then((response) => {
            const sale = response.data;
            dispatch(postSaleSuccess(sale));
            message.success({ content: 'Sale added successfully!', key, duration: 2 });
            return sale
          })
          .catch((error) => {
              console.error('---- postSale error', error);
              const errorMsg = error.message;
              dispatch(initiateSaleFailure(errorMsg));
          }).finally(()=> dispatch(handleSaleModalCancelAction()));
  };
};

export const editSale = (sale) => {
  console.log('---- editSale', sale);

  let params = {
      'id': sale.id,
      "saler_id": sale.saler,
      "customer_id": sale.customer
  }
  let url = `${API_BASE}/api/sale/${params.id}/`

  return (dispatch) => {
      dispatch(initiateSaleRequest(sale));
      let stored_token = localStorage.getItem('token')
      let token = `Token ${stored_token}`
      axios.defaults.headers.common['Authorization'] = token
      console.log('---- editSale params', params, 'Token ', token, 'url ', url);
      axios
          .put(url, params)
          .then((response) => {
              const sale = response.data;
              console.log('---- editSale sale', sale);
              dispatch(editSaleSuccess(sale));
          })
          .catch((error) => {
              console.error('---- initiateSaleFailure error', error);
              const errorMsg = error.message;
              dispatch(initiateSaleFailure(errorMsg));
          }).finally(()=> dispatch(handleSaleModalCancelAction()));
  };
};

export const deleteSaleSuccess = (response) => {
  // console.log('in deleteSaleSuccess sale', response);
  message.success({ content: 'deleted successfully!', key, duration: 3 });
  return {
      type: DELETE_SALES_SUCCESS,
      payload: response,
  };
};

export const deleteSale = (id) => {
  let params = {
      'id': id,
  }
  let url = `${API_BASE}/api/sale/${params.id}/`

  return (dispatch) => {
      dispatch(initiateSaleRequest(id));
      let stored_token = localStorage.getItem('token')
      let token = `Token ${stored_token}`
      axios.defaults.headers.common['Authorization'] = token
      console.log('---- deleteSale params', params, 'Token ', token, 'url ', url);
      axios
          .delete(url, params)
          .then((response) => {
              console.log('---- deleteSale sale', response);
              dispatch(deleteSaleSuccess(id));
          })
          .catch((error) => {
              console.error('---- deleteSale error', error);
              const errorMsg = error.message;
              dispatch(initiateSaleFailure(errorMsg));
          });
  };
};


function computeSaleName(){
  let now = new window.Date();
  let year = now.getFullYear()
  let month = now.getMonth()
  let date = now.getDate()
  let hours = now.getHours()
  let minutes = now.getMinutes()
  let seconds = now.getSeconds()
  return `SERVICE_${year}${month<=9 ? `0${month+1}` : month+1 }${date>=9 ? `0${date+1}` : date}${hours}${minutes}${seconds}`
}

