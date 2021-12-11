import produce from 'immer';
import {
  GET_POSTS_SUCCESS,
  HANDLE_MODAL_SHOW,
  HANDLE_MODAL_CANCEL,
  POST_POSTS_REQUEST,
  POST_POSTS_SUCCESS,
  POST_POSTS_FAILURE,
  ON_CHANGE_TEXT,
  ON_CHANGE_TITLE,
  ON_CHANGE_ADD_PHOTO,
  ON_CHANGE_DEL_PHOTO,
  BOARD_TOTAL_SALE,
  BOARD_TOTAL_SERVICE,
  BOARD_TOTAL_CUSTOMER,
  BEST_PERFORMED_EMPLOYEE_SERVICE,
  HANDLE_BOARD_MODAL_CANCEL,
  HANDLE_BOARD_MODAL_SHOW,
  SET_BOARD_MODAL_ITEM,
} from './board.constants';

export const initialState = {
  postList: [],
  modalVisible: false,
  modalLoading: false,
  postForm: {
    title: '',
    text: '',
    photo: [],
  },
  total_sale: 0,
  total_service: 0,
  total_customer: 0,
  employee_service_performance: [],
  modalData: { isVisible: false, isOnCreate: true, item: false },
};

/* eslint-disable default-case, no-param-reassign */
const boardReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case GET_POSTS_SUCCESS:
        draft.postList = action.payload.data;
        break;
      case POST_POSTS_REQUEST:
        draft.modalLoading = true;
        break;
      case POST_POSTS_SUCCESS:
        draft.modalLoading = false;
        draft.modalVisible = false;
        draft.postForm = {
          title: '',
          text: '',
          photo: [],
        };
        break;
      case POST_POSTS_FAILURE:
        draft.modalLoading = false;
        break;
      case HANDLE_MODAL_SHOW:
        draft.modalVisible = true;
        break;
      case HANDLE_MODAL_CANCEL:
        draft.modalLoading = false;
        draft.modalVisible = false;
        break;
      case ON_CHANGE_TITLE:
        draft.postForm.title = action.payload;
        break;
      case ON_CHANGE_TEXT:
        draft.postForm.text = action.payload;
        break;
      case ON_CHANGE_ADD_PHOTO:
        draft.postForm.photo = [action.payload];
        break;
      case ON_CHANGE_DEL_PHOTO:
        draft.postForm.photo = [];
        break;
      case BOARD_TOTAL_SALE:
        // console.log(`action.payload`, action.payload);
        let tmp_total_sale =
          action.payload && action.payload instanceof Array
            ? action.payload.reduce((total, currSaleLine) => {
                return (
                  total +
                  currSaleLine.amount_paid * numOr1(currSaleLine.product_quantity) * (currSaleLine.is_credit ? -1 : 1)
                );
              }, 0)
            : 0;
        draft.total_sale = tmp_total_sale;
        break;
      case BOARD_TOTAL_SERVICE:
        let tmp_total_service =
          action.payload && action.payload instanceof Array
            ? action.payload.reduce((total, currServiceLine) => {
                return (
                  total +
                  currServiceLine.amount_paid * numOr1(currServiceLine.quantity) * (currServiceLine.is_credit ? -1 : 1)
                );
              }, 0)
            : 0;
        draft.total_service = tmp_total_service;
        break;
      case BOARD_TOTAL_CUSTOMER:
        console.log(`action.payload`, action.payload);
        draft.total_customer = action.payload;
        break;
      case BEST_PERFORMED_EMPLOYEE_SERVICE:
        draft.employee_service_performance = action.payload;
        break;

      case HANDLE_BOARD_MODAL_SHOW:
        draft.modalData.isVisible = true;
        draft.modalData.item = action.payload;
        break;
      case HANDLE_BOARD_MODAL_CANCEL:
        draft.modalData.isVisible = false;
        draft.modalData.item = undefined;
        break;
      case SET_BOARD_MODAL_ITEM:
        draft.modalData.isVisible = false;
        draft.modalData.item = action.payload;
        break;
    }
  });

let numOr0 = n => (isNaN(n) ? 0 : n);

let numOr1 = n => (isNaN(n) ? 1 : n > 0 ? n : 1);
export default boardReducer;
