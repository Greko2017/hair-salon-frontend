import {
  DELETE_INVENTORY_SUCCESS,
  EDIT_INVENTORY_SUCCESS,
  FETCH_INVENTORY_SUCCESS,
  GET_INVENTORY_BY_ID_SUCCESS,
  HANDLE_INVENTORY_MODAL_CANCEL,
  HANDLE_INVENTORY_MODAL_SHOW,
  INITIATE_INVENTORY_FAILURE,
  INITIATE_INVENTORY_REQUEST,
  POST_INVENTORY_SUCCESS,
  SET_INVENTORY_MODAL_ITEM,
} from './inventory.constants';
const initialState = {
  loading: false,
  inventories: [],
  parent: {},
  inventory_result: false,
  inventory_by_parent_id: [],
  modalData: { isVisible: false, isOnCreate: true, item: false },
  editingKey: '',
  error: '',
};

const inventoryReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case INITIATE_INVENTORY_REQUEST:
      return { ...state, loading: true };
    case FETCH_INVENTORY_SUCCESS:
      return {
        ...state,
        loading: false,
        inventories: payload,
        error: '',
      };
    case INITIATE_INVENTORY_FAILURE:
      return {
        ...state,
        loading: false,
        error: payload,
      };
    case POST_INVENTORY_SUCCESS:
      console.log('POST_INVENTORY_SUCCESS :>> ', payload);
      return {
        ...state,
        loading: false,
        inventory_result: payload,
        inventories: state.inventories.length >= 0 ? [payload, ...state.inventories] : [],
      };
    case EDIT_INVENTORY_SUCCESS:
      console.log('In EDIT_INVENTORY_SUCCESS', state);
      return {
        ...state,
        loading: false,
        inventory: payload,
        error: '',
        inventories: [
          ...state.inventories.map(_inventory => {
            console.log('in EDIT_INVENTORY_SUCCESS', _inventory, _inventory.id === payload.id);
            if (_inventory.id !== payload.id) return _inventory;
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
    case DELETE_INVENTORY_SUCCESS:
      return {
        ...state,
        loading: false,
        inventories: state.inventories.filter(inventory => inventory.id !== payload),
        response: payload,
        error: '',
      };
    case GET_INVENTORY_BY_ID_SUCCESS:
      return {
        ...state,
        loading: false,
        parent: payload,
        error: '',
      };
    case HANDLE_INVENTORY_MODAL_SHOW:
      console.log('In handle Payroll modal :>> ', payload);
      return { ...state, modalData: { ...state.modalData, isVisible: true, item: payload } };
    case HANDLE_INVENTORY_MODAL_CANCEL:
      return { ...state, modalData: { ...state.modalData, isVisible: false, item: undefined } };
    case SET_INVENTORY_MODAL_ITEM:
      return { ...state, modalData: { ...state.modalData, item: payload, isOnCreate: false } };
    default:
      return state;
  }
};

export default inventoryReducer;
