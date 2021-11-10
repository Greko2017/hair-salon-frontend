import React, { Component, memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import { getPostsAction, handleModalShowAction } from './board.actions';
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
import user2 from '../../static/img/signin_image1.png';
import user1 from '../../static/img/signin_image1.png';

const key = 'board';

class Board extends Component {
  render() {
    return (
      <div className="board_container">
        {/* <Helmet>
          <title>Board</title>
          <meta name="description" content="Description of Board" />
        </Helmet> */}

        {/* <!--Statistic view --> */}
        <Row gutter={16}>
          <Col xs={24} sm={12} lg={6} className="custom-statcards">
            <Card bordered={true} className="sale" bodyStyle={{ padding: '0px', shadow: '20px' }}>
              <Stats icon={'sale'} text="Total Sale" number="9541" />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6} className="custom-statcards">
            <Card bordered={true} className="order" bodyStyle={{ padding: '0px', shadow: '20px' }}>
              <Stats icon={'order'} text="New Order" number="9541" />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6} className="custom-statcards">
            <Card bordered={true} bodyStyle={{ padding: '0px', shadow: '20px' }} className="user">
              <Stats icon={'user'} text="New User" number="9541" />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6} className="custom-statcards">
            <Card bordered={true} bodyStyle={{ padding: '0px', shadow: '20px' }} className="visitor">
              <Stats icon={'visitor'} text="Unique Visitor" number="9541" />
            </Card>
          </Col>
        </Row>

        {/* Custom Chart */}
        <Row gutter={16} className="m-t-15">
          <Col lg={16} xs={24}>
            <Card bordered={true} title={<p>Sales Report</p>} bodyStyle={{ padding: '0 0 20px' }}>
              <Barchart />
            </Card>
          </Col>
          {/* To do List */}
          <Col lg={8} xs={24} className="custom-tocard">
            <TodoList />
          </Col>
        </Row>

        <Row gutter={[16, 16]} className="m-t-15">
          <Col xl={12} lg={16} xl={10}>
            <Card bordered={true} title={<p>Progress Report </p>} bodyStyle={{ padding: '0 20px 20px' }}>
              <Row className="m-t-15">
                <Col sm={8} xs={24} className="text-center custom-categories">
                  <ProgressBar number="70" color="#4BBACE" width="10" />
                </Col>
                <Col sm={8} xs={24} className="text-center custom-categories">
                  <ProgressBar number="30" color="#E66793" width="10" />
                </Col>
                <Col sm={8} xs={24} className="text-center custom-categories">
                  <ProgressBar number="100" color="#45CD93" width="10" />
                </Col>
              </Row>
            </Card>
            <Card bordered={true} className="m-t-15">
              <GradientProgess />
            </Card>
          </Col>

          <Col xl={6} lg={8} xl={8} className="custom-timeline">
            <Card bordered={true} title={<p>Timeline </p>}>
              <TimeLine className="m-t-15" />
              <div className="text-center">
                <Button type="primary">Learn More</Button>
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

        <Row gutter={16} className="m-t-15">
          <Col span={24}>
            <Card bordered={true} title={<p>Dynamic Custom Table </p>} bodyStyle={{ padding: '10px 20px' }}>
              <TableSelect />
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

// propTypes = {
//   getPosts: PropTypes.func,
//   handleModalShow: PropTypes.func,
// };

const mapStateToProps = createStructuredSelector({});

const mapDispatchToProps = dispatch => ({
  getPosts: () => dispatch(getPostsAction()),
  handleModalShow: () => dispatch(handleModalShowAction()),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo)(Board);
