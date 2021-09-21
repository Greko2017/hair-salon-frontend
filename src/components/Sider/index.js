import React, { useState, memo } from "react";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { Layout, Menu,  Icon } from 'antd';
import { makeSelectUser } from 'global.selectors';
import "./sider.css";
const { SubMenu } = Menu;
/* eslint-disable indent */
function Sider(props) {
  const [collapsed, setCollapsed] = useState(false);
  const onCollapse = ()=>{
    setCollapsed(!collapsed)
  }
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
              <Link to="service">
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
});


const withConnect = connect(
  mapStateToProps,
);

export default compose(
  withConnect,
  memo,
)(withRouter(props => <Sider {...props} />));

