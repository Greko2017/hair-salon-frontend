import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Input, Icon, Button } from 'antd';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import { makeSelectEmail, makeSelectPassword } from './signin.selectors';
import { postSignInAction, onChangeEmailAction, onChangePasswordAction } from './signin.actions';
import reducer from './signin.reducer';
import saga from './signin.saga';
import './index.css';
import { Link } from 'react-router-dom';
const key = 'signin';

function SignIn(props) {
  useInjectReducer({ key, reducer });
  useInjectSaga({ key, saga });

  return (
    <>
      <Helmet>
        <title>SignIn</title>
        <meta name="description" content="Description of SignIn" />
      </Helmet>
      <div className="signin__container">
        <div className="signin__content1"></div>
        <div className="signin__content2">
          <div className="signin__form">
            <div className="signin__icon"></div>
            <h1 className="class section__title">Sign In</h1>
            <h4 className="section__subtitle">Restez informé</h4>
            <div className="signin__form-content">
              <Input
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="Email"
                size="large"
                onChange={props.onChangeEmail}
                onPressEnter={props.postSignIn}
                value={props.email}
              />
            </div>
            <div className="signin__form-content">
              <Input.Password
                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="Password"
                size="large"
                onChange={props.onChangePassword}
                onPressEnter={props.postSignIn}
                value={props.password}
              />
            </div>
            <Button className="signin__form-content" type="primary" onClick={props.postSignIn}>
              Sign In
            </Button>
            <p className="section__subtitle">
              Don't have a Wave account yet? <Link to="#">Sign up now.</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

SignIn.propTypes = {
  email: PropTypes.string,
  password: PropTypes.string,
  postSignIn: PropTypes.func,
  onChangeEmail: PropTypes.func,
  onChangePassword: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  email: makeSelectEmail(),
  password: makeSelectPassword(),
});

const mapDispatchToProps = dispatch => ({
  postSignIn: () => dispatch(postSignInAction()),
  onChangeEmail: e => dispatch(onChangeEmailAction(e.target.value)),
  onChangePassword: e => dispatch(onChangePasswordAction(e.target.value)),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo)(SignIn);
