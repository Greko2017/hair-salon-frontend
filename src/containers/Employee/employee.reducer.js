import {FETCH_EMPLOYEE_SUCCESS,INITIATE_EMPLOYEE_FAILURE,INITIATE_EMPLOYEE_REQUEST} from './employee.contants'
const initialState = {
  loading: false,
  employees: [],
  employee_result: false,
  employee_by_parent_id: [],
  modalData: { isVisible: false, isOnCreate: true, item: false },
  editingKey: '',
  employee_names:[],
  error: "",
};

const employeeReducer = (state = initialState, { type, payload }) => {
  switch (type) {

  case INITIATE_EMPLOYEE_REQUEST:
    return { ...state, loading:true }
  case FETCH_EMPLOYEE_SUCCESS:
    return {
        ...state,
        loading: false,
        employees: payload,
        employee_names: payload instanceof Array ? payload.reduce((prev, curr )=>{
          prev.push(`${curr.gender === 'male' ? 'Mr.' : 'Mm'} ${curr.user.username}`)
          return prev
        },[]) : [],
        error: "",
    };
  case INITIATE_EMPLOYEE_FAILURE:
      return {
          ...state,
          loading: false,
          error: payload,
      };
    // case HANDLE_EMPLOYEE_MODAL_SHOW:
    //   console.log('In handle employee modal :>> ');
    //     return {...state,modalData: {...state.modalData, isVisible:true}};
    // case HANDLE_EMPLOYEE_MODAL_CANCEL:
    //     return {...state,modalData: {...state.modalData, isVisible:false}};
  default:
    return state
  }
}

export default employeeReducer
