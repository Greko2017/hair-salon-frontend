import { Icon, Input, Table, Button, Modal } from 'antd';
import DropOption from 'components/DropOption';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import permisionListSelector from 'utils/permisionListSelector';

const { confirm } = Modal;

export class ProductTable extends Component {
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
        columnKey: 'product_qty_in_stock',
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

  render() {
    let { sortedInfo, filteredInfo } = this.state;
    sortedInfo = sortedInfo || {};
    filteredInfo = filteredInfo || {};
    const { user_inventory, management_inventory } = permisionListSelector(this.props.user_permissions);
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
          return <Link to={{ pathname: `/product/${record.id}`, state: { productDetailsData: record } }}>{text}</Link>;
        },
        ...this.getColumnSearchProps('name'),
      },
      {
        title: 'Category',
        dataIndex: 'category',
        key: 'category',
        render: category => <span>{category?.name}</span>,
      },
      {
        title: 'Seeling Price',
        dataIndex: 'selling_price',
        key: 'product_selling_price',
        render: selling_price => <span>{selling_price}</span>,
        sorter: (a, b) => {
          return a.selling_price - b.selling_price;
        },
        sortOrder: sortedInfo.columnKey === 'product_selling_price' && sortedInfo.order,
        ...this.getColumnSearchProps('product_selling_price'),
      },
      {
        title: 'Cost Price',
        dataIndex: 'cost_price',
        key: 'product_cost_price',
        render: cost_price => <span>{cost_price}</span>,
        sorter: (a, b) => {
          return a.cost_price - b.cost_price;
        },
        sortOrder: sortedInfo.columnKey === 'product_cost_price' && sortedInfo.order,
        ...this.getColumnSearchProps('product_cost_price'),
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
                user_inventory || management_inventory
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
          dataSource={this.props.productList}
          columns={columns}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  products: state.product.products,
  user_permissions: state.global.user.user_permissions,
  productList: state.product.products,
});

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductTable);
