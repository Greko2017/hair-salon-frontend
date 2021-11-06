import {
  DELETE_DEDUCTION_SUCCESS,
  EDIT_DEDUCTION_SUCCESS,
  GET_DEDUCTION_BY_PARENT_ID_SUCCESS,
  HANDLE_DEDUCTION_MODAL_CANCEL,
  HANDLE_DEDUCTION_MODAL_SHOW,
  INITIATE_DEDUCTION_FAILURE,
  INITIATE_DEDUCTION_REQUEST,
  DEDUCTION_EDIT_EDITING_KEY,
  POST_DEDUCTION_SUCCESS,
  SET_DEDUCTION_MODAL_ITEM,
} from './deduction.constants';

const initialState = {
  loading: false,
  deductions: [],
  parent: {},
  deductions_by_parent_id: [],
  modalData: { isVisible: false, isOnCreate: true, item: false },
  editingKey: '',
  error: '',
};

const deductionReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case INITIATE_DEDUCTION_REQUEST:
      return { ...state, loading: true };
    case INITIATE_DEDUCTION_FAILURE:
      return {
        ...state,
        loading: false,
        error: payload,
      };
    case GET_DEDUCTION_BY_PARENT_ID_SUCCESS:
      return {
        ...state,
        loading: false,
        deductions_by_parent_id: payload,
        error: '',
      };

    case EDIT_DEDUCTION_SUCCESS:
      console.log('In EDIT_DEDUCTION_SUCCESS', state);
      return {
        ...state,
        loading: false,
        deduction: payload,
        error: '',
        deductions: [
          ...state.deductions.map(_deduction => {
            // console.log('in EDIT_DEDUCTION_SUCCESS', _deduction,  _deduction.id === payload.id);
            if (_deduction.id !== payload.id) return _deduction;
            return payload;
          }),
        ],
        deductions_by_parent_id: [
          ...state.deductions_by_parent_id.map(_deduction => {
            // console.log('in EDIT_DEDUCTION_SUCCESS', _deduction,  _deduction.id === payload.id);
            if (_deduction.id !== payload.id) return _deduction;
            return payload;
          }),
        ],
      };

    case DELETE_DEDUCTION_SUCCESS:
      return {
        ...state,
        loading: false,
        deductions_by_parent_id: state.deductions_by_parent_id.filter(sale => sale.id !== payload),
        deductions: state.deductions.filter(_deduction => _deduction.id !== payload),
        response: payload,
        error: '',
      };
    case DEDUCTION_EDIT_EDITING_KEY:
      return {
        ...state,
        editingKey: payload,
      };
    case POST_DEDUCTION_SUCCESS:
      console.log('POST_DEDUCTION_SUCCESS :>> ', payload);
      return {
        ...state,
        loading: false,
        deductions_by_parent_id:
          state.deductions_by_parent_id.length >= 0 ? [payload, ...state.deductions_by_parent_id] : [],
        deductions: state.deductions.length >= 0 ? [payload, ...state.deductions] : [],
      };
    case HANDLE_DEDUCTION_MODAL_SHOW:
      return { ...state, modalData: { ...state.modalData, isVisible: true, item: payload } };
    case HANDLE_DEDUCTION_MODAL_CANCEL:
      return { ...state, modalData: { ...state.modalData, isVisible: false, item: undefined } };
    case SET_DEDUCTION_MODAL_ITEM:
      return { ...state, modalData: { ...state.modalData, item: payload, isOnCreate: false } };
    default:
      return state;
  }
};

export default deductionReducer;
