import { Result, Button } from 'antd';

import React, { Component } from 'react';
import { connect } from 'react-redux';

export class TestAppResult extends Component {
  componentDidMount() {
    const { email_data } = this.props.match.params;
    console.log(`email_data`, email_data);
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

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(TestAppResult);
