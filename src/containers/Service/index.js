import { Button } from 'antd';
import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import {
  deleteService,
  editService,
  fetchServices,
  handleServiceModalShowAction,
  setServiceModalItem,
} from './service.actions';
import ServiceModal from './ServiceModal';
import ServiceTable from './ServiceTable';

class Service extends Component {
  componentDidMount() {
    this.props.fetchServices();
  }
  get ListProps() {
    const { setServiceModalItem, deleteService, handleServiceModalShowAction } = this.props;
    return {
      onDeleteItem: id => {
        console.log('In onDeleteItem :>> ', id);
        deleteService(id);
      },
      onEditItem: async item => {
        console.log('In onEditItem :>> ', item);
        await setServiceModalItem(item);
        await handleServiceModalShowAction(item);
      },
    };
  }
  render() {
    return (
      <>
        <Helmet>
          <title>Service</title>
          <meta name="description" content="List of services" />
        </Helmet>
        <ServiceModal />
        <div style={{ marginBottom: 16 }}>
          <Button type="primary" onClick={this.props.handleServiceModalShowAction}>
            Add
          </Button>
        </div>
        <ServiceTable {...this.ListProps} />
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    ServiceData: state.Services,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchServices: () => dispatch(fetchServices()),
    handleServiceModalShowAction: item => dispatch(handleServiceModalShowAction(item)),
    setServiceModalItem: item => dispatch(setServiceModalItem(item)),
    editService: params => dispatch(editService(params)),
    deleteService: service_id => dispatch(deleteService(service_id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Service);
