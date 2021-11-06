import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Modal, Form, Select, DatePicker } from 'antd';
import { memo } from 'react';
import moment from 'moment';
import { editPayroll, handlePayrollModalCancelAction, postPayroll } from '../payroll.actions';
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
export class PayrollModalInner extends Component {
  state = {
    firstDay: null,
    lastDay: null,
  };
  componentDidMount() {
    let date = new Date();
    let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    this.setState({ firstDay: firstDay, lastDay: lastDay });
  }
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        values.date_from = values.period[0].format('YYYY-MM-DD');
        values.date_to = values.period[1].format('YYYY-MM-DD');
        if (this.props.isOnCreate === true) {
          this.props.postPayroll(values);
        } else if (this.props.isOnCreate === false) {
          values.id = this.props.item.id;
          this.props.editPayroll(values);
        }
      }
    });
  };
  render() {
    const { form, modalPayrollVisible, modalPayrollLoading, isOnCreate, employeeList, item } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        title={`${isOnCreate === true ? 'Add' : 'Update'} Payroll`}
        visible={modalPayrollVisible}
        onOk={this.handleSubmit}
        okText={isOnCreate ? 'Add' : 'Update'}
        confirmLoading={modalPayrollLoading}
        onCancel={this.props.handlePayrollModalCancelAction}
        className="payroll_modal__container"
      >
        <Form {...formItemLayout} className="payroll-form">
          <Form.Item label="Employee" className="payroll_modal__content">
            {getFieldDecorator('employee', {
              initialValue: item !== undefined && isOnCreate === false ? item.employee.id : null,
            })(
              <Select
                showSearch={true}
                placeholder="Employee"
                optionFilterProp="children"
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                {employeeList.map(employee => (
                  <Option key={employee.id} value={employee.id}>{`${employee.gender === 'male' ? 'Mr.' : 'Mm'} ${
                    employee.user.username
                  }`}</Option>
                ))}
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="Period" className="payroll_modal__content">
            {getFieldDecorator('period', {
              initialValue:
                item !== undefined && isOnCreate === false
                  ? [moment(item.date_from, dateFormat), moment(item.date_to, dateFormat)]
                  : [moment(this.state.firstDay, dateFormat), moment(this.state.lastDay, dateFormat)],
            })(<RangePicker style={{ width: '100%' }} format={dateFormat} />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

const mapStateToProps = state => {
  return {
    employeeList: state.employee.employees,
    modalPayrollVisible: state.payroll.modalData.isVisible,
    modalPayrollLoading: state.payroll.loading,
    isOnCreate: state.payroll.modalData.isOnCreate,
    item: state.payroll.modalData.item,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    handlePayrollModalCancelAction: () => {
      dispatch(handlePayrollModalCancelAction());
    },
    editPayroll: payroll => {
      dispatch(editPayroll(payroll));
    },
    postPayroll: payroll => {
      dispatch(postPayroll(payroll));
    },
  };
};

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const PayrollModal = Form.create({ name: 'payroll_modal' })(PayrollModalInner);

export default compose(withConnect, memo)(PayrollModal);
