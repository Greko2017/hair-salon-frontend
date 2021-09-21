import { Button } from 'antd'
import { fetchCustomers } from 'containers/Customer/customer.actions'
import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import { deleteSale, editSale, fetchSales, handleSaleModalShowAction, setSaleModalItem } from './sales.actions'
import SaleModal from './SaleModal'
import SaleTable from './SaleTable'

export class index extends Component {
  componentDidMount(){
    this.props.fetchSales()
    this.props.fetchCustomers()
  }
  get ListProps(){
    const { setSaleModalItem,deleteSale, handleSaleModalShowAction } = this.props
    return {
      onDeleteItem: id => {
        console.log('In onDeleteItem :>> ', id);
        deleteSale(id)
      },
      onEditItem: async item => {
        console.log('In onEditItem :>> ', item);
        await setSaleModalItem(item)
        await handleSaleModalShowAction(item)
      }
    }
  }
  render() {
    return (
      <>
        <Helmet>
          <title>Sales</title>
          <meta name="description" content="List of sales" />
        </Helmet>
        <SaleModal/>
        <div style={{marginBottom: 16}}>
          <Button type="primary" onClick={this.props.handleSaleModalShowAction}>
            Add
          </Button>
        </div>
        <SaleTable {...this.ListProps}/>
      </>
    )
  }
}

const mapStateToProps = (state) => ({
  SaleData: state.sale
})

const mapDispatchToProps = dispatch => {
  return {
    fetchSales: ()=> dispatch(fetchSales()),
    fetchCustomers: ()=> dispatch(fetchCustomers()),
    handleSaleModalShowAction : (item)=> dispatch(handleSaleModalShowAction(item)),
    setSaleModalItem : (item)=> dispatch(setSaleModalItem(item)),
    editSale : (params)=> dispatch(editSale(params)),
    deleteSale : (service_id)=> dispatch(deleteSale(service_id)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(index)
