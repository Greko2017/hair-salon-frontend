import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Modal, Form, Select, Input, InputNumber, Checkbox } from 'antd';
import { memo } from 'react';
import { fetchServices } from 'containers/Service/service.actions';
import './ServiceLineModal.css';
import TextArea from 'antd/lib/input/TextArea';
import { handleServiceLineModalCancelAction, postServiceLine } from '../serviceline.actions';
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

export class ServiceLineModalInner extends Component {
  componentDidMount() {
    const { fetchServices } = this.props;
    fetchServices();
  }
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        if (this.props.isOnCreate === true) {
          this.props.postServiceLine(values);
        } else if (this.props.isOnCreate === false) {
          values.id = this.props.item.id;
          // this.props.editService(values)
        }
      }
    });
  };
  render() {
    const {
      form,
      modalServiceLineVisible,
      customers,
      service_names,
      isOnCreate,
      services,
      item,
      service_by_id,
    } = this.props;
    const { getFieldDecorator } = form;

    const prefixSelector = getFieldDecorator('prefix', {
      initialValue: 'om',
    })(
      <Select style={{ width: 70 }}>
        <Option value="om">OM</Option>
        <Option value="momo">MOMO</Option>
      </Select>,
    );
    return (
      <Modal
        title={`${isOnCreate === true ? 'Add' : 'Update'} Service Line`}
        visible={modalServiceLineVisible}
        onOk={this.handleSubmit}
        okText={isOnCreate ? 'Add' : 'Update'}
        confirmLoading={this.props.modalServiceLineLoading}
        onCancel={this.props.handleServiceLineModalCancelAction}
        className="serviceline_modal__container"
      >
        <Form {...formItemLayout} className="serviceline-form">
          <Form.Item label="Parent" className="serviceline_modal__content">
            {getFieldDecorator('parent', {
              initialValue:
                item !== undefined && isOnCreate === false
                  ? item.service_by_id.id
                  : service_by_id !== undefined
                  ? service_by_id.id
                  : null,
            })(
              <Select
                disabled
                onSelect={(value, event) => this.handleOnchangeEmployee(value, event)}
                showSearch={true}
                placeholder="Parent"
                optionFilterProp="children"
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                {services.map(service => (
                  <Option disabled key={service.id} value={service.id}>
                    {service.name}
                  </Option>
                ))}
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="Customer" className="serviceline_modal__content">
            {getFieldDecorator('customer_id', {
              initialValue: item !== undefined && isOnCreate === false ? item.customer_id : null,
            })(
              <Select
                showSearch={true}
                placeholder="Customer"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children[0].toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {customers.map(customer => (
                  <Option key={customer.id} value={customer.id}>
                    {customer.firstname} {customer.lastname !== null ? customer.lastname : ''}
                  </Option>
                ))}
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="Service" className="serviceline_modal__content">
            {getFieldDecorator('lookup', {
              initialValue: item !== undefined && isOnCreate === false ? item.lookup.id : null,
            })(
              <Select
                showSearch={true}
                placeholder="Service"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children
                    .toString()
                    .toLowerCase()
                    .indexOf(input.toString().toLowerCase()) >= 0
                }
              >
                {service_names.map(service_name => (
                  <Option key={service_name.id} value={service_name.id}>
                    {' '}
                    {service_name.name}{' '}
                  </Option>
                ))}
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="Amount" {...amountFormItemLayout} style={{ marginBottom: '.19rem' }}>
            <Form.Item
              name="amount_value"
              rules={[{ required: true }]}
              style={{ display: 'inline-block', width: '50%', marginRight: '0.15rem' }}
            >
              {getFieldDecorator(
                'amount_paid',
                {},
              )(<InputNumber style={{ width: '100%' }} min={1} max={999999} placeholder="Amount Value" />)}
            </Form.Item>
            <Form.Item style={{ display: 'inline-block', width: '30%' }}>
              {getFieldDecorator('quantity', {
                rules: [{ required: true, message: 'Please input a Quantity!' }],
              })(<InputNumber style={{ width: '100%' }} placeholder="Quantity" addonAfter={prefixSelector} />)}
            </Form.Item>
            <Form.Item style={{ display: 'inline-block', width: '18%', marginLeft: '0.15rem' }}>
              {getFieldDecorator(
                'payment_method',
                {},
              )(
                <Select placeholder="Payement method">
                  <Option value="om">OM</Option>
                  <Option value="momo">MOMO</Option>
                </Select>,
              )}
            </Form.Item>
          </Form.Item>
          <Form.Item label="Details" style={{ marginBottom: '1rem' }}>
            {getFieldDecorator('detail', { initialValue: item !== undefined ? item.details : null })(
              <TextArea
                onChange={this.onChange}
                placeholder="Some Details regarding the Service rendered"
                autoSize={{ minRows: 3, maxRows: 5 }}
              />,
            )}
          </Form.Item>
          <Form.Item {...isCreditFormItemLayout}>
            {getFieldDecorator('is_credit', {
              initialValue: item !== undefined ? item.is_credit : true,
              valuePropName: 'checked',
            })(
              <Checkbox>
                Is it a Credit <a href="">Credit Terms and conditions</a>
              </Checkbox>,
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

const mapStateToProps = state => {
  // console.log('In service line state :>> ', state);
  return {
    modalServiceLineVisible: state.serviceline.modalData.isVisible,
    modalServiceLineLoading: state.serviceline.loading,
    isOnCreate: state.serviceline.modalData.isOnCreate,
    service_by_id: state.service.service_by_id,
    item: state.serviceline.modalData.item,
    customers: state.customer.customers,
    service_names: state.service.service_names,
    services: state.service.services,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchServices: () => dispatch(fetchServices()),
    postServiceLine: new_serviceline => dispatch(postServiceLine(new_serviceline)),
    handleServiceLineModalCancelAction: () => dispatch(handleServiceLineModalCancelAction()),
  };
};
const withConnect = connect(mapStateToProps, mapDispatchToProps);

const ServiceLineModal = Form.create({ name: 'serviceline_modal' })(ServiceLineModalInner);

export default compose(withConnect, memo)(ServiceLineModal);
