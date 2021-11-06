import React, { Component } from 'react';
import { connect } from 'react-redux';

export class PayslipBatch extends Component {
  render() {
    return <div>PayslipBatch</div>;
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(PayslipBatch);
