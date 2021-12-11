import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { Button } from 'antd';
import PayrollModal from './PayrollModal';
import PayrollTable from './PayrollTable';
import { fetchPayrolls, handlePayrollModalShowAction, deletePayroll, setPayrollModalItem } from './payroll.actions';

export class Payslip extends Component {
  componentDidMount() {
    this.props.fetchPayrolls();
  }
  get ListProps() {
    const { setPayrollModalItem, deletePayroll, handlePayrollModalShowAction } = this.props;
    return {
      onDeleteItem: id => {
        // console.log('In onDeleteItem :>> ', id);
        deletePayroll(id);
      },
      onEditItem: async item => {
        // console.log('In onEditItem :>> ', item);
        await setPayrollModalItem(item);
        await handlePayrollModalShowAction(item);
      },
    };
  }
  render() {
    return (
      <>
        <Helmet>
          <title>Payrolls</title>
          <meta name="description" content="List of payroll" />
        </Helmet>
        <PayrollModal />
        <div style={{ marginBottom: 16 }}>
          <Button type="primary" onClick={this.props.handlePayrollModalShowAction}>
            Add
          </Button>
        </div>
        <PayrollTable {...this.ListProps} />
      </>
    );
  }
}
const mapStateToProps = state => {
  return {};
};
const mapDispatchToProps = dispatch => {
  return {
    fetchPayrolls: () => dispatch(fetchPayrolls()),
    handlePayrollModalShowAction: item => dispatch(handlePayrollModalShowAction(item)),
    setPayrollModalItem: item => dispatch(setPayrollModalItem(item)),
    deletePayroll: id => dispatch(deletePayroll(id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Payslip);
