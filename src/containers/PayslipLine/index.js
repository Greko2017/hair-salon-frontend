import React, { Component } from 'react';
import { connect } from 'react-redux';
import { PageHeader, Tabs, Button, Statistic, Descriptions } from 'antd';
import { memo } from 'react';
import { compose } from 'redux';
import { editPayroll, getPayrollById } from 'containers/Payslip/payroll.actions';
import OtherPayTable from 'containers/OtherPay/OtherPayTable';
import { getOtherPaysByParentId } from 'containers/OtherPay/otherpay.actions';
import DeductionTable from 'containers/Deduction/DeductionTable';
import { getDeductionsByParentId } from 'containers/Deduction/deduction.actions';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import logo from './image/logo.png';
import { setPayrollToApprove } from 'containers/PayslipToApprove/payroll_to_approve.actions';
import getStatusLookup from 'utils/getStatus';
import permisionListSelector from 'utils/permisionListSelector';
// import {hashHistory}
const { TabPane } = Tabs;

export class PayslipLine extends Component {
  componentDidMount() {
    const { getPayrollById, getOtherPaysByParentId, setPayrollToApprove, getDeductionsByParentId } = this.props;
    const loadData = (async () => {
      const { payslip_id } = this.props.match.params;
      // console.log(`--- componentDidMount PayslipLine`, this.props);
      await getPayrollById(payslip_id);
      await getOtherPaysByParentId(payslip_id);
      await getDeductionsByParentId(payslip_id);
    })().then(() => {
      const { user_permissions } = this.props;
      const { to_approve } = this.props.history.location.state;
      console.log('In componentDidMount to_approve :>> ', this.props);
      if (to_approve && to_approve === true) {
        this.props.setPayrollToApprove(to_approve);
      }
    });
  }

