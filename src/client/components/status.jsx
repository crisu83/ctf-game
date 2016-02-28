import React, { Component } from 'react';
import Loader from './loader';
import { randomTip } from '../helpers/game';

class Status extends Component {
  constructor() {
    super();

    this.state = {
      tip: randomTip()
    };
  }

  render() {
    const { tip } = this.state;
    const { isConnected } = this.props;

    return (
      <div className="status">
        <Loader/>
        {!isConnected ? 'Connecting to server' : 'Loading game session'}
        <div className="status-tip">TIP: {tip}</div>
      </div>
    );
  }
}

export default Status;
