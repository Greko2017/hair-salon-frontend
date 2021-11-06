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
const initialState = {
  loading: false,
  products: [],
  parent: {},
  product_result: false,
  product_by_parent_id: [],
  modalData: { isVisible: false, isOnCreate: true, item: false },
  editingKey: '',
  error: '',
};

const productReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case INITIATE_PRODUCT_REQUEST:
      return { ...state, loading: true };
    case FETCH_PRODUCT_SUCCESS:
      return {
        ...state,
        loading: false,
        products: payload,
        error: '',
      };
    case INITIATE_PRODUCT_FAILURE:
      return {
        ...state,
        loading: false,
        error: payload,
      };
    case POST_PRODUCT_SUCCESS:
      console.log('POST_PRODUCT_SUCCESS :>> ', payload);
      return {
        ...state,
        loading: false,
        product_result: payload,
        products: state.products.length >= 0 ? [payload, ...state.products] : [],
      };
    case EDIT_PRODUCT_SUCCESS:
      console.log('In EDIT_PRODUCT_SUCCESS', state);
      return {
        ...state,
        loading: false,
        product: payload,
        error: '',
        products: [
          ...state.products.map(_product => {
            console.log('in EDIT_PRODUCT_SUCCESS', _product, _product.id === payload.id);
            if (_product.id !== payload.id) return _product;
            return payload;
          }),
        ],
        parent: (() => {
          if (state.parent.id === payload.id) {
            return payload;
          }
          return state.parent;
        })(),
      };
    case DELETE_PRODUCT_SUCCESS:
      return {
        ...state,
        loading: false,
        products: state.products.filter(product => product.id !== payload),
        response: payload,
        error: '',
      };
    case GET_PRODUCT_BY_ID_SUCCESS:
      return {
        ...state,
        loading: false,
        parent: payload,
        error: '',
      };
    case HANDLE_PRODUCT_MODAL_SHOW:
      console.log('In handle Payroll modal :>> ', payload);
      return { ...state, modalData: { ...state.modalData, isVisible: true, item: payload } };
    case HANDLE_PRODUCT_MODAL_CANCEL:
      return { ...state, modalData: { ...state.modalData, isVisible: false, item: undefined } };
    case SET_PRODUCT_MODAL_ITEM:
      return { ...state, modalData: { ...state.modalData, item: payload, isOnCreate: false } };
    default:
      return state;
  }
};

export default productReducer;
