import {INITIATE_SALES_FAILURE,INITIATE_SALES_REQUEST,FETCH_SALES_SUCCESS, HANDLE_SALES_MODAL_SHOW, HANDLE_SALES_MODAL_CANCEL, POST_SALES_SUCCESS, SET_SALES_MODAL_ITEM, DELETE_SALES_SUCCESS, EDIT_SALES_SUCCESS} from './sales.constants'
const initialState = {
  loading: false,
  sales: [],
  sale_result: false,
  sale_by_parent_id: [],
  modalData: { isVisible: false, isOnCreate: true, item: false },
  editingKey: '',
  error: "",
};


const saleReducer = (state = initialState, { type, payload }) => {
  switch (type) {

  case INITIATE_SALES_REQUEST:
    return { ...state, loading:true }
  case FETCH_SALES_SUCCESS:
    return {
        ...state,
        loading: false,
        sales: payload,
        error: "",
    };
  case INITIATE_SALES_FAILURE:
      return {
          ...state,
          loading: false,
          error: payload,
      };
  case POST_SALES_SUCCESS:
    console.log('POST_SALES_SUCCESS :>> ', payload);
      return {
          ...state,
          loading: false,
          sale_result: payload,
          sales: state.sales.length >= 0 ? [payload, ...state.sales] : [],
      };
  case DELETE_SALES_SUCCESS:
      return {
          ...state,
          loading: false,
          sales: state.sales.filter(sale => sale.id !== payload),
          response: payload,
          error: "",
      };
      case EDIT_SALES_SUCCESS:
        console.log('In EDIT_SALES_SUCCESS', state) ;
        return {
            ...state,
            loading: false,
            sale: payload,
            error: "",
            sales: [...state.sales.map(_sale => {
                console.log('in EDIT_SALES_SUCCESS', _sale,  _sale.id === payload.id);
                if (_sale.id !== payload.id) return _sale
                return payload
            })]
        };
    case HANDLE_SALES_MODAL_SHOW:
      console.log('In handle sale modal :>> ', payload);
        return {...state,modalData: {...state.modalData, isVisible:true, item: payload}};
    case HANDLE_SALES_MODAL_CANCEL:
        return {...state,modalData: {...state.modalData, isVisible:false, item:undefined}};
    case SET_SALES_MODAL_ITEM:
        return {...state,modalData: {...state.modalData, item: payload, isOnCreate:false}};
  default:
    return state
  }
}

export default saleReducer
