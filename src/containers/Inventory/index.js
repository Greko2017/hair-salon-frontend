import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import InventoryTable from './InventoryTable';
import { Button } from 'antd';
import {
  deleteInventory,
  fetchInventories,
  handleInventoryModalShowAction,
  setInventoryModalItem,
} from './inventory.actions';
import { fetchProduct } from 'containers/Product/product.actions';
import InventoryModal from './InventoryModal';

export class Inventory extends Component {
  componentDidMount() {
    this.props.fetchInventories();
    this.props.fetchProduct();
  }
  get ListProps() {
    const { setInventoryModalItem, deleteInventory, handleInventoryModalShowAction } = this.props;
    return {
      onDeleteItem: id => {
        // console.log('In onDeleteItem :>> ', id);
        deleteInventory(id);
      },
      onEditItem: async item => {
        // console.log('In onEditItem :>> ', item);
        await setInventoryModalItem(item);
        await handleInventoryModalShowAction(item);
      },
    };
  }
  render() {
    return (
      <>
        <Helmet>
          <title>Inventory</title>
          <meta name="description" content="List of Inventory" />
        </Helmet>
        <InventoryModal />
        <div style={{ marginBottom: 16 }}>
          <Button type="primary" onClick={this.props.handleInventoryModalShowAction}>
            Add
          </Button>
        </div>
        <InventoryTable {...this.ListProps} />
      </>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => {
  return {
    fetchInventories: () => dispatch(fetchInventories()),
    fetchProduct: () => dispatch(fetchProduct()),
    handleInventoryModalShowAction: item => dispatch(handleInventoryModalShowAction(item)),
    setInventoryModalItem: item => dispatch(setInventoryModalItem(item)),
    deleteInventory: id => {
      dispatch(deleteInventory(id));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Inventory);
