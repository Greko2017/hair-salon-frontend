import {INITIATE_SALESLINE_FAILURE,INITIATE_SALESLINE_REQUEST,FETCH_SALESLINE_SUCCESS, HANDLE_SALESLINE_MODAL_SHOW, HANDLE_SALESLINE_MODAL_CANCEL, POST_SALESLINE_SUCCESS, SET_SALESLINE_MODAL_ITEM, EDIT_SALESLINE_SUCCESS, FETCH_SALESLINE_NAME_LOOKUP_SUCCESS, ADD_SERVICELINE_IN_SALESLINE_BY_ID_SUCCESS} from './salesline.constants'
const initialState = {
  loading: false,
  saleslines: [],
  salesline_result: false,
  salesline_names: [],
  salesline_by_id: {saleslinelines:[]},
  modalData: { isVisible: false, isOnCreate: true, item: false },
  editingKey: '',
  error: "",
};


const saleslineReducer = (state = initialState, { type, payload }) => {
  switch (type) {

  case INITIATE_SALESLINE_REQUEST:
    return { ...state, loading:true }
  case FETCH_SALESLINE_SUCCESS:
    return {
        ...state,
        loading: false,
        saleslines: payload,
        error: "",
    };
  case INITIATE_SALESLINE_FAILURE:
      return {
          ...state,
          loading: false,
          error: payload,
      };
  case POST_SALESLINE_SUCCESS:
    console.log('POST_SALESLINE_SUCCESS :>> ', payload);
      return {
          ...state,
          loading: false,
          salesline_result: payload,
          saleslines: state.saleslines.length >= 0 ? [payload, ...state.saleslines] : [],
      };
  case EDIT_SALESLINE_SUCCESS:
    console.log('In EDIT_SALESLINE_SUCCESS', state) ;
    return {
        ...state,
        loading: false,
        salesline: payload,
        error: "",
        saleslines: [...state.saleslines.map(_salesline => {
            console.log('in EDIT_SALESLINE_SUCCESS', _salesline,  _salesline.id === payload.id);
            if (_salesline.id !== payload.id) return _salesline
            return payload
        })]
    };
  case HANDLE_SALESLINE_MODAL_SHOW:
  console.log('In handle salesline modal :>> ', payload);
    return {...state,modalData: {...state.modalData, isVisible:true, item: payload}};
  case HANDLE_SALESLINE_MODAL_CANCEL:
    return {...state,modalData: {...state.modalData, isVisible:false, item:undefined}};
  case SET_SALESLINE_MODAL_ITEM:
    return {...state,modalData: {...state.modalData, item: payload, isOnCreate:false}};
    default:
    return state
  }
}

export default saleslineReducer
