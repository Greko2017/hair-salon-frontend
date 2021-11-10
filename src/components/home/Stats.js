import { Icon, Card } from 'antd';
import * as React from 'react';
import './css/style.css';
class Stats extends React.Component {
  render() {
    return (
      <Card className="d-flex flex-column stats justify-content-center">
        <h2> {this.props.text}</h2>
        <div className="d-flex justify-content-between">
          <div className="stats-number"> {this.props.number}</div>
          <div>
            {' '}
            <Icon size="38px" className="icon" type={this.props.icon} />
          </div>
        </div>
      </Card>
    );
  }
}
export default Stats;
