import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { PageHeader, Tabs, Button, Statistic, Descriptions } from 'antd';
import { memo } from 'react';
import { compose } from 'redux';
import SalesLineTable from './SalesLineTable';
import { fetchCustomers } from 'containers/Customer/customer.actions';
import { getSalesLineByParentId } from './salesline.actions';
import { fetchProduct } from 'containers/Product/product.actions';
import { fetchSales, getSaleById } from 'containers/Sales/sales.actions';
const { TabPane } = Tabs;

export class SalesLine extends Component {
  componentDidMount() {
      const {  getSalesLineByParentId,fetchProduct, fetchCustomers, getSaleById,fetchSalesNameLookUp} = this.props
      const { sales_id } = this.props.match.params
      const loadData = (async () => {
        await getSaleById(sales_id)
        await getSalesLineByParentId(sales_id)
        await fetchCustomers()
        await fetchProduct()
        await fetchSales()
      })()
  }
  static propTypes = {
    prop: PropTypes
  }
  get tableParam(){
    const {saleslines} = this.props.sales_by_id || {}
    // console.log('this.props.sales_by_id.saleslines :>> ', saleslines);
    return {
      saleslines:saleslines ,
    }
  }
  render() {
    const { saleslines_by_parent_id } = this.props
    const {saleslines, name, owner, created_at, saler} = saleslines_by_parent_id.length > 0 ? saleslines_by_parent_id[0].parent : {}
    const renderContent = (column = 2) => (
      <Descriptions size="small" column={column}>
        <Descriptions.Item label="Created By">{owner?.user?.username}</Descriptions.Item>
        <Descriptions.Item label="Employee">
          <a>{saler?.user?.username}</a>
        </Descriptions.Item>
        <Descriptions.Item label="Creation Time">{created_at?.substring(0,10)}</Descriptions.Item>
        <Descriptions.Item label="Effective Time">{created_at?.substring(0,10)}</Descriptions.Item>
        <Descriptions.Item label="">{}</Descriptions.Item>
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
          value="Pending"
          style={{
            marginRight: 32,
          }}
        />
        <Statistic title="Price" suffix="Fcfa" value={saleslines_by_parent_id?.reduce((prev, curr)=> {
          return prev + (curr.product_quantity * curr.amount_paid )
        }, 0)} />
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
              onBack={() => window.history.back()}
              title={name}
              subTitle="This is a subtitle"
              extra={[
                <Button key="3">Operation</Button>,
                <Button key="2">Operation</Button>,
                <Button key="1" type="primary">
                  Primary
                </Button>,
              ]}
              footer={
                <Tabs defaultActiveKey="1">
                    <TabPane tab="Details" key="1" >
                        <div style={{ paddingTop: 16 }}>
                          <SalesLineTable tableParam={ this.props.sales_by_id?.salesline } />
                        </div>
                    </TabPane>
                    <TabPane tab="Settings" key="2" >
                        <div style={{ padding: 16, display: 'flex', justifyContent: 'flex-start', }}>
                            Settings Part
                        </div>
                    </TabPane>
                </Tabs>
              }
            >
              <Content extra={extraContent}>{renderContent()}</Content>
            </PageHeader>
          </div>
      </div>
    )
  }
}
SalesLine.propTypes = {
  salesList: PropTypes.array,
};

const mapStateToProps = (state) => {
  return {
    salesList: state.sales.sales,
    saleslines_by_parent_id: state.salesline.saleslines_by_parent_id
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchCustomers: ()=> dispatch(fetchCustomers()),
    getSalesLineByParentId: (_id) => dispatch(getSalesLineByParentId(_id)),
    getSaleById: (id)=> dispatch(getSaleById(id)),
    fetchProduct: ()=> dispatch(fetchProduct()),
    fetchSales: ()=> dispatch(fetchSales())
  }
}

const withConnect = connect(mapStateToProps, mapDispatchToProps)

export default compose(withConnect, memo)(SalesLine)
