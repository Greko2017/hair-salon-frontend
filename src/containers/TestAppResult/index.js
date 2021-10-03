import { Result, Button } from 'antd';
import { editCustomerDetail } from 'containers/TestApp/test_app.actions';

import React, { Component } from 'react';
import { connect } from 'react-redux';

export class TestAppResult extends Component {
  componentDidMount() {
    const { email_data } = this.props.match.params;
    let splitted_values = email_data.toString().split('__');
    let customer_id = splitted_values[0];
    let withdrawal_amount = splitted_values[1];
    // console.log(`splitted_values`, { customer_id, withdrawal_amount });
    this.props.editCustomerDetail({ customer_id: customer_id, withdrawal_amount: withdrawal_amount });
  }
  render() {
    return (
      <div>
        <Result
          status="success"
          title="Successfully Purchased Cloud Server ECS!"
          subTitle="Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait."
          extra={[
            <Button type="primary" key="console">
              Go Console
            </Button>,
            <Button key="buy">Buy Again</Button>,
          ]}
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {
    editCustomerDetail: value => dispatch(editCustomerDetail(value)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TestAppResult);
