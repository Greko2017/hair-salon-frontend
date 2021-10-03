import React from "react";
import { connect } from 'react-redux'
import { Input, InputNumber, Popconfirm, Modal, Select, Form, Switch, Table, Avatar, Icon, Button } from 'antd';
import DropOption from "../../../components/DropOption"
import { deleteSalesLine, editSalesLine, handleSalesLineModalShowAction, saleslineEditEditingKey } from "../salesline.actions";
import SalesLineModal from "../SalesLineModal";

const { confirm, } = Modal
const { Option } = Select;

const EditableContext = React.createContext();

class EditableCell extends React.Component {
  componentDidMount() {
      // console.log('In EditableCell ServicelineTable :>> ',this.props );

  }
    handleIsCreditOnClick = (value) =>{
      this.setState({is_credit: value})
    }
    getInput = () => {
        if (this.props.inputType === 'number') {
            return <InputNumber />;
        }
        return <Input />;
    };

    renderCell = ({ getFieldDecorator }) => {
        const {
            editing,
            dataIndex,
            title,
            inputType,
            record,
            index,
            children,
            customers,
            service_names,
            standard_amounts,
            ...restProps
        } = this.props;
        const income_types = [{ id: 'offering', name: 'Offering' }, { id: 'tithe', name: 'Tithe' }, { id: 'project', name: 'Project' }, { id: 'Shiloh', name: 'Shiloh' }, { id: 'thank_giving', name: 'Thanks Giving' }, { id: 'needy', name: 'Needy/Widows' },]

        // console.log('--- In renderCell props', this.state.is_credit);

        return (
            <td {...restProps}>
                {editing ? (
                    <div>
                        { dataIndex === 'is_credit' ? (
                            <Form.Item style={{ marginBottom: 0 }} >
                                {getFieldDecorator(dataIndex, {
                                  valuePropName: 'checked',
                                  initialValue: record.is_credit
                                })(
                                    <Switch
                                      checkedChildren={<Icon type="check" />}
                                      unCheckedChildren={<Icon type="close" />}
                                    />
                                )}
                            </Form.Item>
                            ) :
                            dataIndex === 'lookup' ? (
                                <Form.Item style={{ marginBottom: 0 }}>
                                    {getFieldDecorator(dataIndex, {
                                        initialValue: record.lookup.id,
                                        rules: [{ required: true, message: 'Please select a Service Name' }],
                                    })(
                                      <Select style={{ width: '100%', minWidth: 30 }}
                                          showSearch
                                          placeholder="Select a Service Name"
                                          optionFilterProp="children"
                                          filterOption={(input, option) =>
                                              option.props.children.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0
                                          }>
                                          {service_names.map(service_name => <Option key={service_name.id} value={service_name.id}>{service_name.name}</Option>)}
                                      </Select>
                                    )}
                                </Form.Item>
                            ) :
                            (
                                <div>
                                    {dataIndex === 'customer_id' ? (
                                        <Form.Item style={{ marginBottom: 0 }}>
                                            {getFieldDecorator(dataIndex, {
                                                initialValue: record.customer_id.id,
                                                rules: [{ required: true, message: 'Please input the Customer!' }],
                                            })(
                                                <Select style={{ width: '100%', minWidth: 30 }}
                                                    showSearch
                                                    placeholder="Select a Customer"
                                                    optionFilterProp="children"
                                                    filterOption={(input, option) =>
                                                        option.props.children.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                    }>
                                                    {customers.map(customer => <Option key={customer.id} value={customer.id}>{customer.firstname}</Option>)}
                                                </Select>
                                            )}
                                        </Form.Item>
                                    ) : (<Form.Item style={{ margin: 0 }}>
                                        {getFieldDecorator(dataIndex, {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: `Please Input ${title}!`,
                                                },
                                            ],
                                            initialValue: record[dataIndex],
                                        })(this.getInput())}
                                    </Form.Item>)}
                                </div>
                            )}
                    </div>
                ) : (
                    children
                )}
            </td>
        );
    };

    render() {
        return <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>;
    }
}

