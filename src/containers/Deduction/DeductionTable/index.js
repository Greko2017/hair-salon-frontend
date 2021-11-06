import React from 'react';
import { connect } from 'react-redux';
import { Input, InputNumber, Popconfirm, Modal, Form, Table, Button } from 'antd';
import DropOption from '../../../components/DropOption';
import {
  deleteDeduction,
  editDeduction,
  handleDeductionModalShowAction,
  deductionEditEditingKey,
} from '../deduction.actions';
import DeductionModal from '../DeductionModal';
import TextArea from 'antd/lib/input/TextArea';
import permisionListSelector from 'utils/permisionListSelector';

const { confirm } = Modal;

const EditableContext = React.createContext();

class EditableCell extends React.Component {
  componentDidMount() {
    // console.log('In EditableCell ServicelineTable :>> ',this.props );
  }
  handleIsCreditOnClick = value => {
    this.setState({ is_credit: value });
  };
  getInput = () => {
    if (this.props.inputType === 'number') {
      return <InputNumber style={{ width: '100%' }} />;
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

    return (
      <td {...restProps}>
        {editing ? (
          <div>
            {dataIndex === 'description' ? (
              <Form.Item>
                {getFieldDecorator(dataIndex, {
                  initialValue: record[dataIndex],
                })(<TextArea />)}
              </Form.Item>
            ) : (
              <Form.Item style={{ margin: 0 }}>
                {getFieldDecorator(dataIndex, {
                  rules: [
                    {
                      required: true,
                      message: `Please Input ${title}!`,
                    },
                  ],
                  initialValue: record[dataIndex],
                })(this.getInput())}
              </Form.Item>
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
    // this.props.fetchDeductions()
    // this.props.fetchStandardAmounts()
    // console.log('In EditableTable Servicelines :>> ',this.props.service_by_id.servicelines );
  }
  constructor(props) {
    super(props);
  }

  isEditing = record => {
    return record.id === this.props.deductionData.editingKey;
  };

  cancel = () => {
    this.setState({ editingKey: '' });
    this.props.deductionEditEditingKey('');
  };

  save = (form, record) => {
    const { editDeduction, deductionEditEditingKey } = this.props;
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      let deductions_data = row;
      deductions_data.id = record.id;
      deductions_data.parent = record.parent.id;
      // console.log('In save DeductionTable record :>> ', record);
      // console.log('In save DeductionTable row :>> ', row);
      editDeduction(row);
      deductionEditEditingKey('');
    });
  };

  edit = id => {
    const { deductionEditEditingKey } = this.props;
    deductionEditEditingKey(id);
  };
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
    const { editDeductionModalVisible, deductionData, addDeduction } = this.props;
    const { isVisible, item, isOnCreate } = deductionData.modalData;
    // console.log('deductionData :>> ', deductionData);
    const { service_by_id } = deductionData;

    return {
      editDeductionModalVisible,
      visible: isVisible,
      item,
      isOnCreate,
      service_name: service_by_id?.name,
      addDeduction,
      parent_id: service_by_id?.id,
    };
  }
  handleMenuClick = (record, e) => {
    const { deleteDeduction } = this.props;

    if (e.key === '1') {
      this.edit(record.id);
    } else if (e.key === '2') {
      confirm({
        title: `Are you sure delete this record?`,
        onOk() {
          deleteDeduction(record);
        },
      });
    }
  };
  render() {
    const { deductionData } = this.props;
    const { evaluated, to_approve, approver, modifier } = this.props.permissions;
    const { payslip_un_approve, payslip_can_approve } = permisionListSelector(this.props.user_permissions);

    // const { service_by_id } = deductionData
    const components = {
      body: {
        cell: EditableCell,
      },
    };
    this.columns = [
      {
        title: 'name',
        dataIndex: 'name',
        key: 'name',
        editable: true,
        render: text => {
          return <span>{text}</span>;
        },
      },
      {
        title: 'Amount',
        dataIndex: 'amount',
        key: 'amount',
        editable: true,
      },
      {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
        editable: true,
        render: description => {
          return <span>{description}</span>;
        },
      },
      {
        title: 'Created At',
        dataIndex: 'created_at',
        key: 'created_at',
        render: created_at => {
          return <span>{created_at.substring(0, 10)}</span>;
        },
      },
      {
        title: 'operation',
        dataIndex: 'operation',
        width: '11%',
        render: (text, record) => {
          const { deductionData } = this.props;
          const { editingKey } = deductionData;
          const editable = this.isEditing(record);
          return editable ? (
            <span>
              <EditableContext.Consumer>
                {form => (
                  <a onClick={() => this.save(form, record)} style={{ marginRight: 8 }}>
                    Save
                  </a>
                )}
              </EditableContext.Consumer>
              <Popconfirm title="Sure to cancel?" onConfirm={() => this.cancel(record.key)}>
                <a>Cancel</a>
              </Popconfirm>
            </span>
          ) : evaluated && payslip_can_approve === true ? (
            <div disabled={editingKey !== ''} width={10} type="flex" align="center" justify="space-between">
              <DropOption
                onMenuClick={e => this.handleMenuClick(record, e)}
                menuOptions={[
                  { key: '1', name: `Update` },
                  { key: '2', name: `Delete` },
                ]}
              />
            </div>
          ) : null;
        },
      },
    ];
    const columns = this.columns.map(col => {
      // const { standard_amountData, revenueData, customers, service_names } = this.props;
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          standard_amounts: [],
          inputType: col.dataIndex === 'amount' ? 'number' : 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });
    return (
      <EditableContext.Provider value={this.props.form}>
        <div type="flex" align="end" justify="space-between">
          <DeductionModal modalProps={this.modalProps} />

          {evaluated ? (
            <div style={{ marginBottom: 16 }}>
              <Button type="primary" onClick={this.props.handleDeductionModalShowAction}>
                Add
              </Button>
            </div>
          ) : null}
        </div>
        {
          <Table
            rowKey={record => record.id}
            components={components}
            bordered
            dataSource={this.props.deductions_by_parent_id}
            columns={columns}
            rowClassName="editable-row"
            pagination={{
              onChange: this.cancel,
            }}
          />
        }
      </EditableContext.Provider>
    );
  }
}

const mapStateToProps = state => {
  // console.log('In service line state :>> ', state);
  return {
    deductions_by_parent_id: state.deduction.deductions_by_parent_id,
    deductionData: state.deduction,
    permissions: state.payroll_to_approve.permissions,
    user_permissions: state.global.user.user_permissions,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    handleDeductionModalShowAction: () => dispatch(handleDeductionModalShowAction()),
    editDeduction: deduction => dispatch(editDeduction(deduction)),
    deductionEditEditingKey: value => dispatch(deductionEditEditingKey(value)),
    deleteDeduction: id => dispatch(deleteDeduction(id)),
  };
};

const DeductionTable = Form.create()(EditableTable);

export default connect(mapStateToProps, mapDispatchToProps)(DeductionTable);
