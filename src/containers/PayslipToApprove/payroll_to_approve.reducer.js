import {
  EDIT_PAYROLL_TO_APPROVE_SUCCESS,
  FETCH_PAYROLL_TO_APPROVE_SUCCESS,
  GET_PAYROLL_TO_APPROVE_BY_ID_SUCCESS,
  HANDLE_PAYROLL_TO_APPROVE_MODAL_CANCEL,
  HANDLE_PAYROLL_TO_APPROVE_MODAL_SHOW,
  INITIATE_PAYROLL_TO_APPROVE_FAILURE,
  INITIATE_PAYROLL_TO_APPROVE_REQUEST,
  POST_PAYROLL_TO_APPROVE_SUCCESS,
  SET_PAYROLL_TO_APPROVE_MODAL_ITEM,
  SET_PAYROLL_TO_APPROVE,
} from './payroll_to_approve.constants';
const initialState = {
  loading: false,
  payrolls: [],
  parent: {},
  payroll_result: false,
  payroll_by_parent_id: [],
  modalData: { isVisible: false, isOnCreate: true, item: false },
  editingKey: '',
  error: '',
  permissions: { to_approve: false, evaluated: false },
};

const payrollToApproveReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case INITIATE_PAYROLL_TO_APPROVE_REQUEST:
      return { ...state, loading: true };
    case FETCH_PAYROLL_TO_APPROVE_SUCCESS:
      return {
        ...state,
        loading: false,
        payrolls: payload,
        error: '',
      };
    case INITIATE_PAYROLL_TO_APPROVE_FAILURE:
      return {
        ...state,
        loading: false,
        error: payload,
      };
    case POST_PAYROLL_TO_APPROVE_SUCCESS:
      // console.log('POST_PAYROLL_TO_APPROVE_SUCCESS :>> ', payload);
      return {
        ...state,
        loading: false,
        payroll_result: payload,
        payrolls: state.payrolls.length >= 0 ? [payload, ...state.payrolls] : [],
      };
    case EDIT_PAYROLL_TO_APPROVE_SUCCESS:
      // console.log('In EDIT_PAYROLL_TO_APPROVE_SUCCESS', state);
      return {
        ...state,
        loading: false,
        payroll: payload,
        error: '',
        payrolls: [
          ...state.payrolls.map(_payroll => {
            // console.log('in EDIT_PAYROLL_TO_APPROVE_SUCCESS', _payroll, _payroll.id === payload.id);
            if (_payroll.id !== payload.id) return _payroll;
            return payload;
          }),
        ],
      };
    case GET_PAYROLL_TO_APPROVE_BY_ID_SUCCESS:
      return {
        ...state,
        loading: false,
        parent: payload,
        error: '',
      };
    case HANDLE_PAYROLL_TO_APPROVE_MODAL_SHOW:
      return { ...state, modalData: { ...state.modalData, isVisible: true, item: payload } };
    case HANDLE_PAYROLL_TO_APPROVE_MODAL_CANCEL:
      return { ...state, modalData: { ...state.modalData, isVisible: false, item: undefined } };
    case SET_PAYROLL_TO_APPROVE_MODAL_ITEM:
      return { ...state, modalData: { ...state.modalData, item: payload, isOnCreate: false } };
    case SET_PAYROLL_TO_APPROVE:
      // console.log('In SET_PAYROLL_TO_APPROVE :>> ', payload);
      if (payload === false) {
        return { ...state, permissions: { ...state.permissions, to_approve: false, evaluated: false } };
      }
      return { ...state, permissions: { ...state.permissions, to_approve: payload, evaluated: true } };
    default:
      return state;
  }
};

export default payrollToApproveReducer;
