import { Icon, Input, Table, Button, Modal } from 'antd';
import DropOption from 'components/DropOption';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

const { confirm } = Modal;

export class PayrollTable extends Component {
  state = {
    ...this.state,
    searchText: '',
    searchedColumn: '',
    filteredInfo: null,
    sortedInfo: null,
  };

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    // console.log('in handleSearch:>> ', selectedKeys, dataIndex);
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };
  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys ? selectedKeys[0] : null}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
          Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) => {
      console.log('In onFilter :>> ', value, record);
      return record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : '';
    },
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
  });

  handleMenuClick = (record, e) => {
    const { onDeleteItem, onEditItem } = this.props;

    if (e.key === '1') {
      onEditItem(record);
    } else if (e.key === '2') {
      confirm({
        title: `Are you sure delete this record?`,
        onOk() {
          onDeleteItem(record.id);
        },
      });
    }
  };
  render() {
    let { sortedInfo, filteredInfo } = this.state;
    sortedInfo = sortedInfo || {};
    filteredInfo = filteredInfo || {};

    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: 50,
      },
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        width: 200,
        filteredValue: filteredInfo.name || null,
        render: (text, record) => {
          return <Link to={{ pathname: `/payslip/${record.id}`, state: { payrollDetailsData: record } }}>{text}</Link>;
        },
        ...this.getColumnSearchProps('name'),
      },
      {
        title: 'Created At',
        dataIndex: 'created_at',
        key: 'created_at',
        render: time => {
          // let day = moment(time)
          return time.toString().substring(0, 10);
        },
        filteredValue: filteredInfo.created_at || null,
        ...this.getColumnSearchProps('created_at'),
        render: time => <span>{time.toString().substring(0, 10)}</span>,
      },
      {
        title: 'Employee',
        dataIndex: 'employee',
        key: 'employee',
        render: employee => <span>{employee?.user?.username}</span>,
      },
      {
        title: 'Period',
        dataIndex: 'period',
        key: 'period',
        render: (period, record) => {
          return (
            <span>
              {record.date_from.toString().substring(0, 10)}
              <strong> - </strong>
              {record.date_to.toString().substring(0, 10)}
            </span>
          );
        },
      },
      {
        title: 'Net Salary',
        dataIndex: 'net_salary',
        key: 'net_salary',
        render: net_salary => {
          return <span>{net_salary}</span>;
        },
      },
      {
        title: 'Total Other Pay',
        dataIndex: 'other_pays',
        key: 'other_pays',
        render: other_pays => {
          let total_other_pay = 0;
          other_pays.forEach((other_pay, i) => {
            total_other_pay = total_other_pay + other_pay.amount;
          });
          return <span>{total_other_pay}</span>;
        },
      },
      {
        title: 'Total deduction',
        dataIndex: 'deductions',
        key: 'deductions',
        render: deductions => {
          let total_deduction = 0;
          deductions.forEach((deduction, i) => {
            total_deduction = total_deduction + deduction.amount;
          });
          return <span>{total_deduction}</span>;
        },
        sorter: (a, b) => {
          // console.log('sorter', a, b);
          return a.amount_paid - b.amount_paid;
        },
        sortOrder: sortedInfo.columnKey === 'amount_paid' && sortedInfo.order,
        ...this.getColumnSearchProps('amount_paid'),
      },
      // {
      //   title: 'Payment Method',
      //   dataIndex: 'salelines.payment_method',
      //   key: 'payment_method',
      //   render: salelines => {
      //     let payment_method =
      //       salelines !== undefined && salelines[0] !== undefined ? salelines[0].payment_method : 'N/A';
      //     return <span>{payment_method}</span>;
      //   },
      //   filteredValue: filteredInfo.payment_method || null,
      //   ...this.getColumnSearchProps('payment_method'),
      // },
      {
        title: <span>Operation</span>,
        key: 'operation',
        fixed: 'right',
        width: 100,
        render: (text, record) => {
          return (
            <DropOption
              onMenuClick={e => this.handleMenuClick(record, e)}
              menuOptions={[
                { key: '1', name: `Update` },
                { key: '2', name: `Delete` },
                { key: '3', name: `Generate Report` },
              ]}
            />
          );
        },
      },
    ];

    return (
      <div>
        <Table
          rowKey={record => record.id}
          onChange={this.handleChange}
          dataSource={this.props.payrollList}
          columns={columns}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  payrollList: state.payroll.payrolls,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(PayrollTable);
