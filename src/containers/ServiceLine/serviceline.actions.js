import axios from "axios";
import { API_BASE } from '../../env';
import { message } from 'antd';
import { INITIATE_SERVICELINE_FAILURE, INITIATE_SERVICELINE_REQUEST,GET_SERVICELINE_BY_PARENT_ID_SUCCESS, SERVICELINE_EDIT_EDITING_KEY, EDIT_SERVICELINE_SUCCESS, DELETE_SERVICELINE_SUCCESS, HANDLE_SERVICELINE_MODAL_SHOW, HANDLE_SERVICELINE_MODAL_CANCEL, SET_SERVICELINE_MODAL_ITEM, POST_SERVICELINE_SUCCESS } from "./serviceline.constants";
import { addServiceByIdSuccess, deleteServiceLineInServiceByIdSuccess, editServiceByIdSuccess } from "containers/Service/service.actions";

const key = 'updatable';

// serviceline Actions Creator
export const initiateServiceLineRequest = (value) => {
  message.loading({ content: 'Initial request...', key });
  return {
      type: INITIATE_SERVICELINE_REQUEST,
      payload: value
  };
};
export const initiateServiceLineFailure = (error) => {
  message.error({ content: 'Error!', key, duration: 2 });
  return {
      type: INITIATE_SERVICELINE_FAILURE,
      payload: error,
  };
};


// serviceline Actions Creator
export const getServiceLineByParentIdSuccess = (serviceline) => {
  message.success({ content: 'ServiceLine fetched successfully!', key, duration: 2 });
  return {
      type: GET_SERVICELINE_BY_PARENT_ID_SUCCESS,
      payload: serviceline
  };
};

export const getServiceLineByParentId = (serviceline_id) => {
  return async (dispatch)=>{
    dispatch(initiateServiceLineRequest);
    let stored_token = localStorage.getItem('token')
    let token = `Token ${stored_token}`
    axios.defaults.headers.common['Authorization'] = token
    try {
      let res = await axios.get(`${API_BASE}/api/serviceline/?parent_id=${serviceline_id}`)
      let serviceline = await res.data;
      console.log('in getServiceLineByParentId :>> ', serviceline);
      dispatch(getServiceLineByParentIdSuccess(serviceline))
      return await serviceline
    } catch (error) {
      console.error('in getServiceLineByParentId :>> ', error.message);
      dispatch(initiateServiceLineFailure(error.message))
    }
  }
}


export const servicelineEditEditingKey = (value) => {
  return {
      type: SERVICELINE_EDIT_EDITING_KEY,
      payload: value
  };
}

// editServiceLineSuccess
export const editServiceLineSuccess = (serviceline) => {
  console.log('---- editServiceLineSuccess serviceline', serviceline);
  message.success({ content: 'Service Line edited successfully!', key, duration: 2 });
  return {
      type: EDIT_SERVICELINE_SUCCESS,
      payload: serviceline,
  };
};

export const editServiceLine = (serviceline) => {

  let params = {
      "amount_paid": serviceline.amount_paid,
      "customer_id": serviceline.customer_id,
      "lookup":serviceline.lookup,
      "id": serviceline.id,
      "is_credit": serviceline.is_credit,
      "quantity": serviceline.quantity,
      "payment_method": serviceline.payment_method
  }

  let url = `${API_BASE}/api/serviceline/${params.id}/`
  // console.log('---- editServiceLine params', params, serviceline);
  return (dispatch) => {
      dispatch(initiateServiceLineRequest(params));
      let stored_token = localStorage.getItem('token')
      let token = `Token ${stored_token}`
      axios.defaults.headers.common['Authorization'] = token
      // console.log('---- editServiceLine params', params, 'Token ', token, 'url ', url);
      axios
          .put(url, params)
          .then((response) => {
              const serviceline = response.data;
              console.log('---- editServiceLine serviceline', serviceline);
              // dispatch(editServiceLineSuccess(serviceline));
              dispatch(editServiceByIdSuccess(serviceline));
          })
          .catch((error) => {
              console.error('---- editServiceLine error', error);
              const errorMsg = error.message;
              dispatch(initiateServiceLineFailure(errorMsg));
          });
  };
};


// delete service line

export const deleteServiceLineSuccess = (response) => {
  console.log('in deleteServiceLineSuccess service', response);
  message.success({ content: 'deleted successfully!', key, duration: 3 });
  return {
      type: DELETE_SERVICELINE_SUCCESS,
      payload: response,
  };
};


export const deleteServiceLine = (id) => {
  console.log('---- deleteServiceLine', id);

  let params = {
      'id': id,
  }
  let url = `${API_BASE}/api/serviceline/${params.id}/`

  return (dispatch) => {
      dispatch(initiateServiceLineRequest(id));
      let stored_token = localStorage.getItem('token')
      let token = `Token ${stored_token}`
      axios.defaults.headers.common['Authorization'] = token
      console.log('---- deleteServiceLine params', params, 'Token ', token, 'url ', url);
      axios
          .delete(url, params)
          .then((response) => {
              console.log('---- deleteServiceLine serviceline', response);
              dispatch(deleteServiceLineSuccess(id));
              dispatch(deleteServiceLineInServiceByIdSuccess(id))
          })
          .catch((error) => {
              console.error('---- deleteServiceLine error', error);
              const errorMsg = error.message;
              dispatch(initiateServiceLineFailure(errorMsg));
          });
  };
};

// ServiceLine modal
export const handleServiceLineModalShowAction = payload => ({ type: HANDLE_SERVICELINE_MODAL_SHOW, payload });
export const handleServiceLineModalCancelAction = payload => ({ type: HANDLE_SERVICELINE_MODAL_CANCEL, payload });
export const setServiceLineModalItem = payload => ({ type: SET_SERVICELINE_MODAL_ITEM, payload });


// Post ServiceLine
export const postServiceLineSuccess = (serviceline) => {
  return {
      type: POST_SERVICELINE_SUCCESS,
      payload: serviceline,
  };
};

// fetch ServiceLine
export const postServiceLine = (serviceline) => {
    let params = {
      "parent_id": serviceline.parent,
      "lookup": serviceline.lookup,
      "amount_paid": serviceline.amount_paid,
      "quantity": serviceline.quantity,
      "payment_method": serviceline.payment_method,
      "details": serviceline.detail,
      "customer_id": serviceline.customer_id,
      "is_credit": serviceline.is_credit,
  }
  return (dispatch) => {
      dispatch(initiateServiceLineRequest);
      let stored_token = localStorage.getItem('token')
      let token = `Token ${stored_token}`
      axios.defaults.headers.common['Authorization'] = token
      axios.defaults.headers.common['Content-Type'] = 'application/json'
      axios.defaults.headers.common['accept'] = 'application/json'
      console.log('postServiceLine params :>> ', params);
      axios
          .post(API_BASE+"/api/serviceline/", params)
          .then((response) => {
            const serviceline = response.data;
            dispatch(postServiceLineSuccess(serviceline));
            dispatch(addServiceByIdSuccess(serviceline));
            message.success({ content: 'ServiceLine added successfully!', key, duration: 2 });
            return serviceline
          })
          .catch((error) => {
              console.error('---- postServiceLine error', error);
              const errorMsg = error.message;
              dispatch(initiateServiceLineFailure(errorMsg));
          }).finally(()=> dispatch(handleServiceLineModalCancelAction()));
  };
};
