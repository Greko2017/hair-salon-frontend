import React, { Component, memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Table, Modal, Button, Input, Icon } from 'antd';
import { compose } from 'redux';
import DropOption from '../../../components/DropOption';
import { Link } from 'react-router-dom';
const { confirm } = Modal;

class SaleTable extends Component {
  static propTypes = {
    prop: PropTypes,
  };

  state = {
    ...this.state,
    searchText: '',
    searchedColumn: '',
    filteredInfo: null,
    sortedInfo: null,
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
      // console.log('In onFilter :>> ', value, record);
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

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    // console.log('in handleSearch:>> ', selectedKeys, dataIndex);
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: '' });
  };

  clearFilters = () => {
    console.log('clearFilters', this.state);
    this.setState({ filteredInfo: null });
  };

  clearAll = () => {
    console.log('clearAll', this.state);
    this.setState({
      filteredInfo: null,
      sortedInfo: null,
    });
  };

  setNumberSort = () => {
    console.log('setNumberSort', this.state);
    this.setState({
      sortedInfo: {
        order: 'descend',
        columnKey: 'amount_paid',
      },
    });
  };

  handleChange = (pagination, filters, sorter) => {
    // console.log('Various parameters', pagination, filters, sorter);
    this.setState({
      filteredInfo: filters,
      sortedInfo: sorter,
    });
  };
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
    // console.log('this.props.saleList :>> ', this.props.saleList);

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
        width: 250,
        filteredValue: filteredInfo.name || null,
        render: (text, record) => {
          return <Link to={{ pathname: `/sales/${record.id}`, state: { salesDetailsData: record } }}>{text}</Link>;
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
        title: 'Saler',
        dataIndex: 'saler',
        key: 'saler_id',
        render: saler => <span>{saler.user.username}</span>,
      },
      {
        title: 'Customer (Cst)',
        dataIndex: 'customer',
        key: 'firstname',
        render: customer => {
          return <span>{customer.firstname}</span>;
        },
      },
      {
        title: 'Phone (Cst)',
        dataIndex: 'customer',
        key: 'phone_number',
        render: customer => {
          return <span>{customer.phone_number}</span>;
        },
      },
      {
        title: 'Amount Paid',
        dataIndex: 'salelines',
        key: 'amount_paid',
        render: salelines => {
          let amount_paid = 0;
          salelines.forEach((saleline, i) => {
            amount_paid =
              amount_paid + saleline.product.selling_price * saleline.product_quantity * (saleline.is_credit ? -1 : 1);
          });
          return <span>{`${amount_paid} Fcfa`}</span>;
        },
        sorter: (a, b) => {
          // console.log('sorter', a, b);
          return a.amount_paid - b.amount_paid;
        },
        sortOrder: sortedInfo.columnKey === 'amount_paid' && sortedInfo.order,
        ...this.getColumnSearchProps('amount_paid'),
      },
      {
        title: 'Payment Method',
        dataIndex: 'salelines',
        key: 'payment_method',
        render: salelines => {
          console.log(`salelines`, salelines);
          let payment_method =
            salelines !== undefined && salelines[0] !== undefined ? salelines[0].payment_method : 'N/A';
          return <span>{payment_method}</span>;
        },
        filteredValue: filteredInfo.payment_method || null,
        filters: [
          { text: 'MOMO', value: 'momo' },
          { text: 'OM', value: 'om' },
          { text: 'Cash', value: 'cash' },
        ],
        onFilter: (value, record) => {
          console.log('In onFilter :>> ', value, record);
          return record.salelines[0]
            ? record.salelines[0]['payment_method'].toString().toLowerCase() === value.toLowerCase()
            : '';
        },
      },
      {
        title: <span>Operation</span>,
        key: 'operation',
        align: 'center',
        width: 100,
        render: (text, record) => {
          return (
            <DropOption
              onMenuClick={e => this.handleMenuClick(record, e)}
              menuOptions={[
                { key: '1', name: `Update` },
                { key: '2', name: `Delete` },
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
          dataSource={this.props.saleList}
          columns={columns}
        />
      </div>
    );
  }
}

SaleTable.propTypes = {
  saleList: PropTypes.array,
};

const mapStateToProps = state => {
  // console.log('state :>> ', state);
  return {
    saleList: state.sales.sales,
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo)(SaleTable);
