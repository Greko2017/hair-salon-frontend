import React, {Component} from "react";
// import { Router } from "react-router";
import { connect } from "react-redux";
import LayoutCustom from "components/Layout";
import BaseRouter from "components/BaseRouter";
// import { fetchEmployees } from "containers/Employee/employee.actions";
// import { fetchSalaries } from "containers/Salary/salary.actions";

class App extends Component {
  componentDidMount(){
  }
  render(){return (
      <LayoutCustom>
        <BaseRouter />
      </LayoutCustom>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    // isAuthenticated: state.auth.token !== null,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    // onTryAutoSignup: () => dispatch(actions.authCheckState()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);

// https://www.pluralsight.com/guides/how-to-show-and-hide-reactjs-components
