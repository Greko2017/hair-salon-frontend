import axios from "axios";
import { API_BASE } from '../../env';
import { message } from 'antd';
import { INITIATE_SALESLINE_FAILURE, INITIATE_SALESLINE_REQUEST,GET_SALESLINE_BY_PARENT_ID_SUCCESS, EDIT_SALESLINE_SUCCESS, DELETE_SALESLINE_SUCCESS, HANDLE_SALESLINE_MODAL_SHOW, HANDLE_SALESLINE_MODAL_CANCEL, SET_SALESLINE_MODAL_ITEM, POST_SALESLINE_SUCCESS, SALESLINE_EDIT_EDITING_KEY } from "./salesline.constants";
import { SERVICELINE_EDIT_EDITING_KEY } from "containers/ServiceLine/serviceline.constants";

const key = 'updatable';


export const saleslineEditEditingKey = (value) => {
  return {
      type: SALESLINE_EDIT_EDITING_KEY,
      payload: value
  };
}
// sales Actions Creator
export const initiateSalesLineRequest = (value) => {
  message.loading({ content: 'Initial request...', key });
  return {
      type: INITIATE_SALESLINE_REQUEST,
      payload: value
  };
};
export const initiateSalesLineFailure = (error) => {
  message.error({ content: 'Error!', key, duration: 2 });
  return {
      type: INITIATE_SALESLINE_FAILURE,
      payload: error,
  };
};


// sales Actions Creator
export const getSalesLineByParentIdSuccess = (sales) => {
  message.success({ content: 'SalesLine fetched successfully!', key, duration: 2 });
  return {
      type: GET_SALESLINE_BY_PARENT_ID_SUCCESS,
      payload: sales
  };
};

export const getSalesLineByParentId = (sales_id) => {
  return async (dispatch)=>{
    dispatch(initiateSalesLineRequest);
    let stored_token = localStorage.getItem('token')
    let token = `Token ${stored_token}`
    axios.defaults.headers.common['Authorization'] = token
    try {
      let res = await axios.get(`${API_BASE}/api/saleslines_by_parent_id/?parent_id=${sales_id}`)
      let saleslines = await res.data;
      // console.log('in getSalesLineByParentId :>> ', saleslines);
      dispatch(getSalesLineByParentIdSuccess(saleslines))
      return await saleslines
    } catch (error) {
      console.error('in getSalesLineByParentId :>> ', error.message);
      dispatch(initiateSalesLineFailure(error.message))
    }
  }
}


export const salesEditEditingKey = (value) => {
  return {
      type: SERVICELINE_EDIT_EDITING_KEY,
      payload: value
  };
}

// editSalesLineSuccess
export const editSalesLineSuccess = (sales) => {
  console.log('---- editSalesLineSuccess sales', sales);
  message.success({ content: 'Service Line edited successfully!', key, duration: 2 });
  return {
      type: EDIT_SALESLINE_SUCCESS,
      payload: sales,
  };
};

export const editSalesLine = (salesline) => {

  let params = {
      "id": salesline.id,
      "product_quantity": salesline.product_quantity,
      "payment_method": salesline.payment_method,
      "parent_id": salesline.parent_id,
      "product_id": salesline.product_id,
      "is_credit": salesline.is_credit,
      "customer_id": salesline.customer_id,
  }

  let url = `${API_BASE}/api/saleline/${params.id}/`
  console.log('---- editSalesLine params', params, salesline);
  return (dispatch) => {
      dispatch(initiateSalesLineRequest(params));
      let stored_token = localStorage.getItem('token')
      let token = `Token ${stored_token}`
      axios.defaults.headers.common['Authorization'] = token
      // console.log('---- editSalesLine params', params, 'Token ', token, 'url ', url);
      axios
          .put(url, params)
          .then((response) => {
              const salesline = response.data;
              console.log('---- editSalesLine salesline', salesline);
              dispatch(editSalesLineSuccess(salesline));
          })
          .catch((error) => {
              console.error('---- editSalesLine error', error);
              const errorMsg = error.message;
              dispatch(initiateSalesLineFailure(errorMsg));
          });
  };
};


// delete service line

export const deleteSalesLineSuccess = (response) => {
  console.log('in deleteSalesLineSuccess service', response);
  message.success({ content: 'deleted successfully!', key, duration: 3 });
  return {
      type: DELETE_SALESLINE_SUCCESS,
      payload: response,
  };
};


export const deleteSalesLine = (id) => {
  console.log('---- deleteSalesLine', id);

  let params = {
      'id': id,
  }
  let url = `${API_BASE}/api/saleline/${params.id}/`

  return (dispatch) => {
      dispatch(initiateSalesLineRequest(id));
      let stored_token = localStorage.getItem('token')
      let token = `Token ${stored_token}`
      axios.defaults.headers.common['Authorization'] = token
      console.log('---- deleteSalesLine params', params, 'Token ', token, 'url ', url);
      axios
          .delete(url, params)
          .then((response) => {
              console.log('---- deleteSalesLine sales', response);
              dispatch(deleteSalesLineSuccess(id));
          })
          .catch((error) => {
              console.error('---- deleteSalesLine error', error);
              const errorMsg = error.message;
              dispatch(initiateSalesLineFailure(errorMsg));
          });
  };
};

// SalesLine modal
export const handleSalesLineModalShowAction = payload => ({ type: HANDLE_SALESLINE_MODAL_SHOW, payload });
export const handleSalesLineModalCancelAction = payload => ({ type: HANDLE_SALESLINE_MODAL_CANCEL, payload });
export const setSalesLineModalItem = payload => ({ type: SET_SALESLINE_MODAL_ITEM, payload });


// Post SalesLine
export const postSalesLineSuccess = (sales) => {
  return {
      type: POST_SALESLINE_SUCCESS,
      payload: sales,
  };
};

// fetch SalesLine
export const postSalesLine = (salesline) => {
    let params = {
      "parent_id": salesline.parent_id,
      "product_quantity": salesline.product_quantity,
      "is_credit": salesline.is_credit,
      "amount_paid": salesline.amount_paid,
      "details": salesline.details,
      "payment_method": salesline.payment_method,
      "product_id": salesline.product_id,
  }
  return (dispatch) => {
      dispatch(initiateSalesLineRequest);
      let stored_token = localStorage.getItem('token')
      let token = `Token ${stored_token}`
      axios.defaults.headers.common['Authorization'] = token
      axios.defaults.headers.common['Content-Type'] = 'application/json'
      axios.defaults.headers.common['accept'] = 'application/json'
      console.log('postSalesLine params :>> ', params);
      axios
          .post(API_BASE+"/api/saleline/", params)
          .then((response) => {
            const salesline = response.data;
            dispatch(postSalesLineSuccess(salesline));
            message.success({ content: 'SalesLine added successfully!', key, duration: 2 });
            return salesline
          })
          .catch((error) => {
              console.error('---- postSalesLine error', error);
              const errorMsg = error.message;
              dispatch(initiateSalesLineFailure(errorMsg));
          }).finally(()=> dispatch(handleSalesLineModalCancelAction()));
  };
};
