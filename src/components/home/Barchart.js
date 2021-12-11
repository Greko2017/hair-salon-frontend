import React, { memo } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { compose } from 'redux';
import { connect } from 'react-redux';

class Barchart extends React.Component {
  static jsfiddleUrl = 'https://jsfiddle.net/alidingling/90v76x08/';
  state = {
    data: [],
  };
  componentDidMount() {
    const { employee_service_performance } = this.props;
    const data = employee_service_performance.map(performance => {
      return {
        username: performance.parent_id__employee_id__user__username,
        total_amount: performance.total_employee_service_amount,
      };
    });
    this.setState(prev => {
      return {
        ...prev,
        data: data,
      };
    });
  }
  render() {
    const iconName = `/static/images/icon-${this.props.icon}.png `;
    // console.log(`In render `, this.state.data);
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={this.props.employee_service_performance}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="parent_id__employee_id__user__username" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="total_employee_service_amount" stackId="a" fill="#5984EE" />
          {/* <Bar dataKey="uv" stackId="a" fill="#45CD93" /> */}
        </BarChart>
      </ResponsiveContainer>
    );
  }
}

const mapStateToProps = state => {
  return {
    employee_service_performance: state.board.employee_service_performance,
  };
};

const mapDispatchToProps = dispatch => ({});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo)(Barchart);
