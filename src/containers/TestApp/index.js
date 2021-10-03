import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  Form,
  Input,
  Select,
  Row,
  Statistic,
  Button,
  Col,
  AutoComplete,
} from 'antd';

import "./style.css"
import { fetchTestCustomers, getAccountDetailsByUserId, sendMail } from './test_app.actions';
const { Option } = Select;
const AutoCompleteOption = AutoComplete.Option;


const DemoBox = props => <p className={`height-${props.value}`}>{props.children}</p>;

export class WrapperTestApp extends Component {
  state = {
    email: null,
    phone_number: null,
    account_details: {},
    withdrawal_amount: null,
  }
  componentDidMount(){
    const { fetchTestCustomers } = this.props
    fetchTestCustomers()
  }
  handleOnRefresh(){
    const { fetchTestCustomers } = this.props
    fetchTestCustomers()
  }
  handleOnchangeCustomer = (val, event) => {
    let customer = [...this.props.customerData.customers].filter(item => item.id === val)[0];
    // console.log('In handleOnchangeCustomer: ', customer);
    this.setState({ ...this.state, email: customer.email, phone_number: customer.phone_number, account_details:customer.account_details  });
  };
  handleSubmit = e => {
    const { sendMail } = this.props
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let customer = [...this.props.customerData.customers].filter(item => item.id === values.customer)[0];
        values.customer = customer
        values.status = "pending"
        values.account_details = this.state.account_details
        console.log('Received values of form: ', values);
        sendMail(values)
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { customerData } = this.props

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
        md: { span: 5 },
        lg: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
        md: { span: 18 },
        lg: { span: 18 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
        md: {
          span: 18,
          offset: 5,
        },
        lg: {
          span: 16,
          offset: 5,
        },
      },
    };
    const prefixSelector = getFieldDecorator('prefix', {
      initialValue: '237',
    })(
      <Select style={{ width: 70 }}>
        <Option value="237">+237</Option>
        <Option value="233">+233</Option>
      </Select>,
    );

    return (
      <div style={{padding: "0 auto"}}>
          <Row style={{padding: "12rem 4em"}} type="flex" justify="center" align="middle">
            <Col span={8} >
              <DemoBox value={120}>
                  <div style={{padding: "0 2em"}}>
                  <Form onSubmit={this.handleSubmit} className="send-mail-form">
                    <Form.Item {...formItemLayout} label="Customer">
                      {getFieldDecorator('customer', {
                      })(
                        <Select style={{ width: '100%' }}
                          onSelect={(value, event) => this.handleOnchangeCustomer(value, event)}
                          showSearch={true}
                          placeholder="Customer"
                          optionFilterProp="children"
                          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                          {customerData.customers.map(customer => (
                            <Option key={customer.id} value={customer.id}>{`${customer.gender === 'male' ? 'Mr.' : 'Mm'} ${
                              customer.lastname
                            }`}</Option>
                          ))}
                        </Select>,
                      )}
                    </Form.Item>

                  <Form.Item {...formItemLayout} label="E-mail">
                    {getFieldDecorator('email', {
                      initialValue: this.state.email !== null ? this.state.email : null,
                      rules: [
                        {
                          type: 'email',
                          message: 'The input is not valid E-mail!',
                        },
                        {
                          required: true,
                          message: 'Please input your E-mail!',
                        },
                      ],
                    })(<Input />)}
                  </Form.Item>

                  <Form.Item  {...formItemLayout}label="Phone Number">
                      {getFieldDecorator('phone', {
                        initialValue: this.state.phone_number !== null ? this.state.phone_number : null,
                        rules: [{ required: true, message: 'Please input your phone number!' }],
                      })(<Input addonBefore={prefixSelector} style={{ width: '100%' }} />)}
                    </Form.Item>

                  <Form.Item {...formItemLayout} label="Withdraw">
                    {getFieldDecorator('withdrawal_amount', {
                      initialValue: this.state.withdrawal_amount !== null ? this.state.withdrawal_amount : null,
                      rules: [
                        {
                          required: true,
                          message: 'Please input your Withdrawal Amount',
                        },
                      ],
                    })(<Input style={{ width: '100%' }}/>)}
                  </Form.Item>

                  <Form.Item {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit">
                      Register
                    </Button>
                  </Form.Item>
                </Form>
                  </div>
              </DemoBox>
            </Col>
            <Col span={6}>
              <DemoBox value={80}>
              <Row gutter={[16, 16]} type="flex" justify="flex-start" align="top">
                <Col span={13}>
                  <Statistic title="Status" value={this.state.account_details.status || 'n/a'} />
                </Col>
              </Row>
              <Row gutter={[16, 16]} type="flex" justify="space-between" align="top">
                <Col span={13}>
                  <Statistic title="Account Number" value={this.state.account_details.account_number} />
                </Col>
                <Col span={8}>
                  <Statistic title="Account Balance (XAF)" value={this.state.account_details.amount} precision={2} />
                  <Button onClick={()=> this.handleOnRefresh()} style={{ marginTop: 16 }} type="primary">
                    Refresh
                  </Button>
                </Col>
              </Row>
              </DemoBox>
            </Col>
          </Row>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  console.log('state :>> ', state);
  return {
    customerData: state.test_app
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchTestCustomers: () => dispatch(fetchTestCustomers()),
    getAccountDetailsByUserId: (customer_id)=> dispatch(getAccountDetailsByUserId(customer_id)),
    sendMail: (email_data)=> dispatch(sendMail(email_data))
  };
};


const TestApp = Form.create({ name: 'test_app_form' })(WrapperTestApp);

export default connect(mapStateToProps, mapDispatchToProps)(TestApp);
