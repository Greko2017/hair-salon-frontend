import {INITIATE_SERVICE_FAILURE,INITIATE_SERVICE_REQUEST,FETCH_SERVICE_SUCCESS, HANDLE_SERVICE_MODAL_SHOW, HANDLE_SERVICE_MODAL_CANCEL, POST_SERVICE_SUCCESS, SET_SERVICE_MODAL_ITEM, DELETE_SERVICE_SUCCESS, EDIT_SERVICE_SUCCESS, GET_SERVICE_BY_ID_SUCCESS, FETCH_SERVICE_NAME_LOOKUP_SUCCESS, EDIT_SERVICE_BY_ID_SUCCESS, DELETE_SERVICELINE_IN_SERVICE_BY_ID_SUCCESS, ADD_SERVICELINE_IN_SERVICE_BY_ID_SUCCESS} from './service.constants'
const initialState = {
  loading: false,
  services: [],
  service_result: false,
  service_names: [],
  service_by_id: {servicelines:[]},
  modalData: { isVisible: false, isOnCreate: true, item: false },
  editingKey: '',
  error: "",
};


const serviceReducer = (state = initialState, { type, payload }) => {
  switch (type) {

  case INITIATE_SERVICE_REQUEST:
    return { ...state, loading:true }
  case FETCH_SERVICE_SUCCESS:
    return {
        ...state,
        loading: false,
        services: payload,
        error: "",
    };
  case FETCH_SERVICE_NAME_LOOKUP_SUCCESS:
    return {
        ...state,
        loading: false,
        service_names: payload,
        error: "",
    };
  case INITIATE_SERVICE_FAILURE:
      return {
          ...state,
          loading: false,
          error: payload,
      };
  case POST_SERVICE_SUCCESS:
    console.log('POST_SERVICE_SUCCESS :>> ', payload);
      return {
          ...state,
          loading: false,
          service_result: payload,
          services: state.services.length >= 0 ? [payload, ...state.services] : [],
      };
  case DELETE_SERVICE_SUCCESS:
      return {
          ...state,
          loading: false,
          services: state.services.filter(service => service.id !== payload),
          response: payload,
          error: "",
      };
  case EDIT_SERVICE_SUCCESS:
    console.log('In EDIT_SERVICE_SUCCESS', state) ;
    return {
        ...state,
        loading: false,
        service: payload,
        error: "",
        services: [...state.services.map(_service => {
            console.log('in EDIT_SERVICE_SUCCESS', _service,  _service.id === payload.id);
            if (_service.id !== payload.id) return _service
            return payload
        })]
    };
  case HANDLE_SERVICE_MODAL_SHOW:
  console.log('In handle service modal :>> ', payload);
    return {...state,modalData: {...state.modalData, isVisible:true, item: payload}};
  case HANDLE_SERVICE_MODAL_CANCEL:
    return {...state,modalData: {...state.modalData, isVisible:false, item:undefined}};
  case SET_SERVICE_MODAL_ITEM:
    return {...state,modalData: {...state.modalData, item: payload, isOnCreate:false}};
  case GET_SERVICE_BY_ID_SUCCESS:
    return {
        ...state,
        loading: false,
        service_by_id: payload,
        error: "",
    };
    case ADD_SERVICELINE_IN_SERVICE_BY_ID_SUCCESS:
      console.log('---- ADD_SERVICELINE_IN_SERVICE_BY_ID_SUCCESS payload', payload);
      return {
          ...state,
          loading: false,
          error: "",
          service_by_id:  {...state.service_by_id, servicelines: [payload, ...state.service_by_id.servicelines]}
      };
    case EDIT_SERVICE_BY_ID_SUCCESS:
      console.log('---- EDIT_SERVICE_BY_ID_SUCCESS payload', payload);
      return {
          ...state,
          loading: false,
          serviceline: payload,
          error: "",
          service_by_id:  {...state.service_by_id, servicelines: [...state.service_by_id.servicelines.map(_serviceline => {
              console.log('in EDIT_SERVICE_BY_ID_SUCCESS', _serviceline, payload, _serviceline.id === payload.id);
              if (_serviceline.id !== payload.id) return _serviceline
              return payload
          })]}
      };
    case DELETE_SERVICELINE_IN_SERVICE_BY_ID_SUCCESS:
      console.log('---- EDIT_SERVICE_BY_ID_SUCCESS payload', payload);
      return {
          ...state,
          loading: false,
          error: "",
          service_by_id:  {...state.service_by_id, servicelines: [...state.service_by_id.servicelines.filter(_serviceline => {
              return _serviceline.id !== payload
          })]},
          response: payload,
      };

    default:
    return state
  }
}

export default serviceReducer
