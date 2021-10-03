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
      let res = await axios.get(`${API_BASE}/api/sales/?parent_id=${sales_id}`)
      let sales = await res.data;
      console.log('in getSalesLineByParentId :>> ', sales);
      dispatch(getSalesLineByParentIdSuccess(sales))
      return await sales
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

export const editSalesLine = (sales) => {

  let params = {
      "amount_paid": sales.amount_paid,
      "customer_id": sales.customer_id,
      "lookup":sales.lookup,
      "id": sales.id,
      "is_credit": sales.is_credit,
      "quantity": sales.quantity,
      "payment_method": sales.payment_method
  }

  let url = `${API_BASE}/api/sales/${params.id}/`
  // console.log('---- editSalesLine params', params, sales);
  return (dispatch) => {
      dispatch(initiateSalesLineRequest(params));
      let stored_token = localStorage.getItem('token')
      let token = `Token ${stored_token}`
      axios.defaults.headers.common['Authorization'] = token
      // console.log('---- editSalesLine params', params, 'Token ', token, 'url ', url);
      axios
          .put(url, params)
          .then((response) => {
              const sales = response.data;
              console.log('---- editSalesLine sales', sales);
              // dispatch(editSalesLineSuccess(sales));
              // dispatch(editServiceByIdSuccess(sales));
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
  let url = `${API_BASE}/api/sales/${params.id}/`

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
export const postSalesLine = (sales) => {
    let params = {
      "parent_id": sales.parent,
      "lookup": sales.lookup,
      "amount_paid": sales.amount_paid,
      "quantity": sales.quantity,
      "payment_method": sales.payment_method,
      "details": sales.detail,
      "customer_id": sales.customer_id,
      "is_credit": sales.is_credit,
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
          .post(API_BASE+"/api/sales/", params)
          .then((response) => {
            const sales = response.data;
            dispatch(postSalesLineSuccess(sales));
            message.success({ content: 'SalesLine added successfully!', key, duration: 2 });
            return sales
          })
          .catch((error) => {
              console.error('---- postSalesLine error', error);
              const errorMsg = error.message;
              dispatch(initiateSalesLineFailure(errorMsg));
          }).finally(()=> dispatch(handleSalesLineModalCancelAction()));
  };
};
