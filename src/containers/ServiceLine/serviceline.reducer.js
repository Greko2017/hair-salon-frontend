import { EDIT_SERVICELINE_SUCCESS, GET_SERVICELINE_BY_PARENT_ID_SUCCESS, DELETE_SERVICELINE_SUCCESS, INITIATE_SERVICELINE_FAILURE, INITIATE_SERVICELINE_REQUEST, SERVICELINE_EDIT_EDITING_KEY, HANDLE_SERVICELINE_MODAL_SHOW, HANDLE_SERVICELINE_MODAL_CANCEL, SET_SERVICELINE_MODAL_ITEM, POST_SERVICELINE_SUCCESS } from "./serviceline.constants";

const initialState = {
  loading: false,
  servicelines: [],
  serviceline_result: false,
  servicelines_by_parent_id: [],
  modalData: { isVisible: false, isOnCreate: true, item: false },
  editingKey: '',
  error: "",
};

const servicelineReducer = (state = initialState, { type, payload }) => {
  switch (type) {

    case INITIATE_SERVICELINE_REQUEST:
      return { ...state, loading:true }
    case INITIATE_SERVICELINE_FAILURE:
      return {
          ...state,
          loading: false,
          servicelines: payload,
          error: "",
      };
    case GET_SERVICELINE_BY_PARENT_ID_SUCCESS:
      return {
          ...state,
          loading: false,
          servicelines_by_parent_id: payload,
          error: "",
      };
    case SERVICELINE_EDIT_EDITING_KEY:
      return {
          ...state,
          editingKey: payload,
      }

    case POST_SERVICELINE_SUCCESS:
      console.log('POST_SERVICELINE_SUCCESS :>> ', payload);
      return {
          ...state,
          loading: false,
          serviceline_result: payload,
          servicelines: state.servicelines.length >= 0 ? [payload, ...state.servicelines] : [],
      };
    case EDIT_SERVICELINE_SUCCESS:
      console.log('---- EDIT_SERVICELINE_SUCCESS payload', payload);
      return {
          ...state,
          loading: false,
          serviceline: payload,
          error: "",
          serviceline: [...state.serviceline.map(_serviceline => {
              // console.log('in EDIT_SERVICELINE_SUCCESS', _serviceline, action, _serviceline.id === payload.id);
              if (_serviceline.id !== payload.id) return _serviceline
              return payload
          })],
          servicelines_by_parent_id: [...state.servicelines_by_parent_id.map(_serviceline => {
              console.log('in EDIT_SERVICELINE_SUCCESS', _serviceline, payload, _serviceline.id === payload.id);
              if (_serviceline.id !== payload.id) return _serviceline
              return payload
          })]
      };
    case DELETE_SERVICELINE_SUCCESS:
        console.log('in service line Reducer DELETE_SERVICELINE_SUCCESS', payload);
        return {
            ...state,
            loading: false,
            servicelines: state.servicelines instanceof Array ? state.servicelines.filter(serviceline => serviceline.id != payload) : [...state.servicelines],
            servicelines_by_parent_id: state.servicelines_by_parent_id.filter(serviceline => serviceline.id != payload),
            response: payload,
            error: "",
        };
      case HANDLE_SERVICELINE_MODAL_SHOW:
      console.log('In handle service modal :>> ', payload);
        return {...state,modalData: {...state.modalData, isVisible:true, item: payload}};
      case HANDLE_SERVICELINE_MODAL_CANCEL:
        return {...state,modalData: {...state.modalData, isVisible:false, item:undefined}};
      case SET_SERVICELINE_MODAL_ITEM:
        return {...state,modalData: {...state.modalData, item: payload, isOnCreate:false}};
    default:
      return state
  }
}

export default servicelineReducer
