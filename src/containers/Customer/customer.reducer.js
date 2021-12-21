import {
  INITIATE_CUSTOMER_FAILURE,
  INITIATE_CUSTOMER_REQUEST,
  FETCH_CUSTOMER_SUCCESS,
  HANDLE_CUSTOMER_MODAL_SHOW,
  HANDLE_CUSTOMER_MODAL_CANCEL,
  POST_CUSTOMER_SUCCESS,
  SET_CUSTOMER_MODAL_ITEM,
  DELETE_CUSTOMER_SUCCESS,
  EDIT_CUSTOMER_SUCCESS,
} from './customer.constants';
const initialState = {
  loading: false,
  customers: [],
  customer_result: false,
  customer_by_parent_id: [],
  modalData: { isVisible: false, isOnCreate: true, item: false },
  editingKey: '',
  error: '',
};

const customerReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case INITIATE_CUSTOMER_REQUEST:
      return { ...state, loading: true };
    case FETCH_CUSTOMER_SUCCESS:
      return {
        ...state,
        loading: false,
        customers: payload,
        error: '',
      };
    case INITIATE_CUSTOMER_FAILURE:
      return {
        ...state,
        loading: false,
        error: payload,
      };
    case POST_CUSTOMER_SUCCESS:
      console.log('POST_CUSTOMER_SUCCESS :>> ', payload);
      return {
        ...state,
        loading: false,
        customer_result: payload,
        customers: state.customers.length >= 0 ? [payload, ...state.customers] : [],
      };
    case EDIT_CUSTOMER_SUCCESS:
      console.log('In EDIT_CUSTOMER_SUCCESS', state);
      return {
        ...state,
        loading: false,
        sale: payload,
        error: '',
        customers: [
          ...state.customers.map(_customer => {
            console.log('in EDIT_CUSTOMER_SUCCESS', _customer, _customer.id === payload.id);
            if (_customer.id !== payload.id) return _customer;
            return payload;
          }),
        ],
      };
    case DELETE_CUSTOMER_SUCCESS:
      return {
        ...state,
        loading: false,
        customers: state.customers.filter(customer => customer.id !== payload),
        response: payload,
        error: '',
      };
    case HANDLE_CUSTOMER_MODAL_SHOW:
      console.log('In handle customer modal :>> ', payload);
      return { ...state, modalData: { ...state.modalData, isVisible: true, item: payload } };
    case HANDLE_CUSTOMER_MODAL_CANCEL:
      return { ...state, modalData: { ...state.modalData, isVisible: false, item: undefined } };
    case SET_CUSTOMER_MODAL_ITEM:
      return { ...state, modalData: { ...state.modalData, item: payload, isOnCreate: false } };
    default:
      return state;
  }
};

export default customerReducer;
