import React, { Component } from 'react';
import { connect } from 'react-redux';

export class OtherPay extends Component {
  render() {
    return <div>OtherPay</div>;
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(OtherPay);
