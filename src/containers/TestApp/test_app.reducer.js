import {
  EDIT_ACCOUNT_DETAILS_SUCCESS,
  EDIT_CUSTOMER_ACCOUNT_DETAILS_FAILURE,
  EDIT_CUSTOMER_ACCOUNT_DETAILS_INITIATE,
  EDIT_CUSTOMER_ACCOUNT_DETAILS_SUCCESS,
  EDIT_TEST_CUSTOMER_SUCCESS,
  FETCH_TEST_CUSTOMER_SUCCESS,
  GET_ACCOUNT_DETAILS_BY_USER_ID,
  INITIATE_TEST_CUSTOMER_FAILURE,
  INITIATE_TEST_CUSTOMER_REQUEST,
} from './test_app.constant';

const initialState = {
  loading: false,
  customers: [],
  error: '',
  account_details: {},
};

const testAppReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case INITIATE_TEST_CUSTOMER_REQUEST:
      return { ...state, loading: true };
    case FETCH_TEST_CUSTOMER_SUCCESS:
      return {
        ...state,
        loading: false,
        customers: payload,
        error: '',
      };
    case INITIATE_TEST_CUSTOMER_FAILURE:
      return {
        ...state,
        loading: false,
        error: payload,
      };
    case EDIT_TEST_CUSTOMER_SUCCESS:
      console.log('In EDIT_TEST_CUSTOMER_SUCCESS', state);
      return {
        ...state,
        loading: false,
        customer: payload,
        error: '',
        customers: [
          ...state.customer.map(_account_details => {
            console.log('in EDIT_TEST_CUSTOMER_SUCCESS', _account_details, _account_details.id === payload.id);
            if (_account_details.id !== payload.id) return _account_details;
            return payload;
          }),
        ],
      };
    case EDIT_ACCOUNT_DETAILS_SUCCESS:
      console.log('In EDIT_ACCOUNT_DETAILS_SUCCESS', state);
      return {
        ...state,
        loading: false,
        account_details: payload,
        error: '',
      };
    case GET_ACCOUNT_DETAILS_BY_USER_ID:
      console.log('In FETCH_ACCOUNT_DETAILS_SUCCESS', state);
      return {
        ...state,
        loading: false,
        account_details: payload,
        error: '',
      };

    case EDIT_CUSTOMER_ACCOUNT_DETAILS_INITIATE:
      return { ...state, loading: true };
    case EDIT_CUSTOMER_ACCOUNT_DETAILS_SUCCESS:
      return {
        ...state,
        loading: false,
        customers: [
          ...state.customers?.map(_account_details => {
            console.log('in EDIT_TEST_CUSTOMER_SUCCESS', _account_details, _account_details.id === payload.id);
            if (_account_details.id !== payload.id) return _account_details;
            return payload;
          }),
        ],
        error: '',
      };
    case EDIT_CUSTOMER_ACCOUNT_DETAILS_FAILURE:
      return {
        ...state,
        loading: false,
        error: payload,
      };
    default:
      return state;
  }
};

export default testAppReducer;
