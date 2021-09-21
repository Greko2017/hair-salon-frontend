import React, { Component } from "react";
import {
  Layout,
  Breadcrumb,
} from "antd";
import { connect } from "react-redux";

import Header from 'components/Header';
import Sider from 'components/Sider';
import { Helmet } from "react-helmet";
import { enquireScreen, unenquireScreen } from 'enquire-js'
import { fetchEmployees } from "containers/Employee/employee.actions";
import { fetchSalaries } from "containers/Salary/salary.actions";

class LayoutCustom extends Component {
  state = {
    showSider: false,
    showHeader: false,
    isMobile: false,
  };
  componentDidMount() {
    this.props.fetchEmployees()
    this.props.fetchSalaries()
    this.enquireHandler = enquireScreen(mobile => {
      const { isMobile } = this.state
      if (isMobile !== mobile) {
        this.setState({
          isMobile: mobile,
        })
      }
    })
    let token = this.props.token
    // console.log('Layout cdm token :>> ', token);
    this.isLogIng(token)
  }
  componentWillUnmount() {
    unenquireScreen(this.enquireHandler)
  }
  onCollapseChange = collapsed => {
    this.props.dispatch({
      type: 'app/handleCollapseChange',
      payload: collapsed,
    })
  }
  get siderProps (){
    return {
      isMobile: this.state.isMobile,
      collapsed: this.state.collapsed,
      onCollapseChange: this.state.onCollapseChange,
    }
  }

  hideComponent =(name)=> {
    // console.log(name);
    let switch_value = name === 'showSider' ? this.setState({ showSider: !this.state.showSider }) : name === 'showHeader' ? this.setState({ showHeader: !this.state.showHeader }) : null

  }
  isLogIng  = (token)=>{
    if (token && token.toString().length > 30){
      this.hideComponent('showSider');
      this.hideComponent('showHeader');
    }
  }
  render() {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Helmet titleTemplate="%s - Hair Salon management" defaultTitle="Hair Salon management">
          <meta name="description" content="A Hair Salon management application" />
        </Helmet>{' '}

        {this.props.location.pathname!=="/signin" ? (
          <>
            <Sider {...this.siderProps}/>
            <Layout>
              <Header />
              <Layout>
                <Breadcrumb style={{ margin: '16px 50px' }}>
                  <Breadcrumb.Item>Home</Breadcrumb.Item>
                  <Breadcrumb.Item>List</Breadcrumb.Item>
                  <Breadcrumb.Item>App</Breadcrumb.Item>
                </Breadcrumb>
                <Layout.Content style={{ padding: '0 50px', marginTop: 64 }}>
                  <div style={{ background: '#fff', padding: 24, minHeight: 380 }}>
                      {React.cloneElement(this.props.children)}
                  </div>
                </Layout.Content>{' '}
                <Layout.Footer style={{ textAlign: 'center' }}> Hair Salon management </Layout.Footer>{' '}
              </Layout>{' '}
            </Layout>{' '}
          </>
        ) : (
          <Layout>
            <Layout.Content>
              <div>
                  {React.cloneElement(this.props.children)}
              </div>
            </Layout.Content>
          </Layout>
        )}
      </Layout>
    )
  }
}

const mapStateToProps = (state) => {
  // console.log('state :>> ', state);
  return {
    token: state.global ? state.global.token : '',
    location: state.router.location
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    // onTryAutoSignup: () => dispatch(actions.authCheckState()),
    fetchEmployees: () => dispatch(fetchEmployees()),
    fetchSalaries: () => dispatch(fetchSalaries()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LayoutCustom);
