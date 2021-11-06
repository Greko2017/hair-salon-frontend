import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import ProductTable from './ProductTable';
import { Button } from 'antd';
import { deleteProduct, handleProductModalShowAction, setProductModalItem } from './product.actions';
import { fetchProduct } from 'containers/Product/product.actions';
import ProductModal from './ProductModal';

export class Product extends Component {
  componentDidMount() {
    this.props.fetchProduct();
  }
  get ListProps() {
    const { setProductModalItem, deleteProduct, handleProductModalShowAction } = this.props;
    return {
      onDeleteItem: id => {
        // console.log('In onDeleteItem :>> ', id);
        deleteProduct(id);
      },
      onEditItem: async item => {
        // console.log('In onEditItem :>> ', item);
        await setProductModalItem(item);
        await handleProductModalShowAction(item);
      },
    };
  }
  render() {
    return (
      <>
        <Helmet>
          <title>Product</title>
          <meta name="description" content="List of Product" />
        </Helmet>
        <ProductModal />
        <div style={{ marginBottom: 16 }}>
          <Button type="primary" onClick={this.props.handleProductModalShowAction}>
            Add
          </Button>
        </div>
        <ProductTable {...this.ListProps} />
      </>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => {
  return {
    fetchProduct: () => dispatch(fetchProduct()),
    handleProductModalShowAction: item => dispatch(handleProductModalShowAction(item)),
    setProductModalItem: item => dispatch(setProductModalItem(item)),
    deleteProduct: id => {
      dispatch(deleteProduct(id));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Product);
