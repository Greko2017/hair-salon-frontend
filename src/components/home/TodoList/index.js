import * as React from 'react';
import TodoItem from './TodoItem';
import { Card, Input, Button, Icon, List } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';

class TodoList extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.props.loadAppointment();
  }
  render() {
    return (
      <Card
        bordered={false}
        title={<p>Appointments </p>}
        extra={<Icon type="delete" onClick={this.props.deleteItem} style={{ fontSize: '16px', color: '#f5222d' }} />}
        style={{ minHeight: '375px' }}
        bodyStyle={{ padding: '0 20px' }}
      >
        <div>
          <div>
            <Scrollbars style={{ height: 230 }}>
              <List>
                {this.props.appointments.map((item, i) => (
                  <TodoItem key={i} done={item.done} text={item.text} />
                ))}
              </List>
            </Scrollbars>
          </div>
          <form onSubmit={this.props.addItem} style={{ paddingTop: '30px' }}>
            <div>
              <div>
                <div className="d-flex">
                  <Input type="text" placeholder="Add New Item" />
                  <Button type="primary" htmlType="submit" style={{ marginLeft: '15px' }}>
                    Add
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </Card>
    );
  }
}
export default TodoList;
