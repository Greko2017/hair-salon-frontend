import { FETCH_PRODUCT_SUCCESS, INITIATE_PRODUCT_FAILURE, INITIATE_PRODUCT_REQUEST } from "./product.constants";
const initialState = {
  loading: false,
  products: [],
  products_by_parent_id: [],
  modalData: { isVisible: false, isOnCreate: true, item: false },
  editingKey: '',
  error: "",
};
const productReducer = (state = initialState, { type, payload }) => {
  switch (type) {

  case INITIATE_PRODUCT_REQUEST:
    return { ...state, loading:true }
  case INITIATE_PRODUCT_FAILURE:
    return {
        ...state,
        loading: false,
        products: payload,
        error: "",
    };
    case FETCH_PRODUCT_SUCCESS:
        return {
            ...state,
            loading: false,
            products: payload,
            error: "",
        };
  default:
    return state
  }
}

export default productReducer
