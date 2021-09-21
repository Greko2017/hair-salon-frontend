import {FETCH_SALARY_SUCCESS,INITIATE_SALARY_FAILURE,INITIATE_SALARY_REQUEST} from './salary.constants'
const initialState = {
  loading: false,
  salaries: [],
  salary_result: false,
  salary_by_parent_id: [],
  modalData: { isVisible: false, isOnCreate: true, item: false },
  editingKey: '',
  salary_names:[],
  error: "",
};

const salaryReducer = (state = initialState, { type, payload }) => {
  switch (type) {

  case INITIATE_SALARY_REQUEST:
    return { ...state, loading:true }
  case FETCH_SALARY_SUCCESS:
    return {
        ...state,
        loading: false,
        salaries: payload,
        error: "",
    };
  case INITIATE_SALARY_FAILURE:
      return {
          ...state,
          loading: false,
          error: payload,
      };
    // case HANDLE_SALARY_MODAL_SHOW:
    //   console.log('In handle salary modal :>> ');
    //     return {...state,modalData: {...state.modalData, isVisible:true}};
    // case HANDLE_SALARY_MODAL_CANCEL:
    //     return {...state,modalData: {...state.modalData, isVisible:false}};
  default:
    return state
  }
}

export default salaryReducer
