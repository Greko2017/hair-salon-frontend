import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'redux';
import {  Modal,  Form, Select } from 'antd';
import { memo } from 'react';
import {editService, handleServiceModalCancelAction, postService} from '../service.actions';
 import './serviceModal.css'
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
export class ServiceModalInner extends Component {
  static propTypes = {
    prop: PropTypes,
  }
  state ={
    employee_salary_id: false,
  }
  handleOnchangeEmployee = (val, event) => {
    let worker = [...this.props.employeelist].filter(item => item.id === val)[0]
    console.log('In handleOnchangeEmployee: ', worker);
    this.setState({...this.state,employee_salary_id: parseInt(worker.salary_id.id)})
  }
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        if (this.props.isOnCreate=== true){
          this.props.postService(values)
        }else if (this.props.isOnCreate === false){
          values.id = this.props.item.id
          this.props.editService(values)
        }
      }
    });
  };

  render() {
    const {form, modalServiceVisible, modalServiceLoading, isOnCreate, employeelist, salarylist, item } = this.props
    const { getFieldDecorator } = form;
    // console.log('this.props :>> ', this.props);
    return (
      <Modal
        title= {`${isOnCreate===true ? 'Add' : 'Update'} Service`}
        visible={modalServiceVisible}
        onOk={this.handleSubmit}
        okText={isOnCreate ? "Add" : "Update"}
        confirmLoading={this.props.modalServiceLoading}
        onCancel={this.props.handleServiceModalCancelAction}
        className="service_modal__container"
      >
        <Form {...formItemLayout} className="service-form">
          <Form.Item label="Worker" className="service_modal__content">
            {getFieldDecorator('worker', { initialValue: item !== undefined && isOnCreate === false ? item.employee_id : null })(
                <Select
                    onSelect={(value, event) => this.handleOnchangeEmployee(value, event)}
                    showSearch={true}
                    placeholder="Worker"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }>
                    {employeelist.map(salary => <Option key={salary.id} value={salary.id}>{`${salary.gender === 'male' ? 'Mr.' : 'Mm'} ${salary.user.username}`}</Option>)}
                </Select>

                )}
          </Form.Item>
          <Form.Item label="Salary" className="service_modal__content">
            {getFieldDecorator('salary',  { initialValue: this.state.employee_salary_id ? this.state.employee_salary_id : item !== undefined && isOnCreate === false ? item.salary_id : null })(
                <Select
                    showSearch={true}
                    placeholder="Salary"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                        option.props.children.toString().toLowerCase().indexOf(input.toString().toLowerCase()) >= 0
                    }>
                    {salarylist.map(salary => <Option key={salary.id} value={salary.id}> {salary.percentage == null ? `Income : ${salary.income}` : `percentage : ${salary.percentage} %`} </Option>)}
                </Select>
                )}
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}

ServiceModalInner.propTypes = {
  // serviceList: PropTypes.array,
};

const mapStateToProps = (state) => {
  return {
    modalServiceVisible: state.service.modalData.isVisible,
    modalServiceLoading:  state.service.loading,
    isOnCreate: state.service.modalData.isOnCreate,
    employeelist: state.employee.employees,
    salarylist: state.salary.salaries,
    item: state.service.modalData.item,
  }
}
const mapDispatchToProps = dispatch => {
  return {
      handleServiceModalCancelAction: () => {dispatch(handleServiceModalCancelAction())},
      postService: (new_service) => {dispatch(postService(new_service))},
      editService: (service) => {dispatch(editService(service))},
      // setServiceModalItem: (item) => dispatch(setServiceModalItem(item)),
  }
}
const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const ServiceModal = Form.create({ name: 'service_modal' })(ServiceModalInner);

export default compose(
  withConnect,
  memo,
)(ServiceModal);

