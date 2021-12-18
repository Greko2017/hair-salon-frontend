import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Modal, Form, Select, InputNumber, Checkbox } from 'antd';
import { memo } from 'react';
// import './SaleLineModal.css';
import TextArea from 'antd/lib/input/TextArea';
import { handleSalesLineModalCancelAction, postSalesLine } from '../salesline.actions';
import { fetchSales } from 'containers/Sales/sales.actions';
import { fetchProduct } from 'containers/Product/product.actions';
const { Option } = Select;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 19 },
  },
};

const amountFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 19,
      offset: 0,
    },
  },
};
const isCreditFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 19,
      offset: 4,
    },
  },
};

export class SaleLineModalInner extends Component {
  state = {
    price: null,
  };
  componentDidMount() {
    const { fetchSales } = this.props;
    fetchSales();
  }
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        if (this.props.isOnCreate === true) {
          this.props.postSalesLine(values);
        } else if (this.props.isOnCreate === false) {
          values.id = this.props.item.id;
          // this.props.editSale(values)
        }
      }
    });
  };
  handleOnchangeEmployee = (val, event) => {
    let product = [...this.props.products].filter(item => item.id === val)[0];
    this.setState({ ...this.state, price: product.selling_price });
  };
  render() {
    const { form, modalSaleLineVisible, parent, isOnCreate, products, sales, item } = this.props;
    const { getFieldDecorator } = form;

    const prefixSelector = getFieldDecorator('prefix', {
      initialValue: 'om',
    })(
      <Select style={{ width: 70 }}>
        <Option value="om">OM</Option>
        <Option value="momo">MOMO</Option>
        <Option value="cash">Cash</Option>
      </Select>,
    );
    return (
      <Modal
        title={`${isOnCreate === true ? 'Add' : 'Update'} Sale Line`}
        visible={modalSaleLineVisible}
        onOk={(value, event) => this.handleSubmit(value, event)}
        okText={isOnCreate ? 'Add' : 'Update'}
        confirmLoading={this.props.modalSaleLineLoading}
        onCancel={this.props.handleSalesLineModalCancelAction}
        className="salesline_modal__container"
      >
        <Form {...formItemLayout} className="salesline-form">
          <Form.Item label="Parent" className="salesline_modal__content">
            {getFieldDecorator('parent_id', {
              initialValue:
                item !== undefined && isOnCreate === false
                  ? item.sales_by_id.id
                  : parent !== undefined
                  ? parent.id
                  : null,
            })(
              <Select
                disabled
                showSearch={true}
                placeholder="Parent"
                optionFilterProp="children"
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                {sales.map(sale => (
                  <Option disabled key={sale.id} value={sale.id}>
                    {sale.name}
                  </Option>
                ))}
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="Product" className="salesline_modal__content">
            {getFieldDecorator('product_id', {
              initialValue: item !== undefined && isOnCreate === false ? item.product_id : null,
            })(
              <Select
                onSelect={(value, event) => this.handleOnchangeEmployee(value, event)}
                showSearch={true}
                placeholder="Product"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children[0].toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {products.map(product => (
                  <Option key={product.id} value={product.id}>
                    {product.name}
                  </Option>
                ))}
              </Select>,
            )}
          </Form.Item>
          <Form.Item label="Amount" {...amountFormItemLayout} style={{ marginBottom: '.19rem' }}>
            <Form.Item
              name="amount_value"
              rules={[{ required: true }]}
              style={{ display: 'inline-block', width: '50%', marginRight: '0.15rem' }}
            >
              {getFieldDecorator('amount_paid', { initialValue: this.state.price })(
                <InputNumber disabled style={{ width: '100%' }} min={1} max={999999} placeholder="Amount Value" />,
              )}
            </Form.Item>
            <Form.Item style={{ display: 'inline-block', width: '30%' }}>
              {getFieldDecorator('product_quantity', {
                rules: [{ required: true, message: 'Please input a Quantity!' }],
              })(<InputNumber style={{ width: '100%' }} placeholder="Quantity" addonAfter={prefixSelector} />)}
            </Form.Item>
            <Form.Item style={{ display: 'inline-block', width: '18%', marginLeft: '0.15rem' }}>
              {getFieldDecorator(
                'payment_method',
                {},
              )(
                <Select placeholder="Payment method">
                  <Option value="om">OM</Option>
                  <Option value="momo">MOMO</Option>
                  <Option value="cash">Cash</Option>
                </Select>,
              )}
            </Form.Item>
          </Form.Item>
          <Form.Item label="Details" style={{ marginBottom: '1rem' }}>
            {getFieldDecorator('details', { initialValue: item !== undefined ? item.details : null })(
              <TextArea
                onChange={this.onChange}
                placeholder="Some Details regarding the Sale rendered"
                autoSize={{ minRows: 3, maxRows: 5 }}
              />,
            )}
          </Form.Item>
          <Form.Item {...isCreditFormItemLayout}>
            {getFieldDecorator('is_credit', {
              initialValue: item === undefined ? false : item.is_credit,
              valuePropName: 'checked',
            })(
              <Checkbox>
                Is it a Credit <a href="">Credit Terms and conditions</a>
              </Checkbox>,
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

const mapStateToProps = state => {
  // console.log('In sales line state :>> ', state);
  return {
    modalSaleLineVisible: state.salesline.modalData.isVisible,
    modalSaleLineLoading: state.salesline.loading,
    isOnCreate: state.salesline.modalData.isOnCreate,
    sales_by_id: state.sales.sales_by_id,
    item: state.salesline.modalData.item,
    sales_names: state.sales.sales_names,
    sales: state.sales.sales,
    products: state.product.products,
    parent: state.sales.parent,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchSales: () => dispatch(fetchSales()),
    postSalesLine: new_salesline => dispatch(postSalesLine(new_salesline)),
    handleSalesLineModalCancelAction: () => dispatch(handleSalesLineModalCancelAction()),
  };
};
const withConnect = connect(mapStateToProps, mapDispatchToProps);

const SaleLineModal = Form.create({ name: 'salesline_modal' })(SaleLineModalInner);

export default compose(withConnect, memo)(SaleLineModal);
