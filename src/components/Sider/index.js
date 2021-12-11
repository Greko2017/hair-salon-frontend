import React, { useState, memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { Layout, Menu, Icon } from 'antd';
import { makeSelectUser, makeSelectUserPermissionsCustom } from 'global.selectors';
import './sider.css';
import permisionListSelector from 'utils/permisionListSelector';
const { SubMenu } = Menu;
/* eslint-disable indent */
function Sider(props) {
  const [collapsed, setCollapsed] = useState(false);
  const onCollapse = () => {
    setCollapsed(!collapsed);
  };
  const { user_permissions } = props;
  const {
    payslip_un_approve,
    payslip_can_approve,
    user_inventory,
    management_inventory,
    payslip_can_un_approve,
    can_send_for_approval,
  } = permisionListSelector(user_permissions);
  return (
    <Layout.Sider collapsible onBreakpoint={!props.isMobile} collapsed={collapsed} onCollapse={onCollapse}>
      <div className="logo" />
      <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
        <Menu.Item key="1">
          <Link to="/">
            <Icon type="dashboard" />
            <span>Dashboard</span>
          </Link>
        </Menu.Item>
        <Menu.Item key="2">
          <Link to="/service">
            <Icon type="scissor" />
            <span>Service</span>
          </Link>
        </Menu.Item>
        <Menu.Item key="sub1">
          <Link to="/sales">
            <Icon type="wallet" />
            <span>Sales</span>
          </Link>
        </Menu.Item>
        {payslip_can_approve || payslip_can_un_approve || can_send_for_approval ? (
          <SubMenu
            key="sub2"
            title={
              <span>
                <Icon type="solution" />
                <span>Payroll</span>
              </span>
            }
          >
            <Menu.Item key="3">
              <Link to="/payslip">
                <Icon type="file-add" />
                <span>Employee Payslips</span>
              </Link>
            </Menu.Item>
            {/* <Menu.Item key="4">
            <Link to="/payslip_batch">
              <Icon type="usergroup-add" />
              <span>Payslips Batches</span>
            </Link>
          </Menu.Item> */}
            <Menu.Item key="5">
              <Link to="/payslip_to_approve">
                <Icon type="file-done" />
                <span>Payslips to approve</span>
              </Link>
            </Menu.Item>
          </SubMenu>
        ) : null}
        {user_inventory || management_inventory ? (
          <SubMenu
            key="inventory"
            title={
              <span>
                <Icon type="solution" />
                <span>Inventory</span>
              </span>
            }
          >
            <Menu.Item key="inventory1">
              <Link to="/inventory">
                <Icon type="file-add" />
                <span>Inventory List</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="inventory2">
              <Link to="/category">
                <Icon type="file-add" />
                <span>Category</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="inventory3">
              <Link to="/product">
                <Icon type="file-add" />
                <span>Product</span>
              </Link>
            </Menu.Item>
          </SubMenu>
        ) : null}
      </Menu>
    </Layout.Sider>
  );
}

Sider.propTypes = {
  user: PropTypes.object,
  location: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  user: makeSelectUser(),
  user_permissions: makeSelectUserPermissionsCustom(),
});

const withConnect = connect(mapStateToProps);

export default compose(withConnect, memo)(withRouter(props => <Sider {...props} />));
