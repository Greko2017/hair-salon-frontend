import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Modal, Form, Select, Input, InputNumber } from 'antd';

import TextArea from 'antd/lib/input/TextArea';
import { memo } from 'react';
import { handleOtherPaysModalCancelAction, postOtherPays } from '../otherpay.actions';
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
const isCreditFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 19,
      offset: 4,
    },
  },
};

export class OtherPayModalInner extends Component {
  state = {
    price: null,
  };
  componentDidMount() {}

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        if (this.props.isOnCreate === true) {
          values.parent = this.props.parent.id;
          console.log('Received values of form: ', values);
          this.props.postOtherPays(values);
        } else if (this.props.isOnCreate === false) {
          values.id = this.props.item.id;
          // this.props.editSale(values)
        }
      }
    });
  };

  handleOnchangeEmployee = (val, event) => {
    // let product = [...this.props.products].filter(item => item.id === val)[0];
    // this.setState({ ...this.state, price: product.selling_price });
  };

  render() {
    const { form, modalOtherPaysVisible, parent, isOnCreate, products, sales, item } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        title={`${isOnCreate === true ? 'Add' : 'Update'} Other Pays`}
        visible={modalOtherPaysVisible}
        onOk={(value, event) => this.handleSubmit(value, event)}
        okText={isOnCreate ? 'Add' : 'Update'}
        confirmLoading={this.props.modalOtherPaysLoading}
        onCancel={this.props.handleOtherPaysModalCancelAction}
        className="other_pay_modal__container"
      >
        <Form {...formItemLayout} className="other_pay-form">
          <Form.Item label="Payslip">
            {getFieldDecorator('parent', {
              initialValue: parent.name,
            })(<Input disabled />)}
          </Form.Item>
          <Form.Item label="Name" className="other_pay_modal__content">
            {getFieldDecorator('name', {
              initialValue: item !== undefined && isOnCreate === false ? item.product_id : null,
            })(<Input />)}
          </Form.Item>
          <Form.Item label="Amount" {...amountFormItemLayout} style={{ marginBottom: '.19rem' }}>
            <Form.Item
              name="amount"
              rules={[{ required: true }]}
              style={{ display: 'inline-block', width: '100%', marginRight: '0.15rem' }}
            >
              {getFieldDecorator('amount', { initialValue: this.state.price })(
                <InputNumber style={{ width: '100%' }} min={1} max={999999} placeholder="Amount Value" />,
              )}
            </Form.Item>
          </Form.Item>
          <Form.Item label="Description" style={{ marginBottom: '1rem' }}>
            {getFieldDecorator('description', { initialValue: item !== undefined ? item.details : null })(
              <TextArea
                onChange={this.onChange}
                placeholder="Description regarding the other pay. e.g: extra time on Friday"
                autoSize={{ minRows: 3, maxRows: 5 }}
              />,
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

const mapStateToProps = state => {
  // console.log('In sales line state :>> ', state);
  return {
    modalOtherPaysVisible: state.other_pays.modalData.isVisible,
    modalOtherPaysLoading: state.other_pays.loading,
    isOnCreate: state.other_pays.modalData.isOnCreate,
    item: state.other_pays.modalData.item,
    parent: state.payroll.parent,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    // fetchSales: () => dispatch(fetchSales()),
    postOtherPays: new_other_pay => dispatch(postOtherPays(new_other_pay)),
    handleOtherPaysModalCancelAction: () => dispatch(handleOtherPaysModalCancelAction()),
  };
};
const withConnect = connect(mapStateToProps, mapDispatchToProps);

const OtherPayModal = Form.create({ name: 'other_pay_modal' })(OtherPayModalInner);

export default compose(withConnect, memo)(OtherPayModal);
