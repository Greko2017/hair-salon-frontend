import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Modal, Form, Select, DatePicker, InputNumber } from 'antd';
import { memo } from 'react';

import { editInventory, handleInventoryModalCancelAction, postInventory } from '../inventory.actions';
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
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';

export class InventoryModalInner extends Component {
  handleSubmit = e => {
    e.preventDefault();
    e.persist();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values, this.props.item);
        if (this.props.isOnCreate === true) {
          this.props.postInventory(values);
        } else if (this.props.isOnCreate === false) {
          values.id = this.props.item.id;
          this.props.editInventory(values);
        }
      }
    });
  };
  render() {
    const { form, modalInventoryVisible, modalInventoryLoading, isOnCreate, products, item } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        title={`${isOnCreate === true ? 'Add' : 'Update'} Inventory`}
        visible={modalInventoryVisible}
        onOk={this.handleSubmit}
        okText={isOnCreate ? 'Add' : 'Update'}
        confirmLoading={modalInventoryLoading}
        onCancel={this.props.handleInventoryModalCancelAction}
        className="inventory_modal__container"
      >
        <Form {...formItemLayout} className="inventory-form">
          <Form.Item label="Product" className="inventory_modal__content">
            {getFieldDecorator('product', {
              initialValue: item !== undefined && isOnCreate === false ? item.product.id : null,
            })(
              <Select
                showSearch={true}
                placeholder="Product"
                optionFilterProp="children"
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                {products?.map(product => (
                  <Option key={product.id} value={product.id}>
                    {product.name}
                  </Option>
                ))}
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="Stock Qty" className="inventory_modal__content">
            {getFieldDecorator('quantity', {
              initialValue: item !== undefined && isOnCreate === false ? item.quantity : null,
            })(<InputNumber style={{ width: '100%' }} />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

const mapStateToProps = state => {
  return {
    products: state.product.products,
    modalInventoryVisible: state.inventory.modalData.isVisible,
    modalInventoryLoading: state.inventory.loading,
    isOnCreate: state.inventory.modalData.isOnCreate,
    item: state.inventory.modalData.item,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    handleInventoryModalCancelAction: () => {
      dispatch(handleInventoryModalCancelAction());
    },
    editInventory: inventory => {
      dispatch(editInventory(inventory));
    },
    postInventory: inventory => {
      dispatch(postInventory(inventory));
    },
  };
};
const withConnect = connect(mapStateToProps, mapDispatchToProps);

const InventoryModal = Form.create({ name: 'inventory_modal' })(InventoryModalInner);

export default compose(withConnect, memo)(InventoryModal);
