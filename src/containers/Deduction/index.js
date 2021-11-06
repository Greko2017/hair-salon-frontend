import React, { Component } from 'react';
import { connect } from 'react-redux';

export class Deductions extends Component {
  render() {
    return <div>Deductions </div>;
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Deductions);
