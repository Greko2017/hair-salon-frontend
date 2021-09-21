import {INITIATE_SERVICE_FAILURE,INITIATE_SERVICE_REQUEST,FETCH_SERVICE_SUCCESS,EDIT_SERVICE_SUCCESS, HANDLE_SERVICE_MODAL_SHOW, HANDLE_SERVICE_MODAL_CANCEL, POST_SERVICE_SUCCESS, SET_SERVICE_MODAL_ITEM, DELETE_SERVICE_SUCCESS, GET_SERVICE_BY_ID_SUCCESS, FETCH_SERVICE_NAME_LOOKUP_SUCCESS, EDIT_SERVICE_BY_ID_SUCCESS, DELETE_SERVICELINE_IN_SERVICE_BY_ID_SUCCESS, ADD_SERVICELINE_IN_SERVICE_BY_ID_SUCCESS} from './service.constants'

import axios from "axios";
import { API_BASE } from '../../env';
import { message } from 'antd';

const key = 'updatable';

// service Actions Creator
export const initiateServiceRequest = (value) => {
  message.loading({ content: 'Initial request...', key });
  return {
      type: INITIATE_SERVICE_REQUEST,
      payload: value
  };
};
export const initiateServiceFailure = (error) => {
  message.error({ content: 'Error!', key, duration: 2 });
  return {
      type: INITIATE_SERVICE_FAILURE,
      payload: error,
  };
};


// service Actions Creator
export const fetchServiceSuccess = (services) => {
  message.success({ content: 'Service fetched successfully!', key, duration: 2 });
  return {
      type: FETCH_SERVICE_SUCCESS,
      payload: services
  };
};

// service lookup Actions Creator
export const fetchServiceNameLookUpSuccess = (service_names) => {
  // message.success({ content: 'Service Name !', key, duration: 2 });
  return {
      type: FETCH_SERVICE_NAME_LOOKUP_SUCCESS,
      payload: service_names
  };
};


// fetch Service Name LookUp
export const fetchServiceNameLookUp = () => {
  return (dispatch) => {
      dispatch(initiateServiceRequest);
      let stored_token = localStorage.getItem('token')
      let token = `Token ${stored_token}`
      axios.defaults.headers.common['Authorization'] = token
      axios
          .get(API_BASE+"/api/service_lookup/")
          .then((response) => {
              const service_names = response.data;
              // console.log('---- fetchServiceNameLookUp service_names', service_names);
              dispatch(fetchServiceNameLookUpSuccess(service_names));
          })
          .catch((error) => {
              // console.error('---- fetchServiceNameLookUp error', error);
              const errorMsg = error.message;
              dispatch(initiateServiceFailure(errorMsg));
          });
  };
};

// fetch Service
export const fetchServices = () => {
  // console.log('---- fetchServices');
  return (dispatch) => {
      dispatch(initiateServiceRequest);
      let stored_token = localStorage.getItem('token')
      let token = `Token ${stored_token}`
      axios.defaults.headers.common['Authorization'] = token
      axios
          .get(API_BASE+"/api/service/")
          .then((response) => {
              const services = response.data;
              // console.log('---- fetchServices services', services);
              dispatch(fetchServiceSuccess(services));
          })
          .catch((error) => {
              // console.error('---- fetchServices error', error);
              const errorMsg = error.message;
              dispatch(initiateServiceFailure(errorMsg));
          });
  };
};

// editServiceSuccess
export const editServiceSuccess = (service) => {
    message.success({ content: 'Service edited successfully!', key, duration: 2 });
    return {
        type: EDIT_SERVICE_SUCCESS || 'EDIT_SERVICE_SUCCESS',
        payload: service,
    };
};

export const handleServiceModalShowAction = payload => ({ type: HANDLE_SERVICE_MODAL_SHOW, payload });
export const handleServiceModalCancelAction = payload => ({ type: HANDLE_SERVICE_MODAL_CANCEL, payload });
export const setServiceModalItem = payload => ({ type: SET_SERVICE_MODAL_ITEM, payload });

// Post Service
export const postServiceSuccess = (service) => {
  return {
      type: POST_SERVICE_SUCCESS,
      payload: service,
  };
};

