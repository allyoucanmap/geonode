import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import ChartIcon from 'material-ui/svg-icons/av/equalizer';
import HoverPaper from '../../atoms/hover-paper';
import GeonodeStatus from '../../cels/geonode-status';
import GeoserverStatus from '../../cels/geoserver-status';
import styles from './styles';
import {withRouter} from 'react-router-dom';

class HardwarePerformance extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = () => {
      this.props.history.push('/performance/hardware');
    };
  }

  render() {
    return (
      <HoverPaper style={styles.content}>
        <div style={styles.header}>
          <h3 style={styles.title}>Hardware Performance</h3>
          <RaisedButton
            onClick={this.handleClick}
            style={styles.icon}
            icon={<ChartIcon />}
          />
        </div>
        <GeonodeStatus />
        <GeoserverStatus />
      </HoverPaper>
    );
  }
}


export default withRouter(HardwarePerformance);
