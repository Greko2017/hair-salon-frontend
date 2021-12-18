import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Modal, Form, Select, DatePicker, InputNumber, Input } from 'antd';
import { memo } from 'react';

import { editCustomer, fetchCustomers, handleCustomerModalCancelAction, postCustomer } from '../customer.actions';

import TextArea from 'antd/lib/input/TextArea';
const { Option } = Select;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 19 },
  },
};
const amountFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 19,
      offset: 0,
    },
  },
};
const validateMessages = {
  required: '${label} is required!',
  types: {
    email: '${label} is not a valid email!',
    number: '${label} is not a valid number!',
  },
  number: {
    range: '${label} must be between ${min} and ${max}',
  },
};

const { RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';

export class CustomerModalInner extends Component {
  componentDidMount() {
    const { fetchCustomers } = this.props;
    fetchCustomers();
  }
  handleSubmit = e => {
    e.preventDefault();
    e.persist();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values, this.props.item);
        if (this.props.isOnCreate === true) {
          this.props.postCustomer(values);
        } else if (this.props.isOnCreate === false) {
          values.id = this.props.item.id;
          this.props.editCustomer(values);
        }
      }
    });
  };
  render() {
    const { form, modalCustomerVisible, modalCustomerLoading, isOnCreate, customerList, item } = this.props;
    const { getFieldDecorator } = form;

    const prefixSelector = getFieldDecorator('prefix', {
      initialValue: 'male',
    })(
      <Select style={{ width: 70 }}>
        <Option value="male">Male</Option>
        <Option value="women">Women</Option>
      </Select>,
    );
    return (
      <Modal
        title={`${isOnCreate === true ? 'Add' : 'Update'} Customer`}
        visible={modalCustomerVisible}
        onOk={this.handleSubmit}
        okText={isOnCreate ? 'Add' : 'Update'}
        confirmLoading={modalCustomerLoading}
        onCancel={this.props.handleCustomerModalCancelAction}
        className="customer_modal__container"
      >
        <Form {...formItemLayout} className="customer-form" validateMessages={validateMessages}>
          <Form.Item label="Name" className="customer_modal__content">
            {getFieldDecorator('First Name', {
              initialValue: item !== undefined && isOnCreate === false ? item.firstname : null,
            })(<Input style={{ width: '100%' }} />)}
          </Form.Item>

          <Form.Item label="Last Name" className="customer_modal__content">
            {getFieldDecorator('Last Name', {
              initialValue: item !== undefined && isOnCreate === false ? item.lastname : null,
            })(<Input style={{ width: '100%' }} />)}
          </Form.Item>
          {/* https://stackoverflow.com/questions/63869030/email-validation-in-react-ant-design-form */}
          <Form.Item label="Email" className="customer_modal__content">
            {getFieldDecorator('email', {
              rules: [
                {
                  required: true,
                  type: 'email',
                  message: 'The input is not valid E-mail!',
                },
              ],
              initialValue: item !== undefined && isOnCreate === false ? item.email : null,
            })(<Input style={{ width: '100%' }} />)}
          </Form.Item>

          <Form.Item label="Phone Nbr" {...amountFormItemLayout} style={{ marginBottom: '.19rem' }}>
            <Form.Item
              name="phone_number"
              rules={[{ required: true }]}
              style={{ display: 'inline-block', width: '70%', marginRight: '0.15rem' }}
            >
              {getFieldDecorator(
                'phone_number',
                {},
              )(<InputNumber style={{ width: '100%' }} min={1} max={999999999999} placeholder="Phone Number" />)}
            </Form.Item>
            <Form.Item style={{ display: 'inline-block', width: '28%', marginLeft: '0.15rem' }}>
              {getFieldDecorator(
                'payment_method',
                {},
              )(
                <Select placeholder="Genre  ">
                  <Option value="male">Male</Option>
                  <Option value="women">Women</Option>
                </Select>,
              )}
            </Form.Item>
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

const mapStateToProps = state => {
  // console.log(`state`, state);
  return {
    customerList: state.customer.customers,
    modalCustomerVisible: state.customer.modalData.isVisible,
    modalCustomerLoading: state.customer.loading,
    isOnCreate: state.customer.modalData.isOnCreate,
    item: state.customer.modalData.item,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchCustomers: () => dispatch(fetchCustomers()),
    handleCustomerModalCancelAction: () => {
      dispatch(handleCustomerModalCancelAction());
    },
    editCustomer: customer => {
      dispatch(editCustomer(customer));
    },
    postCustomer: customer => {
      dispatch(postCustomer(customer));
    },
  };
};
const withConnect = connect(mapStateToProps, mapDispatchToProps);

const CustomerModal = Form.create({ name: 'customer_modal' })(CustomerModalInner);

export default compose(withConnect, memo)(CustomerModal);
