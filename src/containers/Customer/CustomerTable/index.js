import React, { Component } from 'react';
import { Icon, Input, Table, Button, Modal } from 'antd';
import DropOption from 'components/DropOption';
import { Link } from 'react-router-dom';
import permisionListSelector from 'utils/permisionListSelector';
import { connect } from 'react-redux';

const { confirm } = Modal;

class CustomerTable extends Component {
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
      if (dataIndex === 'full_name') {
        return record['firstname'] !== false
          ? record['firstname']
              ?.toString()
              .toLowerCase()
              ?.includes(value?.toLowerCase())
          : false || record['firstname'] !== false
          ? record['lastname']
              .toString()
              ?.toLowerCase()
              ?.includes(value?.toLowerCase())
          : false;
      }
      return record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value?.toLowerCase())
        : '';
    },
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
  });

  clearAll = () => {
    console.log('clearAll', this.state);
    this.setState({
      filteredInfo: null,
      sortedInfo: null,
    });
  };

  setNumberSort = () => {
    // console.log('setNumberSort', this.state);
    this.setState({
      sortedInfo: {
        order: 'descend',
        columnKey: 'phone_number',
      },
    });
  };
  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: '' });
  };

  clearFilters = () => {
    // console.log('clearFilters', this.state);
    this.setState({ filteredInfo: null });
  };

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    console.log(`handleSearch`, dataIndex);
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
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

  handleChange = (pagination, filters, sorter) => {
    // console.log('Various parameters', pagination, filters, sorter);
    this.setState({
      filteredInfo: filters,
      sortedInfo: sorter,
    });
  };

  render() {
    let { sortedInfo, filteredInfo } = this.state;
    sortedInfo = sortedInfo || {};
    filteredInfo = filteredInfo || {};
    const { user_customer, management_customer } = permisionListSelector(this.props.user_permissions);
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
        filteredValue: filteredInfo.name || null,
        render: (text, record) => {
          return (
            <Link to={{ pathname: `/customer`, state: { customerDetailsData: record } }}>{`${
              record.gender === 'male' ? 'Mr.' : 'Mm.'
            } ${record.firstname}, ${record.lastname}`}</Link>
          );
        },

        ...this.getColumnSearchProps('full_name'),
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        render: email => <span>{email}</span>,
      },
      {
        title: 'Gender',
        dataIndex: 'gender',
        key: 'gender',
        render: gender => <span>{gender}</span>,
        // filteredValue: filteredInfo.genre || null,
        filters: [
          { text: 'Male', value: 'male' },
          { text: 'Female', value: 'female' },
        ],
        onFilter: (value, record) => {
          console.log(
            'In onFilter genre :>> ',
            value,
            record['gender'],
            record,
            record['gender'] ? record['gender'].toString().toLowerCase() === value.toLowerCase() : false,
          );
          return record['gender'] ? record['gender'].toString().toLowerCase() === value.toLowerCase() : false;
        },

        // ...this.getColumnSearchProps('gender'),
      },

      {
        title: 'Phone Number',
        dataIndex: 'phone_number',
        key: 'phone_number',
        render: phone_number => <span>{phone_number}</span>,
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
              menuOptions={
                user_customer || management_customer
                  ? [
                      { key: '1', name: `Update` },
                      { key: '2', name: `Delete` },
                    ]
                  : []
              }
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
          dataSource={this.props.customerList}
          columns={columns}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user_permissions: state.global.user.user_permissions,
  customerList: state.customer.customers,
});

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(CustomerTable);
