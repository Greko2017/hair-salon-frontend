import {
  EDIT_PAYROLL_SUCCESS,
  FETCH_PAYROLL_SUCCESS,
  GET_PAYROLL_BY_ID_SUCCESS,
  HANDLE_PAYROLL_MODAL_CANCEL,
  HANDLE_PAYROLL_MODAL_SHOW,
  INITIATE_PAYROLL_FAILURE,
  INITIATE_PAYROLL_REQUEST,
  POST_PAYROLL_SUCCESS,
  SET_PAYROLL_MODAL_ITEM,
} from './payroll.constants';
const initialState = {
  loading: false,
  payrolls: [],
  parent: {},
  payroll_result: false,
  payroll_by_parent_id: [],
  modalData: { isVisible: false, isOnCreate: true, item: false },
  editingKey: '',
  error: '',
};

const payrollReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case INITIATE_PAYROLL_REQUEST:
      return { ...state, loading: true };
    case FETCH_PAYROLL_SUCCESS:
      return {
        ...state,
        loading: false,
        payrolls: payload,
        error: '',
      };
    case INITIATE_PAYROLL_FAILURE:
      return {
        ...state,
        loading: false,
        error: payload,
      };
    case POST_PAYROLL_SUCCESS:
      console.log('POST_PAYROLL_SUCCESS :>> ', payload);
      return {
        ...state,
        loading: false,
        payroll_result: payload,
        payrolls: state.payrolls.length >= 0 ? [payload, ...state.payrolls] : [],
      };
    case EDIT_PAYROLL_SUCCESS:
      console.log('In EDIT_PAYROLL_SUCCESS', state);
      return {
        ...state,
        loading: false,
        payroll: payload,
        error: '',
        payrolls: [
          ...state.payrolls.map(_payroll => {
            console.log('in EDIT_PAYROLL_SUCCESS', _payroll, _payroll.id === payload.id);
            if (_payroll.id !== payload.id) return _payroll;
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
    case GET_PAYROLL_BY_ID_SUCCESS:
      return {
        ...state,
        loading: false,
        parent: payload,
        error: '',
      };
    case HANDLE_PAYROLL_MODAL_SHOW:
      console.log('In handle Payroll modal :>> ', payload);
      return { ...state, modalData: { ...state.modalData, isVisible: true, item: payload } };
    case HANDLE_PAYROLL_MODAL_CANCEL:
      return { ...state, modalData: { ...state.modalData, isVisible: false, item: undefined } };
    case SET_PAYROLL_MODAL_ITEM:
      return { ...state, modalData: { ...state.modalData, item: payload, isOnCreate: false } };
    default:
      return state;
  }
};

export default payrollReducer;
