import React, { Component, memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import {
  getBestPerformEmployeeService,
  getPostsAction,
  getTotalCustomer,
  getTotalSale,
  getTotalService,
  handleBoardModalCancelAction,
  handleBoardModalShowAction,
  handleModalShowAction,
} from './board.actions';
import { Link } from 'react-router-dom';
import reducer from './board.reducer';
import saga from './board.saga';

import { Row, Col, Card, Button, Statistic } from 'antd';
import WritePostModal from './WritePostModal';
import PostTable from './PostTable';
import Stats from 'components/home/Stats';
import Barchart from 'components/home/Barchart';
import TodoList from 'components/home/TodoList';
import GradientProgess from 'components/home/GradientProgess';
import TimeLine from 'components/home/TimeLine';
import Testimonial from 'components/home/Testimonial';
import TableSelect from 'components/home/TableSelect';
import ProgressBar from 'components/home/ProgressBar';
import user2 from '../../static/img/signin_image1_small.png';
import user1 from '../../static/img/signin_image1_small.png';
import moment from 'moment';
import { fetchSales } from '../Sales/sales.actions';
import './style.css';
import FilterModal from './FilterModal';
const key = 'board';
const dateFormat = 'DD-MM-YYYY';
class Board extends Component {
  constructor(props) {
    super(props);
    let date = new Date();
    let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    // https://www.tabnine.com/academy/javascript/how-to-format-date/
    firstDay = moment(firstDay).format('YYYY-MM-DD');
    firstDay = moment(lastDay).format('YYYY-MM-DD');
    this.setState({ date_min: firstDay, date_max: lastDay });
    this.state = {
      delete: false,
      appointments: [],
      date_min: firstDay,
      date_max: lastDay,
      service_name: null,
      first_name: '',
      last_name: '',
      appointments: [],
    };
    // this.addItem = this.addItem.bind(this);
    // this.deleteItem = this.deleteItem.bind(this);
  }
  componentDidMount() {
    this.loadBoardData(this.state);
  }
  loadBoardData = params => {
    const { getTotalSale, getTotalService, getTotalCustomer, getBestPerformEmployeeService, fetchSales } = this.props;
    getTotalSale(params);
    getTotalService(params);
    getTotalCustomer(params);
    getBestPerformEmployeeService(params);
    fetchSales();
  };
  deleteItem = e => {
    e.preventDefault();
    // this.setState({ delete: !this.state.delete });
    var elems = document.querySelector('.checkedList');
    var lis = document.querySelectorAll('.checkedList');
    var li;
    let arrayText = [];
    for (var i = 0; (li = lis[i]); i++) {
      try {
        // li.parentNode.removeChild(li);
        arrayText.push(li.innerText);
        // li.className.replace('checkedList', '');
      } catch (error) {}
    }
    // console.log(`arrayText`, arrayText);

    const newTodoList = [...this.state.appointments].filter(todo => {
      // console.log(`todo`, todo, arrayText);
      let _eval = true;

      arrayText.map(text => {
        if (_eval !== false) {
          _eval = text.trim() !== todo.text.trim();
        }
      });

      return _eval;
    });
    // console.log(`newTodoList`, newTodoList);
    this.setState({
      todoData: newTodoList,
      appointments: newTodoList,
    });
    this.setAppointment(newTodoList);
  };
  handleSearch = params => {
    // console.log(`-- in handleSearch`, params);
    this.setState(prevState => {
      let _tmp_state = {
        ...prevState,
        date_min: params.date_from,
        date_max: params.date_to,
      };
      this.loadBoardData(_tmp_state);
      this.props.handleBoardModalCancelAction();
      return _tmp_state;
    });
  };
  addItem = e => {
    e.preventDefault();
    if (e.target[0].value !== '') {
      const newTodoList = this.state.appointments;
      newTodoList.push({
        done: false,
        text: e.target[0].value,
      });
      e.target[0].value = '';
      this.setState({
        todoData: newTodoList,
        appointments: newTodoList,
      });
      this.setAppointment(newTodoList);
    }
    return false;
  };
  loadAppointment = () => {
    let appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    this.setState(currState => {
      return { ...currState, appointments: appointments };
    });
  };
  setAppointment(appointments) {
    localStorage.setItem('appointments', JSON.stringify(appointments));
  }
  get todoListParams() {
    return {
      loadAppointment: this.loadAppointment,
      setAppointment: this.setAppointment,
      addItem: this.addItem,
      deleteItem: this.deleteItem,
      appointments: this.state.appointments,
    };
  }
  render() {
    // const { appointments } = this.state;
    const { sales } = this.props;
    // console.log(`appointments`, appointments.length);
    return (
      <div className="board_container">
        <FilterModal handleSearch={this.handleSearch} />
        <Row gutter={16}>
          <Col xs={24} sm={12} lg={6} className="custom-statcards">
            <Card
              onClick={this.props.handleBoardModalShowAction}
              // className="card-button"
              bordered={true}
              className="sale"
              bodyStyle={{ padding: '0px', shadow: '20px' }}
            >
              <Stats icon={'sale'} text="Service Total Amount " number={this.props.total_service} />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6} className="custom-statcards">
            <Card bordered={true} className="order" bodyStyle={{ padding: '0px', shadow: '20px' }}>
              <Stats icon={'order'} text="Sales Total Amount" number={this.props.total_sale} />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6} className="custom-statcards">
            <Card bordered={true} bodyStyle={{ padding: '0px', shadow: '20px' }} className="user">
              <Stats icon={'user'} text="Number of Clients" number={this.props.total_customer} />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6} className="custom-statcards">
            <Card bordered={true} bodyStyle={{ padding: '0px', shadow: '20px' }} className="visitor">
              <Stats icon={'visitor'} text="Appointments" number={this.state.appointments.length} />
            </Card>
          </Col>
        </Row>

        {/* Custom Chart */}
        <Row gutter={16} className="m-t-15">
          <Col lg={16} xs={24}>
            <Card bordered={true} title={<p>Employee Performance on Service</p>} bodyStyle={{ padding: '0 0 20px' }}>
              <Barchart />
            </Card>
          </Col>
          {/* To do List */}
          <Col lg={8} xs={24} className="custom-tocard">
            <TodoList {...this.todoListParams} />
          </Col>
        </Row>

        <Row gutter={[16, 16]} className="m-t-15">
          <Col xl={12} lg={16} xl={10}>
            <Card bordered={true} title={<p>Progress Report </p>} bodyStyle={{ padding: '0 20px 20px' }}>
              <Row className="m-t-15">
                <Col sm={8} xs={24} className="text-center custom-categories">
                  <ProgressBar number={70} color="#4BBACE" width="10" />
                </Col>
                <Col sm={8} xs={24} className="text-center custom-categories">
                  <ProgressBar number={30} color="#E66793" width="10" />
                </Col>
                <Col sm={8} xs={24} className="text-center custom-categories">
                  <ProgressBar number={100} color="#45CD93" width="10" />
                </Col>
              </Row>
            </Card>
            <Card bordered={true} className="m-t-15">
              <GradientProgess />
            </Card>
          </Col>

          <Col xl={6} lg={8} xl={8} className="custom-timeline">
            <Card bordered={true} title={<p>Last Sales </p>}>
              <TimeLine sales={sales} className="m-t-15" />
              <div className="text-center">
                <Link to={{ pathname: `/sales/` }}>
                  {' '}
                  <Button type="primary">More</Button>{' '}
                </Link>
              </div>
            </Card>
          </Col>

          <Col xl={6} lg={24} xl={6}>
            <Row gutter={16}>
              <Col xl={24} md={12} className="custom-home-cards custom-margincards">
                <Card bordered={true} className="testimonials" bodyStyle={{ padding: '20px' }}>
                  <Testimonial
                    name="Pauline I. Bird"
                    designation="Web developer"
                    img={user1}
                    description="Computer users and programmers have become so accustomed to using Windows."
                  />
                </Card>
              </Col>
              <Col xl={24} md={12} className="custom-home-cards m-t-15">
                <Card bordered={true} className="testimonials" bodyStyle={{ padding: '20px' }}>
                  <Testimonial
                    name="Ralph L. Alva"
                    designation="Web developer"
                    img={user2}
                    description="Computer users and programmers have become so accustomed to using Windows."
                  />
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>

        {/* <Row gutter={16} className="m-t-15">
          <Col span={24}>
            <Card bordered={true} title={<p>Dynamic Custom Table </p>} bodyStyle={{ padding: '10px 20px' }}>
              <TableSelect />
            </Card>
          </Col>
        </Row> */}
      </div>
    );
  }
}

// propTypes = {
//   getPosts: PropTypes.func,
//   handleModalShow: PropTypes.func,
// };

const mapStateToProps = state => {
  return {
    total_sale: state.board.total_sale,
    total_service: state.board.total_service,
    total_customer: state.board.total_customer,
    sales: state.sales.sales.length >= 6 ? state.sales.sales.slice(0, 5) : state.sales.sales,
  };
};

const mapDispatchToProps = dispatch => ({
  getPosts: () => dispatch(getPostsAction()),
  handleModalShow: () => dispatch(handleModalShowAction()),
  getTotalSale: params => dispatch(getTotalSale(params)),
  getTotalService: params => dispatch(getTotalService(params)),
  getTotalCustomer: params => dispatch(getTotalCustomer(params)),
  getBestPerformEmployeeService: params => dispatch(getBestPerformEmployeeService(params)),
  fetchSales: () => dispatch(fetchSales()),
  handleBoardModalShowAction: item => dispatch(handleBoardModalShowAction(item)),
  handleBoardModalCancelAction: () => dispatch(handleBoardModalCancelAction()),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo)(Board);
