import React, { Component } from 'react';
import {
  deleteCustomer,
  fetchCustomers,
  handleCustomerModalShowAction,
  setCustomerModalItem,
} from './customer.actions';
import CustomerModal from './CustomerModal';
import CustomerTable from './CustomerTable';
import { Button } from 'antd';
import { connect } from 'react-redux';

class Customer extends Component {
  componentDidMount() {
    this.props.fetchCustomers();
  }
  get ListProps() {
    const { setCustomerModalItem, deleteCustomer, handleCustomerModalShowAction } = this.props;
    return {
      onDeleteItem: id => {
        // console.log('In onDeleteItem :>> ', id);
        deleteCustomer(id);
      },
      onEditItem: async item => {
        // console.log('In onEditItem :>> ', item);
        await setCustomerModalItem(item);
        await handleCustomerModalShowAction(item);
      },
    };
  }
  render() {
    return (
      <div>
        <CustomerModal />
        <div style={{ marginBottom: 16 }}>
          <Button type="primary" onClick={this.props.handleCustomerModalShowAction}>
            Add
          </Button>
        </div>
        <CustomerTable {...this.ListProps} />
      </div>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => {
  return {
    fetchCustomers: () => dispatch(fetchCustomers()),
    handleCustomerModalShowAction: item => dispatch(handleCustomerModalShowAction(item)),
    setCustomerModalItem: item => dispatch(setCustomerModalItem(item)),

    deleteCustomer: id => {
      dispatch(deleteCustomer(id));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Customer);
