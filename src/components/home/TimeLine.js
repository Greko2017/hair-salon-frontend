import * as React from 'react';
import { Timeline } from 'antd';
import { Link } from 'react-router-dom';

class TimeLine extends React.Component {
  render() {
    const { sales } = this.props;
    // console.log(`-- In TimeLine sales`, sales);
    return (
      <Timeline style={{ minHeight: '245px' }}>
        {sales instanceof Array
          ? sales.map(sale => (
              <Timeline.Item>
                <Link key={sale.id} to={{ pathname: `/sales/${sale.id}` }}>
                  {sale.name}
                </Link>{' '}
                - {sale.created_at.substring(0, 10)}
              </Timeline.Item>
            ))
          : null}
      </Timeline>
    );
  }
}
export default TimeLine;
