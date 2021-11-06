import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import CategoryTable from './CategoryTable';
import { Button } from 'antd';
import { deleteCategory, handleCategoryModalShowAction, setCategoryModalItem } from './category.actions';
import { fetchCategory } from 'containers/Category/category.actions';
import CategoryModal from './CategoryModal';

export class Category extends Component {
  componentDidMount() {
    this.props.fetchCategory();
  }
  get ListProps() {
    const { setCategoryModalItem, deleteCategory, handleCategoryModalShowAction } = this.props;
    return {
      onDeleteItem: id => {
        // console.log('In onDeleteItem :>> ', id);
        deleteCategory(id);
      },
      onEditItem: async item => {
        // console.log('In onEditItem :>> ', item);
        await setCategoryModalItem(item);
        await handleCategoryModalShowAction(item);
      },
    };
  }
  render() {
    return (
      <>
        <Helmet>
          <title>Category</title>
          <meta name="description" content="List of Category" />
        </Helmet>
        <CategoryModal />
        <div style={{ marginBottom: 16 }}>
          <Button type="primary" onClick={this.props.handleCategoryModalShowAction}>
            Add
          </Button>
        </div>
        <CategoryTable {...this.ListProps} />
      </>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => {
  return {
    fetchCategory: () => dispatch(fetchCategory()),
    handleCategoryModalShowAction: item => dispatch(handleCategoryModalShowAction(item)),
    setCategoryModalItem: item => dispatch(setCategoryModalItem(item)),
    deleteCategory: id => {
      dispatch(deleteCategory(id));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Category);
