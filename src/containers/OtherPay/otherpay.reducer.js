import {
  DELETE_OTHER_PAYS_SUCCESS,
  EDIT_OTHER_PAYS_SUCCESS,
  GET_OTHER_PAYS_BY_PARENT_ID_SUCCESS,
  HANDLE_OTHER_PAYS_MODAL_CANCEL,
  HANDLE_OTHER_PAYS_MODAL_SHOW,
  INITIATE_OTHER_PAYS_FAILURE,
  INITIATE_OTHER_PAYS_REQUEST,
  OTHER_PAYS_EDIT_EDITING_KEY,
  POST_OTHER_PAYS_SUCCESS,
  SET_OTHER_PAYS_MODAL_ITEM,
} from './otherpay.constants';

const initialState = {
  loading: false,
  other_pays: [],
  parent: {},
  other_pays_by_parent_id: [],
  modalData: { isVisible: false, isOnCreate: true, item: false },
  editingKey: '',
  error: '',
};

const otherPaysReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case INITIATE_OTHER_PAYS_REQUEST:
      return { ...state, loading: true };
    case INITIATE_OTHER_PAYS_FAILURE:
      return {
        ...state,
        loading: false,
        error: payload,
      };
    case GET_OTHER_PAYS_BY_PARENT_ID_SUCCESS:
      return {
        ...state,
        loading: false,
        other_pays_by_parent_id: payload,
        error: '',
      };

    case EDIT_OTHER_PAYS_SUCCESS:
      console.log('In EDIT_OTHER_PAYS_SUCCESS', state);
      return {
        ...state,
        loading: false,
        other_pay: payload,
        error: '',
        other_pays: [
          ...state.other_pays.map(_other_pay => {
            // console.log('in EDIT_OTHER_PAYS_SUCCESS', _other_pay,  _other_pay.id === payload.id);
            if (_other_pay.id !== payload.id) return _other_pay;
            return payload;
          }),
        ],
        other_pays_by_parent_id: [
          ...state.other_pays_by_parent_id.map(_other_pay => {
            // console.log('in EDIT_OTHER_PAYS_SUCCESS', _other_pay,  _other_pay.id === payload.id);
            if (_other_pay.id !== payload.id) return _other_pay;
            return payload;
          }),
        ],
      };

    case DELETE_OTHER_PAYS_SUCCESS:
      return {
        ...state,
        loading: false,
        other_pays_by_parent_id: state.other_pays_by_parent_id.filter(_other_pay => _other_pay.id !== payload),
        other_pays: state.other_pays.filter(_other_pay => _other_pay.id !== payload),
        response: payload,
        error: '',
      };
    case OTHER_PAYS_EDIT_EDITING_KEY:
      return {
        ...state,
        editingKey: payload,
      };
    case POST_OTHER_PAYS_SUCCESS:
      console.log('POST_OTHER_PAYS_SUCCESS :>> ', payload);
      return {
        ...state,
        loading: false,
        other_pays_by_parent_id:
          state.other_pays_by_parent_id.length >= 0 ? [payload, ...state.other_pays_by_parent_id] : [],
        other_pays: state.other_pays.length >= 0 ? [payload, ...state.other_pays] : [],
      };
    case HANDLE_OTHER_PAYS_MODAL_SHOW:
      return { ...state, modalData: { ...state.modalData, isVisible: true, item: payload } };
    case HANDLE_OTHER_PAYS_MODAL_CANCEL:
      return { ...state, modalData: { ...state.modalData, isVisible: false, item: undefined } };
    case SET_OTHER_PAYS_MODAL_ITEM:
      return { ...state, modalData: { ...state.modalData, item: payload, isOnCreate: false } };
    default:
      return state;
  }
};

export default otherPaysReducer;