  componentWillUnmount() {
    this.props.setPayrollToApprove(false);
  }
  generatePayslipReport() {
    // console.log(`In generatePayslipReport`);
    const {
      name,
      employee,
      date_from,
      date_to,
      worked_value,
      other_pays,
      computed_salary,
      deductions,
      net_salary,
    } = this.props.parent;
    // Landscape export, 2×4 inches
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [210, 297],
    });
    doc.addImage(logo, 15, 15, 25, 25);
    doc.setFontSize(11);
    doc.setFont('Helvertica', 'bold');
    doc.text(name, 15, 55);
    doc.setFont('Helvertica', 'normal');
    doc.text(` Username : ${employee.user.username}`, 150, 55);
    doc.text(`First Name : ${employee.user.first_name}`, 150, 60);
    doc.text(`Last Name : ${employee.user.last_name}`, 150, 65);

    doc.text(`Date From : ${date_from}`, 15, 75);
    doc.text(`    Date To : ${date_to}`, 15, 80);

    doc.text(`Service render Amount : ${worked_value}`, 15, 90);
    doc.text(`Income Salary : ${employee.salary_id.income || 0}`, 15, 95);
    // doc.setFont('Helvertica', 'bold');
    doc.text(`Percentage salary ( ${employee.salary_id.percentage}% ) : ${computed_salary}`, 15, 100);
    // doc.setFont('Helvertica', 'normal');
    doc.text(
      `Other Pays : ${other_pays?.reduce((prev, curr) => {
        return prev + curr.amount;
      }, 0)}`,
      15,
      105,
    );
    doc.text(
      `Deductions : ${deductions?.reduce((prev, curr) => {
        return prev + curr.amount;
      }, 0)}`,
      15,
      110,
    );
    doc.setFont('Helvertica', 'bold');
    doc.text(`Net Salary : ${net_salary}`, 150, 110);

    doc.text('Other Pays', 15, 120);
    // Or use javascript directly:
    autoTable(doc, {
      startY: 125,
      head: [['Name', 'Amount', 'Description', 'Created At']],
      body: other_pays?.map(curr => {
        return [curr.name, curr.amount, curr.description, curr.created_at.substring(0, 10)];
      }),
    });

    doc.text('Deductions', 15, 175);
    autoTable(doc, {
      startY: 180,
      head: [['Name', 'Amount', 'Description', 'Created At']],
      body: deductions?.map(curr => {
        return [curr.name, curr.amount, curr.description, curr.created_at.substring(0, 10)];
      }),
    });

    doc.save(`${name}_REPORT.pdf`);
  }

  editStatus = value => {
    const { editPayroll, parent } = this.props;
    let payslip = {
      id: parent.id,
      employee: parent.employee.id,
      date_from: parent.date_from,
      date_to: parent.date_to,
      status: value,
    };

    editPayroll(payslip);
  };

  render() {
    const { parent, user_permissions } = this.props;
    const { evaluated, to_approve, approver, modifier } = this.props.permissions;
    const { name, owner, created_at, date_from, date_to, employee } = parent;

    const { payslip_un_approve, payslip_can_approve } = permisionListSelector(user_permissions);

    // console.log(`evaluated`, evaluated, to_approve, this.props);

    const renderContent = (column = 2) => (
      <Descriptions size="small" column={column}>
        <Descriptions.Item label="Created By">{owner?.username}</Descriptions.Item>
        <Descriptions.Item label="Employee">
          <a>{employee?.user?.username}</a>
        </Descriptions.Item>
        <Descriptions.Item label="Date from">{date_from?.substring(0, 10)}</Descriptions.Item>
        <Descriptions.Item label="Created at">{created_at?.substring(0, 10)}</Descriptions.Item>
        <Descriptions.Item label="Date to">{date_to?.substring(0, 10)}</Descriptions.Item>
      </Descriptions>
    );

    const extraContent = (
      <div
        style={{
          display: 'flex',
          width: 'max-content',
          justifyContent: 'flex-end',
        }}
      >
        <Statistic
          title="Status"
          value={getStatusLookup(parent.status)}
          style={{
            marginRight: 32,
          }}
        />
        <Statistic
          title="Total Other Pays"
          suffix="Fcfa"
          style={{
            marginRight: 32,
          }}
          value={parent?.other_pays?.reduce((prev, curr) => {
            return prev + curr.amount;
          }, 0)}
        />
        <Statistic
          title="Total Deductions"
          suffix="Fcfa"
          value={parent?.deductions?.reduce((prev, curr) => {
            return prev + curr.amount;
          }, 0)}
        />
      </div>
    );

    const Content = ({ children, extra }) => {
      return (
        <div className="content">
          <div className="main">{children}</div>
          <div className="extra">{extra}</div>
        </div>
      );
    };
    return (
      <div>
        <div>
          <PageHeader
            style={{
              border: '1px solid rgb(235, 237, 240)',
            }}
            onBack={() =>
              this.props.history.push(
                this.props.location.state.parent_path ? `/${this.props.location.state.parent_path}` : '/payslip',
              )
            }
            title={name}
            subTitle="This is a subtitle"
            extra={(() => {
              const btnList = [];
              let { payslip_can_approve, payslip_un_approve, can_send_for_approval } = permisionListSelector(
                this.props.user_permissions,
              );
              let { evaluated, to_approve } = this.props.permissions;
              let { status } = this.props.parent;
              const generateBtn = (
                <Button key="3" onClick={() => this.generatePayslipReport()}>
                  Generate
                </Button>
              );
              const rejectBtn = (
                <Button key="2" onClick={() => this.editStatus('un_approve')}>
                  Reject
                </Button>
              );
              const approveBtn = (
                <Button key="1" onClick={() => this.editStatus('approve')} type="primary">
                  Approve
                </Button>
              );
              const senForApprovalBtn = (
                <Button key="4" onClick={() => this.editStatus('pending')} type="primary">
                  Send For Approval
                </Button>
              );
              if (evaluated && to_approve) {
                btnList.push(rejectBtn, approveBtn);
              } else if (can_send_for_approval && (status === 'draft' || status === 'un_approve')) {
                btnList.push(senForApprovalBtn);
                btnList.unshift(generateBtn);
              }
              return btnList;
            })()}
            footer={
              <>
                <Tabs defaultActiveKey="1">
                  <TabPane tab="Other Pays" key="1">
                    <div style={{ paddingTop: 16 }}>
                      <OtherPayTable tableParam={this.props.payroll_by_id?.payrollline} />
                    </div>
                  </TabPane>
                </Tabs>
                <Tabs defaultActiveKey="1">
                  <TabPane tab="Deductions" key="1">
                    <div style={{ paddingTop: 16 }}>
                      <DeductionTable tableParam={this.props.payroll_by_id?.payrollline} />
                    </div>
                  </TabPane>
                </Tabs>
              </>
            }
          >
            {<Content extra={extraContent}>{renderContent()}</Content>}
          </PageHeader>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    payrollList: state.payroll.payrolls,
    parent: state.payroll.parent,
    permissions: state.payroll_to_approve.permissions,
    user_permissions: state.global.user.user_permissions,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    // fetchCustomers: ()=> dispatch(fetchCustomers()),
    getPayrollById: payroll_id => dispatch(getPayrollById(payroll_id)),
    getOtherPaysByParentId: parent_id => {
      dispatch(getOtherPaysByParentId(parent_id));
    },
    getDeductionsByParentId: parent_id => {
      dispatch(getDeductionsByParentId(parent_id));
    },
    setPayrollToApprove: boolean => dispatch(setPayrollToApprove(boolean)),
    editPayroll: value => dispatch(editPayroll(value)),
  };
};

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo)(PayslipLine);
