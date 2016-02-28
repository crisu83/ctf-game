import React, { Component } from 'react';
import Loader from './loader';

/**
 *
 * @returns {string}
 */
function randomTip() {
  const tips = [
    'Use ARROW keys to move',
    'Hold down SHIFT to sprint',
    'Press SPACE to attack',
    'Run over a flag to tag it',
    'Tag flags to receive more points',
    'Players are revived in their base',
    'Tell your friends to join for more fun'
  ];

  const tipIndex = Math.round(Math.random() * (tips.length - 1));

  return tips[tipIndex];
}

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
