import React, { memo, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Link } from 'react-router-dom';
import { compose } from 'redux';
import { Menu, Layout, Popover, Badge, Icon } from 'antd';

import { makeSelectUser } from 'global.selectors';
// import styles from './Header.less'
import './header.css';
import { logoutAction } from 'containers/SignIn/signin.actions';

const content_popover = (
  <div>
    <p>No notifications</p>
  </div>
);

const { SubMenu } = Menu;
class Header extends PureComponent {
  componentDidMount() {
    // useInjectSaga({ key, authLogoutSaga });
    // console.log(`this.props.user`, this.props.user);
  }

  handleLogoutClick = async e => {
    // console.log('this.props :>> ', this.props);
    e.key === 'logout' && this.props.authLogout();
  };
  render() {
    return (
      <Layout.Header className="header">
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']} style={{ lineHeight: '64px' }}>
          {/* <Menu.Item key="stations">
            <Link to="/stations">Menu 1</Link>
          </Menu.Item>
          <Menu.Item key="services">
            <Link to="/services">Menu 2</Link>
          </Menu.Item>
          <Menu.Item key="attendance">
            <Link to="/attendance">Menu 3</Link>
          </Menu.Item>
          <Menu.Item key="revenue">
            <Link to="/revenue">Menu 4</Link>
          </Menu.Item> */}
          <SubMenu
            style={{ float: 'right', marginRight: '5', marginLeft: '5' }}
            title={
              <span>
                <Icon type="user" style={{ fontSize: 20, color: 'white' }} />
                {this.props.username}
              </span>
            }
          >
            <Menu.Item key="user_profile">
              <Icon type="user" />
              User Profil
            </Menu.Item>
            <Menu.Item key="user_setting">
              <Icon type="setting" />
              Settings
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="logout" onClick={this.handleLogoutClick}>
              <Icon type="logout" />
              Logout
            </Menu.Item>
          </SubMenu>
          <Menu.Item style={{ float: 'right', marginRight: '5', marginLeft: '5' }}>
            <Popover placement="bottom" title={<span>Infos</span>} content={content_popover}>
              <Badge count={0} dot>
                <Icon type="bell" style={{ fontSize: 20, color: 'white' }} />
              </Badge>
            </Popover>
          </Menu.Item>
        </Menu>
      </Layout.Header>
    );
  }
}

Header.propTypes = {
  user: PropTypes.object,
};

// const mapStateToProps = createStructuredSelector({
//   user: makeSelectUser(),
// });

const mapStateToProps = state => {
  return {
    username: state.global.username,
  };
};

const mapDispatchToProps = dispatch => ({
  authLogout: () => dispatch(logoutAction()),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo)(Header);
