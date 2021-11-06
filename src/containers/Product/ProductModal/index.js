import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Modal, Form, Select, DatePicker, InputNumber, Input } from 'antd';
import { memo } from 'react';

import { editProduct, handleProductModalCancelAction, postProduct } from '../product.actions';
import { fetchCategory } from 'containers/Category/category.actions';
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

export class ProductModalInner extends Component {
  componentDidMount() {
    const { fetchCategory } = this.props;
    fetchCategory();
  }
  handleSubmit = e => {
    e.preventDefault();
    e.persist();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values, this.props.item);
        if (this.props.isOnCreate === true) {
          this.props.postProduct(values);
        } else if (this.props.isOnCreate === false) {
          values.id = this.props.item.id;
          this.props.editProduct(values);
        }
      }
    });
  };
  render() {
    const { form, modalProductVisible, modalProductLoading, isOnCreate, categoryList, item } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        title={`${isOnCreate === true ? 'Add' : 'Update'} Product`}
        visible={modalProductVisible}
        onOk={this.handleSubmit}
        okText={isOnCreate ? 'Add' : 'Update'}
        confirmLoading={modalProductLoading}
        onCancel={this.props.handleProductModalCancelAction}
        className="product_modal__container"
      >
        <Form {...formItemLayout} className="product-form">
          <Form.Item label="Category" className="product_modal__content">
            {getFieldDecorator('category', {
              initialValue: item !== undefined && isOnCreate === false ? item.category.id : null,
            })(
              <Select
                showSearch={true}
                placeholder="Category"
                optionFilterProp="children"
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                {categoryList?.map(category => (
                  <Option key={category.id} value={category.id}>
                    {category.name}
                  </Option>
                ))}
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="Name" className="product_modal__content">
            {getFieldDecorator('name', {
              initialValue: item !== undefined && isOnCreate === false ? item.name : null,
            })(<Input style={{ width: '100%' }} />)}
          </Form.Item>

          <Form.Item label="Selling Price" className="product_modal__content">
            {getFieldDecorator('selling_price', {
              initialValue: item !== undefined && isOnCreate === false ? item.selling_price : null,
            })(<InputNumber style={{ width: '100%' }} />)}
          </Form.Item>
          <Form.Item label="Cost Price" className="product_modal__content">
            {getFieldDecorator('cost_price', {
              initialValue: item !== undefined && isOnCreate === false ? item.cost_price : null,
            })(<InputNumber style={{ width: '100%' }} />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

const mapStateToProps = state => {
  // console.log(`state`, state);
  return {
    categoryList: state.category.categories,
    modalProductVisible: state.product.modalData.isVisible,
    modalProductLoading: state.product.loading,
    isOnCreate: state.product.modalData.isOnCreate,
    item: state.product.modalData.item,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchCategory: () => dispatch(fetchCategory()),
    handleProductModalCancelAction: () => {
      dispatch(handleProductModalCancelAction());
    },
    editProduct: product => {
      dispatch(editProduct(product));
    },
    postProduct: product => {
      dispatch(postProduct(product));
    },
  };
};
const withConnect = connect(mapStateToProps, mapDispatchToProps);

const ProductModal = Form.create({ name: 'product_modal' })(ProductModalInner);

export default connect(mapStateToProps, mapDispatchToProps)(ProductModal);
