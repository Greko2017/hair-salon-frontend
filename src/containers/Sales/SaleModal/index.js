import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'redux';
import {  Modal,  Form, Select } from 'antd';
import { memo } from 'react';
import { editSale, handleSaleModalCancelAction, postSale } from '../sales.actions';
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

export class SaleModalInner extends Component {
  static propTypes = {
    prop: PropTypes,
  }
  state ={

  }
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        values.product_id = values.quantity
        values.product_id = values.product_id
        if (this.props.isOnCreate=== true){
          this.props.postSale(values)
        }else if (this.props.isOnCreate === false){
          values.id = this.props.item.id
          this.props.editSale(values)
        }
      }
    });
  };
  render() {
    const {form, modalSaleVisible, modalSaleLoading, isOnCreate, employeeList, customerList, item } = this.props
    const { getFieldDecorator } = form;
    return (
      <Modal
        title= {`${isOnCreate===true ? 'Add' : 'Update'} Sale`}
        visible={modalSaleVisible}
        onOk={this.handleSubmit}
        okText={isOnCreate ? "Add" : "Update"}
        confirmLoading={modalSaleLoading}
        onCancel={this.props.handleSaleModalCancelAction}
        className="service_modal__container"
      >
        <Form {...formItemLayout} className="service-form">
          <Form.Item label="Saler" className="service_modal__content">
            {getFieldDecorator('saler', { initialValue: item !== undefined && isOnCreate === false ? item.saler_id : null })(
                <Select
                    showSearch={true}
                    placeholder="Saler"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }>
                    {employeeList.map(customer => <Option key={customer.id} value={customer.id}>{`${customer.gender === 'male' ? 'Mr.' : 'Mm'} ${customer.user.username}`}</Option>)}
                </Select>

                )}
          </Form.Item>
          <Form.Item label="Customer" className="service_modal__content">
            {getFieldDecorator('customer',  { initialValue: item !== undefined && isOnCreate === false ? item.customer_id : null })(
                <Select
                    showSearch={true}
                    placeholder="Customer"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                        option.props.children.toString().toLowerCase().indexOf(input.toString().toLowerCase()) >= 0
                    }>
                    {customerList.map(customer => <Option key={customer.id} value={customer.id}> {`${customer.gender === 'male' ? 'Mr.' : 'Mm'} ${customer.firstname}`} </Option>)}
                </Select>
                )}
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}

SaleModalInner.propTypes = {
  // saleList: PropTypes.array,
};

const mapStateToProps = (state) => {
  return {
    modalSaleVisible: state.sales.modalData.isVisible,
    modalSaleLoading:  state.sales.loading,
    isOnCreate: state.sales.modalData.isOnCreate,
    employeeList: state.employee.employees,
    customerList: state.customer.customers,
    item: state.sales.modalData.item,
  }
}
const mapDispatchToProps = dispatch => {
  return {
      handleSaleModalCancelAction: () => {dispatch(handleSaleModalCancelAction())},
      postSale: (new_sale) => {dispatch(postSale(new_sale))},
      editSale: (sale) => {dispatch(editSale(sale))},
      // setSaleModalItem : (item)=> dispatch(setSaleModalItem(item)),
  }
}
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const SaleModal = Form.create({ name: 'sale_modal' })(SaleModalInner);

export default compose(
  withConnect,
  memo,
)(SaleModal);