class EditableTable extends React.Component {
    componentDidMount() {
        // this.props.fetchSalesLines()
        // this.props.fetchStandardAmounts()
        // console.log('In EditableTable Servicelines :>> ',this.props.service_by_id.saleslines );

    }
    constructor(props) {
        super(props);
    }

    isEditing = (record) => {
        return record.id === this.props.saleslineData.editingKey
    };

    cancel = () => {
        this.setState({ editingKey: '' });
        this.props.saleslineEditEditingKey('')
    };

    save = (form, record) => {
        const { editSalesLine, saleslineEditEditingKey, } = this.props
        form.validateFields((error, row) => {
            if (error) {
                return;
            }
            let income_line_data = row
            income_line_data.id = record.id
            income_line_data.parent = record.parent
            console.log('In save SalesLineTable record :>> ', record);
            row.payment_method = record.payment_method
            console.log('In save SalesLineTable row :>> ', row);
            editSalesLine(row)
            saleslineEditEditingKey('')
        });
    }

    edit = (id) => {
        const { saleslineEditEditingKey } = this.props
        saleslineEditEditingKey(id)
    }
    handleDelete = key => {
        const dataSource = [...this.state.dataSource];
        this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
    };

    handleAdd = () => {
        const { count, dataSource } = this.state;
        const newData = {
            key: count,
            name: `Edward King ${count}`,
            age: 32,
            address: `London, Park Lane no. ${count}`,
        };
        this.setState({
            dataSource: [...dataSource, newData],
            count: count + 1,
        });
    };
    get modalProps() {
        const { editSalesLineModalVisible, saleslineData, addSalesLine } = this.props
        const { isVisible, item, isOnCreate } = saleslineData.modalData
        // console.log('saleslineData :>> ', saleslineData);
        const { service_by_id } = saleslineData

        return {
            editSalesLineModalVisible,
            visible: isVisible,
            item,
            isOnCreate,
            service_name: service_by_id?.name,
            addSalesLine,
            parent_id: service_by_id?.id,
        }
    }
    handleMenuClick = (record, e) => {
        const { deleteSalesLine } = this.props

        if (e.key === '1') {
            this.edit(record.id)
        } else if (e.key === '2') {
            confirm({
                title: `Are you sure delete this record?`,
                onOk() {
                    deleteSalesLine(record.id)
                },
            })
        }
    }
    render() {
        const { saleslineData } = this.props
        // const { service_by_id } = saleslineData
        const components = {
            body: {
                cell: EditableCell,
            },
        };
        this.columns = [
            {
                title: 'Service name',
                dataIndex: 'lookup',
                key: 'service_name',
                editable: true,
                render: (text) => {
                    return <span>{text.name}</span>
                },
            },
            {
                title: 'Is Credit',
                dataIndex: 'is_credit',
                key: 'is_credit',
                align: "center",
                editable: true,
                render: (is_credit) => {
                    return is_credit ? (
                      <div>
                        <Avatar style={{ backgroundColor: '#eb0d0' }} size="small" icon="check" />
                      </div>
                    ) : (<div><Avatar style={{ backgroundColor: '#ccc' }} size="small" icon="close" /></div>)
                },
            },
            {
              title: 'Customer (Cst)',
              dataIndex: 'customer_id',
              key: 'customer',
              editable: true,
              render: customer_id => {
                return (
                  <span>{customer_id.firstname}</span>
                )
              },
            },
            {
                title: 'Amount Paid',
                dataIndex: 'amount_paid',
                key: 'amount_paid',
                editable: true,
            },
            {
                title: 'Qty',
                dataIndex: 'quantity',
                key: 'quantity',
                editable: true,
            },
            {
                title: 'Amount',
                dataIndex: 'amount',
                key: 'amount',
                render: (text, record) => {
                    return ((record.quantity > 0 ? record.quantity : 1) * record.amount_paid)
                },
            },
                  {
                title: 'operation',
                dataIndex: 'operation',
                width: '11%',
                render: (text, record) => {
                    const { saleslineData } = this.props
                    const { editingKey } = saleslineData
                    const editable = this.isEditing(record);
                    return editable ? (
                        <span>
                            <EditableContext.Consumer>
                                {form => (
                                    <a
                                        onClick={() => this.save(form, record)}
                                        style={{ marginRight: 8 }}
                                    >
                                        Save
                                    </a>
                                )}
                            </EditableContext.Consumer>
                            <Popconfirm title="Sure to cancel?" onConfirm={() => this.cancel(record.key)}>
                                <a>Cancel</a>
                            </Popconfirm>
                        </span>
                    ) : (
                        <div disabled={editingKey !== ''} width={10} type="flex" align="center" justify="space-between">
                            <DropOption
                                onMenuClick={e => this.handleMenuClick(record, e)}
                                menuOptions={[
                                    { key: '1', name: `Update` },
                                    { key: '2', name: `Delete` },
                                ]} />
                        </div>
                    );
                },
            },
        ];
        const columns = this.columns.map(col => {
            const { standard_amountData, revenueData,customers, service_names } = this.props
            if (!col.editable) {
                return col;
            }
            if (col.dataIndex === 'customer_id') {

                return {
                    ...col,
                    // render: (text) => {
                    //     return text
                    // },
                    onCell: record => ({
                        record,
                        customers: customers,
                        dataIndex: col.dataIndex,
                        editing: this.isEditing(record),
                    }),
                };
            }
            if (col.dataIndex === 'lookup') {
                return {
                    ...col,
                    onCell: record => ({
                        record,
                        service_names: service_names,
                        dataIndex: col.dataIndex,
                        editing: this.isEditing(record),
                    }),
                };
            }
            return {
                ...col,
                onCell: record => ({
                    record,
                    standard_amounts: [],
                    inputType: (col.dataIndex === 'quantity' || col.dataIndex === 'amount_paid') ? 'number' : 'text',
                    dataIndex: col.dataIndex,
                    title: col.title,
                    editing: this.isEditing(record),
                }),
            };
        });
        return (
            <EditableContext.Provider value={this.props.form}>
                <div type="flex" align="end" justify="space-between">
                    <SalesLineModal modalProps={this.modalProps} />

                    <div style={{ marginBottom: 16 }}>
                      <Button type="primary" onClick={this.props.handleSalesLineModalShowAction}>
                        Add
                      </Button>
                    </div>
                </div>
                {<Table
                    rowKey={record => record.id}
                    components={components}
                    bordered
                    dataSource={this.props.service_by_id.saleslines}
                    columns={columns}
                    rowClassName="editable-row"
                    pagination={{
                        onChange: this.cancel,
                    }}
                />}
            </EditableContext.Provider>
        );
    }
}

const mapStateToProps = (state) => {
    // console.log('In service line state :>> ', state);
    return {
        service_by_id: state.service.service_by_id,
        saleslineData: state.salesline,
        customers : state.customer.customers,
        service_names: state.service.service_names,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        handleSalesLineModalShowAction: () => dispatch(handleSalesLineModalShowAction()),
        editSalesLine: (service_line) => dispatch(editSalesLine(service_line)),
        // fetchRevenues: () => dispatch(fetchRevenues()),
        // fetchSalesLines: () => dispatch(fetchSalesLines()),
        saleslineEditEditingKey: (value) => dispatch(saleslineEditEditingKey(value)),
        // editSalesLineModalVisible: (boolean) => dispatch(editSalesLineModalVisible(boolean)),
        // editIsOnCreateModalVisible: (boolean) => dispatch(editIsOnCreateModalVisible(boolean)),
        // editItemModal: (item) => dispatch(editItemModal(item)),
        // addSalesLine: (new_income_line) => dispatch(addSalesLine(new_income_line)),
        deleteSalesLine: (id) => dispatch(deleteSalesLine(id)),
    }
}

const SalesLineTable = Form.create()(EditableTable);

export default connect(mapStateToProps, mapDispatchToProps)(SalesLineTable)
