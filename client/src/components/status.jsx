import React, { Component } from 'react';
import Loader from './loader';

class Status extends Component {
  render() {
    const { isConnected } = this.props;

    return (
      <div className="status">
        <Loader/>
        {!isConnected ? 'Connecting to server' : 'Loading game session'}
      </div>
    );
  }
}

export default Status;
