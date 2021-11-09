import { Button } from 'antd';
import { handlePayrollModalShowAction, setPayrollModalItem } from 'containers/Payslip/payroll.actions';
import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import PayrollToApproveTable from './PayrollToApproveTable';
import { fetchPayrollsToApprove } from './payroll_to_approve.actions';

export class PayslipToApprove extends Component {
  componentDidMount() {
    this.props.fetchPayrollsToApprove();
  }
  get ListProps() {
    const { setPayrollToApproveModalItem, deletePayrollToApprove, handlePayrollToApproveModalShowAction } = this.props;
    return {
      onDeleteItem: id => {
        // console.log('In onDeleteItem :>> ', id);
        deletePayrollToApprove(id);
      },
      onEditItem: async item => {
        // console.log('In onEditItem :>> ', item);
        await setPayrollToApproveModalItem(item);
        await handlePayrollToApproveModalShowAction(item);
      },
    };
  }
  render() {
    return (
      <>
        <Helmet>
          <title>Payrolls To Approve</title>
          <meta name="description" content="List of payroll to approve" />
        </Helmet>
        {/* <div style={{ marginBottom: 16 }}>
          <Button type="primary" onClick={this.props.handlePayrollModalShowAction}>
            Add
          </Button>
        </div> */}
        <PayrollToApproveTable {...this.ListProps} />
      </>
    );
  }
}

const mapStateToProps = state => {
  return {};
};
const mapDispatchToProps = dispatch => {
  return {
    fetchPayrollsToApprove: () => dispatch(fetchPayrollsToApprove()),
    handlePayrollModalShowAction: item => dispatch(handlePayrollModalShowAction(item)),
    setPayrollModalItem: item => dispatch(setPayrollModalItem(item)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PayslipToApprove);
