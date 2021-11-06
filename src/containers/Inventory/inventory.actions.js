import axios from 'axios';
import { API_BASE } from '../../env';
import { message } from 'antd';
import {
  DELETE_INVENTORY_SUCCESS,
  EDIT_INVENTORY_SUCCESS,
  FETCH_INVENTORY_SUCCESS,
  GET_INVENTORY_BY_ID_SUCCESS,
  HANDLE_INVENTORY_MODAL_CANCEL,
  HANDLE_INVENTORY_MODAL_SHOW,
  INITIATE_INVENTORY_FAILURE,
  INITIATE_INVENTORY_REQUEST,
  POST_INVENTORY_SUCCESS,
  SET_INVENTORY_MODAL_ITEM,
} from './inventory.constants';

const key = 'updatable';
// inventory Actions Creator
export const initiateInventoryRequest = value => {
  message.loading({ content: 'Initial request...', key });
  return {
    type: INITIATE_INVENTORY_REQUEST,
    payload: value,
  };
};
export const initiateInventoryFailure = error => {
  message.error({ content: 'Error!', key, duration: 2 });
  return {
    type: INITIATE_INVENTORY_FAILURE,
    payload: error,
  };
};

// inventory Actions Creator
export const fetchInventorySuccess = inventories => {
  message.success({ content: 'Inventory fetched successfully!', key, duration: 2 });
  return {
    type: FETCH_INVENTORY_SUCCESS,
    payload: inventories,
  };
};

// fetch Inventory
export const fetchInventories = () => {
  // console.log('---- fetchInventories');
  return dispatch => {
    dispatch(initiateInventoryRequest);
    let stored_token = localStorage.getItem('token');
    let token = `Token ${stored_token}`;
    axios.defaults.headers.common['Authorization'] = token;
    axios
      .get(API_BASE + '/api/inventory/')
      .then(response => {
        const inventories = response.data;
        // console.log('---- fetchInventories inventories', inventories);
        dispatch(fetchInventorySuccess(inventories));
      })
      .catch(error => {
        // console.error('---- fetchInventories error', error);
        const errorMsg = error.message;
        dispatch(initiateInventoryFailure(errorMsg));
      });
  };
};

// Post Inventory
export const postInventorySuccess = inventory => {
  return {
    type: POST_INVENTORY_SUCCESS,
    payload: inventory,
  };
};

// fetch Inventory
export const postInventory = inventory => {
  let _name = computeInventoryName();
  let params = {
    name: _name,
    product: inventory.product,
    quantity: inventory.quantity,
  };
  if (inventory.status) {
    params.status = inventory.status;
  }
  return dispatch => {
    dispatch(initiateInventoryRequest);
    let stored_token = localStorage.getItem('token');
    let token = `Token ${stored_token}`;
    console.log('token :>> ', token);
    axios.defaults.headers.common['Authorization'] = token;
    console.log('postInventory params :>> ', params);
    axios
      .post(API_BASE + '/api/inventory/', params)
      .then(response => {
        const inventory = response.data;
        dispatch(postInventorySuccess(inventory));
        message.success({ content: 'Inventory added successfully!', key, duration: 2 });
        return inventory;
      })
      .catch(error => {
        console.error('---- postInventory error', error);
        const errorMsg = error.message;
        dispatch(initiateInventoryFailure(errorMsg));
      })
      .finally(() => dispatch(handleInventoryModalCancelAction()));
  };
};

// editInventorySuccess
export const editInventorySuccess = inventory => {
  message.success({ content: 'Inventory edited successfully!', key, duration: 2 });
  return {
    type: EDIT_INVENTORY_SUCCESS,
    payload: inventory,
  };
};
export const editInventory = inventory => {
  console.log('---- editInventory', inventory);
  let params = {
    id: inventory.id,
    product: inventory.product,
    quantity: inventory.quantity,
  };
  if (inventory.status) {
    params.status = inventory.status;
  }
  let url = `${API_BASE}/api/inventory/${params.id}/`;

  return dispatch => {
    dispatch(initiateInventoryRequest(inventory));
    let stored_token = localStorage.getItem('token');
    let token = `Token ${stored_token}`;
    axios.defaults.headers.common['Authorization'] = token;
    console.log('---- editInventory params', params, 'Token ', token, 'url ', url);
    axios
      .put(url, params)
      .then(response => {
        const inventory = response.data;
        console.log('---- editInventory inventory', inventory);
        dispatch(editInventorySuccess(inventory));
      })
      .catch(error => {
        console.error('---- initiateInventoryFailure error', error);
        const errorMsg = error.message;
        dispatch(initiateInventoryFailure(errorMsg));
      })
      .finally(() => dispatch(handleInventoryModalCancelAction()));
  };
};

// Modal
export const handleInventoryModalShowAction = payload => ({ type: HANDLE_INVENTORY_MODAL_SHOW, payload });
export const handleInventoryModalCancelAction = payload => ({ type: HANDLE_INVENTORY_MODAL_CANCEL, payload });
export const setInventoryModalItem = payload => ({ type: SET_INVENTORY_MODAL_ITEM, payload });

// inventory Actions Creator
export const getInventoryByIdSuccess = inventory => {
  message.success({ content: 'Inventory fetched successfully!', key, duration: 2 });
  return {
    type: GET_INVENTORY_BY_ID_SUCCESS,
    payload: inventory,
  };
};

export const getInventoryById = inventory_id => {
  return async dispatch => {
    dispatch(initiateInventoryRequest);
    let stored_token = localStorage.getItem('token');
    let token = `Token ${stored_token}`;
    axios.defaults.headers.common['Authorization'] = token;
    try {
      let res = await axios.get(`${API_BASE}/api/inventory/${inventory_id}`);
      let inventory = await res.data;
      // console.log('in getInventoryById :>> ', inventory);
      dispatch(getInventoryByIdSuccess(inventory));
      return await inventory;
    } catch (error) {
      console.error('in getInventoryById :>> ', error.message);
      dispatch(initiateInventoryFailure(error.message));
    }
  };
};

export const deleteInventorySuccess = response => {
  // console.log('in deleteInventorySuccess inventory', response);
  message.success({ content: 'deleted successfully!', key, duration: 3 });
  return {
    type: DELETE_INVENTORY_SUCCESS,
    payload: response,
  };
};

export const deleteInventory = id => {
  let params = {
    id: id,
  };
  let url = `${API_BASE}/api/inventory/${params.id}/`;

  return dispatch => {
    dispatch(initiateInventoryRequest(id));
    let stored_token = localStorage.getItem('token');
    let token = `Token ${stored_token}`;
    axios.defaults.headers.common['Authorization'] = token;
    console.log('---- deleteInventory params', params, 'Token ', token, 'url ', url);
    axios
      .delete(url, params)
      .then(response => {
        console.log('---- deleteInventory inventory', response);
        dispatch(deleteInventorySuccess(id));
      })
      .catch(error => {
        console.error('---- deleteInventory error', error);
        const errorMsg = error.message;
        dispatch(initiateInventoryFailure(errorMsg));
      });
  };
};

function computeInventoryName() {
  let now = new window.Date();
  let year = now.getFullYear();
  let month = now.getMonth();
  let date = now.getDate();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  let seconds = now.getSeconds();
  return `INV_${year}${month <= 9 ? `0${month + 1}` : month + 1}${
    date >= 9 ? `0${date + 1}` : date
  }${hours}${minutes}${seconds}`;
}
