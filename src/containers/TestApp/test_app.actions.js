import axios from "axios";
import { API_BASE } from '../../env';
import { message } from 'antd';
import { EDIT_ACCOUNT_DETAILS_SUCCESS, FETCH_TEST_CUSTOMER_SUCCESS, GET_ACCOUNT_DETAILS_BY_USER_ID, INITIATE_TEST_CUSTOMER_FAILURE, INITIATE_TEST_CUSTOMER_REQUEST, SEND_MAIL_SUCESS } from "./test_app.constant";

const key = 'updatable';

// account_details Actions Creator
export const initiateTestCustomerRequest = (value) => {
  message.loading({ content: 'Initial request...', key });
  return {
      type: INITIATE_TEST_CUSTOMER_REQUEST,
      payload: value
  }
};
export const initiateTestCustomerFailure = (error) => {
  message.error({ content: 'Error!', key, duration: 2 });
  return {
      type: INITIATE_TEST_CUSTOMER_FAILURE,
      payload: error,
  };
};

// customer Actions Creator
export const fetchTestCustomerSuccess = (customers) => {
  message.success({ content: 'TestCustomer fetched successfully!', key, duration: 2 });
  return {
      type: FETCH_TEST_CUSTOMER_SUCCESS,
      payload: customers
  };
};


// fetch TestCustomer
export const fetchTestCustomers = () => {
  // console.log('---- fetchTestCustomers');
  return (dispatch) => {
      dispatch(initiateTestCustomerRequest);
      let stored_token = localStorage.getItem('token')
      let token = `Token ${stored_token}`
      axios.defaults.headers.common['Authorization'] = token
      axios
          .get(API_BASE+"/test_api/customer/")
          .then((response) => {
              const customers = response.data;
              // console.log('---- fetchTestCustomers customers', customers);
              dispatch(fetchTestCustomerSuccess(customers));
          })
          .catch((error) => {
              // console.error('---- fetchTestCustomers error', error);
              const errorMsg = error.message;
              dispatch(initiateTestCustomerFailure(errorMsg));
          });
  };
};

// AccountDetails Actions Creator
export const getAccountDetailsByUserIdSuccess = (user_id) => {
  return {
      type: GET_ACCOUNT_DETAILS_BY_USER_ID,
      payload: user_id
  };
};



export const getAccountDetailsByUserId = (customer_id) => {
  return async (dispatch)=>{
    dispatch(initiateTestCustomerRequest);
    let stored_token = localStorage.getItem('token')
    let token = `Token ${stored_token}`
    axios.defaults.headers.common['Authorization'] = token
    try {
      let res = await axios.get(`${API_BASE}/test_api/account_details/?customer_id=${customer_id}/`)
      let account_details = await res.data;
      dispatch(getAccountDetailsByUserIdSuccess(account_details))
      return await account_details
    } catch (error) {
      dispatch(initiateTestCustomerFailure(error.message))
    }
  }
}


// account_details Actions Creator
export const editAccountDetailsSuccess = (account_details) => {
  message.success({ content: 'edit AccountDetails edited successfully!', key, duration: 2 });
  return {
      type: EDIT_ACCOUNT_DETAILS_SUCCESS,
      payload: account_details
  };
};


export const editAccountDetails = (account_details) => {
  console.log('---- editAccountDetails', account_details);

  let url = `${API_BASE}/test_api/account_details/${account_details.id}/`

  return (dispatch) => {
      dispatch(initiateTestCustomerRequest(account_details));

      axios
          .put(url, account_details, {
            auth: {
              username: "Gregory",
              password: "Goufan2017"
            }
          })
          .then((response) => {
              const account_details = response.data;
              console.log('---- editAccountDetails account_details', account_details);
              dispatch(editAccountDetailsSuccess(account_details));
          })
          .catch((error) => {
              console.error('---- initiateServiceFailure error', error);
              const errorMsg = error.message;
              dispatch(initiateTestCustomerFailure(errorMsg));
          })
  };
};


// Send mail

export const sendMailSuccess = (mail_data) => {
  return {
      type: SEND_MAIL_SUCESS,
      payload: mail_data
  };
};


export const sendMail = (email_data) => {
  email_data.tmp_customer = email_data.customer
  email_data.customer = email_data.customer.id
  console.log('---- SendMail', email_data);
  let url = `${API_BASE}/test_api/send_email`

  return (dispatch) => {
      dispatch(initiateTestCustomerRequest(email_data));
      axios
          .post(url, email_data, {
            auth: {
              username: "Gregory",
              password: "Goufan2017"
            }
          })
          .then((response) => {
              const email_response = response.data;
              console.log('---- SendMail email_response', email_response);
              dispatch(sendMailSuccess(email_response));
              // email_data.amount = email_data.status === "approved" ? parseInt(email_data.account_details.amount) - parseInt(email_data.amount) : email_data.account_details.amount
              dispatch(editAccountDetails({account_number:email_data.account_details.account_number,status: "pending", id:email_data.account_details.id}))
          })
          .catch((error) => {
              console.error('---- initiateServiceFailure error', error);
              const errorMsg = error.message;
              dispatch(initiateTestCustomerFailure(errorMsg));
          })
  };
};
