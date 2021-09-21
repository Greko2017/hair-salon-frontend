import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { PageHeader, Tabs, Button, Statistic, Descriptions } from 'antd';
import { memo } from 'react';
import { compose } from 'redux';
import { fetchSalesNameLookUp, getSalesByParentId } from 'containers/Sales/sales.actions';
import SalesLineTable from './SalesLineTable';
import { fetchCustomers } from 'containers/Customer/customer.actions';
const { TabPane } = Tabs;

export class SalesLine extends Component {
  componentDidMount() {
      const {  getSalesByParentId, fetchCustomers, fetchSalesNameLookUp} = this.props
      const { sales_id } = this.props.match.params
      const loadData = (async () => {
        // await fetchSalesNameLookUp()
        await fetchCustomers()
      })()
      if (sales_id > 0) {
        // getSalesByParentId(sales_id)
      }
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
    const { sales_by_id } = this.props
    const {saleslines, name, owner, created, employee} = sales_by_id || {}
    const renderContent = (column = 2) => (
      <Descriptions size="small" column={column}>
        <Descriptions.Item label="Created By">{owner?.user?.username}</Descriptions.Item>
        <Descriptions.Item label="Employee">
          <a>{employee?.user?.username}</a>
        </Descriptions.Item>
        <Descriptions.Item label="Creation Time">{created?.substring(0,10)}</Descriptions.Item>
        <Descriptions.Item label="Effective Time">{created?.substring(0,10)}</Descriptions.Item>
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
        <Statistic title="Price" suffix="Fcfa" value={sales_by_id?.saleslines.reduce((prev, curr)=> {
          return prev + (curr.quantity * curr.amount_paid )
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
    sales_by_id: state.sales.sales_by_id
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchCustomers: ()=> dispatch(fetchCustomers()),
    // getSalesByParentId: (id)=> dispatch(getSalesByParentId(id)),
    // fetchSalesNameLookUp: ()=> dispatch(fetchSalesNameLookUp()),
  }
}

const withConnect = connect(mapStateToProps, mapDispatchToProps)

export default compose(withConnect, memo)(SalesLine)