// post Service
export const postService = (service) => {
  let _name = computeServiceName()
    let params = {
      "name": _name,
      "employee_id": service.worker,
      "salary_id": service.salary
  }
  return (dispatch) => {
      dispatch(initiateServiceRequest);
      let stored_token = localStorage.getItem('token')
      let token = `Token ${stored_token}`
      console.log('token :>> ', token);
      axios.defaults.headers.common['Authorization'] = token
      axios.defaults.headers.common['Content-Type'] = 'application/json'
      axios.defaults.headers.common['accept'] = 'application/json'
      console.log('postService params :>> ', params);
      axios
          .post(API_BASE+"/api/service/", params)
          .then((response) => {
            const service = response.data;
            dispatch(postServiceSuccess(service));
            message.success({ content: 'Service added successfully!', key, duration: 2 });
            return service
          })
          .catch((error) => {
              console.error('---- postService error', error);
              const errorMsg = error.message;
              dispatch(initiateServiceFailure(errorMsg));
          }).finally(()=> dispatch(handleServiceModalCancelAction()));
  };
};

export const editService = (service) => {
  console.log('---- editService', service);

  let params = {
      'id': service.id,
      "name": service.name,
      "employee_id": service.worker,
      "salary_id": service.salary
  }
  let url = `${API_BASE}/api/service/${params.id}/`

  return (dispatch) => {
      dispatch(initiateServiceRequest(service));
      let stored_token = localStorage.getItem('token')
      let token = `Token ${stored_token}`
      axios.defaults.headers.common['Authorization'] = token
      // console.log('---- editService params', params, 'Token ', token, 'url ', url);
      axios
          .put(url, params)
          .then((response) => {
              const service = response.data;
              console.log('---- editService service', service);
              dispatch(editServiceSuccess(service));
          })
          .catch((error) => {
              console.error('---- initiateServiceFailure error', error);
              const errorMsg = error.message;
              dispatch(initiateServiceFailure(errorMsg));
          }).finally(()=> dispatch(handleServiceModalCancelAction()));
  };
};

export const deleteServiceSuccess = (response) => {
  // console.log('in deleteServiceSuccess service', response);
  message.success({ content: 'deleted successfully!', key, duration: 3 });
  return {
      type: DELETE_SERVICE_SUCCESS,
      payload: response,
  };
};

export const deleteService = (id) => {
  let params = {
      'id': id,
  }
  let url = `${API_BASE}/api/service/${params.id}/`

  return (dispatch) => {
      dispatch(initiateServiceRequest(id));
      let stored_token = localStorage.getItem('token')
      let token = `Token ${stored_token}`
      axios.defaults.headers.common['Authorization'] = token
      console.log('---- deleteService params', params, 'Token ', token, 'url ', url);
      axios
          .delete(url, params)
          .then((response) => {
              console.log('---- deleteService service', response);
              dispatch(deleteServiceSuccess(id));
          })
          .catch((error) => {
              console.error('---- deleteService error', error);
              const errorMsg = error.message;
              dispatch(initiateServiceFailure(errorMsg));
          });
  };
};

// serviceline Actions Creator
export const getServiceByIdSuccess = (service) => {
  message.success({ content: 'Service fetched successfully!', key, duration: 2 });
  return {
      type: GET_SERVICE_BY_ID_SUCCESS,
      payload: service
  };
};

// serviceline Actions Creator
export const editServiceByIdSuccess = (serviceline) => {
  message.success({ content: 'Service edited successfully!', key, duration: 2 });
  return {
      type: EDIT_SERVICE_BY_ID_SUCCESS,
      payload: serviceline
  };
};

// serviceline Actions Creator
export const addServiceByIdSuccess = (serviceline) => {
  message.success({ content: 'Service added successfully!', key, duration: 2 });
  return {
      type: ADD_SERVICELINE_IN_SERVICE_BY_ID_SUCCESS,
      payload: serviceline
  };
};

// delete serviceline Actions Creator
export const deleteServiceLineInServiceByIdSuccess = (serviceline_id) => {
  message.success({ content: 'ServiceLine deleted successfully!', key, duration: 2 });
  return {
      type: DELETE_SERVICELINE_IN_SERVICE_BY_ID_SUCCESS,
      payload: serviceline_id
  };
};

export const getServiceByParentId = (service_id) => {
  return async (dispatch)=>{
    dispatch(initiateServiceRequest);
    let stored_token = localStorage.getItem('token')
    let token = `Token ${stored_token}`
    axios.defaults.headers.common['Authorization'] = token
    try {
      let res = await axios.get(`${API_BASE}/api/service/${service_id}/`)
      let service = await res.data;
      dispatch(getServiceByIdSuccess(service))
      return await service
    } catch (error) {
      dispatch(initiateServiceFailure(error.message))
    }
  }
}


function computeServiceName(){
  let now = new window.Date();
  let year = now.getFullYear()
  let month = now.getMonth()
  let date = now.getDate()
  let hours = now.getHours()
  let minutes = now.getMinutes()
  let seconds = now.getSeconds()
  return `SERVICE_${year}${month<=9 ? `0${month+1}` : month+1 }${date>=9 ? `0${date+1}` : date}${hours}${minutes}${seconds}`
}
