import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Modal, Form, Select, DatePicker, InputNumber, Input } from 'antd';
import { memo } from 'react';

import { editCategory, handleCategoryModalCancelAction, postCategory } from '../category.actions';
import { fetchCategory } from 'containers/Category/category.actions';
import Text from 'antd/lib/typography/Text';
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
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';

export class CategoryModalInner extends Component {
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
          this.props.postCategory(values);
        } else if (this.props.isOnCreate === false) {
          values.id = this.props.item.id;
          this.props.editCategory(values);
        }
      }
    });
  };
  render() {
    const { form, modalCategoryVisible, modalCategoryLoading, isOnCreate, categoryList, item } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        title={`${isOnCreate === true ? 'Add' : 'Update'} Category`}
        visible={modalCategoryVisible}
        onOk={this.handleSubmit}
        okText={isOnCreate ? 'Add' : 'Update'}
        confirmLoading={modalCategoryLoading}
        onCancel={this.props.handleCategoryModalCancelAction}
        className="category_modal__container"
      >
        <Form {...formItemLayout} className="category-form">
          <Form.Item label="Name" className="category_modal__content">
            {getFieldDecorator('name', {
              initialValue: item !== undefined && isOnCreate === false ? item.name : null,
            })(<Input style={{ width: '100%' }} />)}
          </Form.Item>

          <Form.Item label="Description" className="category_modal__content">
            {getFieldDecorator('description', {
              initialValue: item !== undefined && isOnCreate === false ? item.description : null,
            })(<TextArea style={{ width: '100%' }} />)}
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
    modalCategoryVisible: state.category.modalData.isVisible,
    modalCategoryLoading: state.category.loading,
    isOnCreate: state.category.modalData.isOnCreate,
    item: state.category.modalData.item,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchCategory: () => dispatch(fetchCategory()),
    handleCategoryModalCancelAction: () => {
      dispatch(handleCategoryModalCancelAction());
    },
    editCategory: category => {
      dispatch(editCategory(category));
    },
    postCategory: category => {
      dispatch(postCategory(category));
    },
  };
};
const withConnect = connect(mapStateToProps, mapDispatchToProps);

const CategoryModal = Form.create({ name: 'category_modal' })(CategoryModalInner);

export default compose(withConnect, memo)(CategoryModal);
