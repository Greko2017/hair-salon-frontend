import {
  DELETE_CATEGORY_SUCCESS,
  EDIT_CATEGORY_SUCCESS,
  FETCH_CATEGORY_SUCCESS,
  GET_CATEGORY_BY_ID_SUCCESS,
  HANDLE_CATEGORY_MODAL_CANCEL,
  HANDLE_CATEGORY_MODAL_SHOW,
  INITIATE_CATEGORY_FAILURE,
  INITIATE_CATEGORY_REQUEST,
  POST_CATEGORY_SUCCESS,
  SET_CATEGORY_MODAL_ITEM,
} from './category.constants';
const initialState = {
  loading: false,
  categories: [],
  parent: {},
  category_result: false,
  category_by_parent_id: [],
  modalData: { isVisible: false, isOnCreate: true, item: false },
  editingKey: '',
  error: '',
};

const categoryReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case INITIATE_CATEGORY_REQUEST:
      return { ...state, loading: true };
    case FETCH_CATEGORY_SUCCESS:
      return {
        ...state,
        loading: false,
        categories: payload,
        error: '',
      };
    case INITIATE_CATEGORY_FAILURE:
      return {
        ...state,
        loading: false,
        error: payload,
      };
    case POST_CATEGORY_SUCCESS:
      // console.log('POST_CATEGORY_SUCCESS :>> ', payload);
      return {
        ...state,
        loading: false,
        category_result: payload,
        categories: state.categories.length >= 0 ? [payload, ...state.categories] : [],
      };
    case EDIT_CATEGORY_SUCCESS:
      // console.log('In EDIT_CATEGORY_SUCCESS', state);
      return {
        ...state,
        loading: false,
        category: payload,
        error: '',
        categories: [
          ...state.categories.map(_category => {
            // console.log('in EDIT_CATEGORY_SUCCESS', _category, _category.id === payload.id);
            if (_category.id !== payload.id) return _category;
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
    case DELETE_CATEGORY_SUCCESS:
      return {
        ...state,
        loading: false,
        categories: state.categories.filter(category => category.id !== payload),
        response: payload,
        error: '',
      };
    case GET_CATEGORY_BY_ID_SUCCESS:
      return {
        ...state,
        loading: false,
        parent: payload,
        error: '',
      };
    case HANDLE_CATEGORY_MODAL_SHOW:
      // console.log('In handle Payroll modal :>> ', payload);
      return { ...state, modalData: { ...state.modalData, isVisible: true, item: payload } };
    case HANDLE_CATEGORY_MODAL_CANCEL:
      return { ...state, modalData: { ...state.modalData, isVisible: false, item: undefined } };
    case SET_CATEGORY_MODAL_ITEM:
      return { ...state, modalData: { ...state.modalData, item: payload, isOnCreate: false } };
    default:
      return state;
  }
};

export default categoryReducer;
