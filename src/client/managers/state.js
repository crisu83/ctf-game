import { now } from 'lodash';
import { CLIENT_MIN_LAG, CLIENT_MAX_LAG } from '../constants';

class StateManager {
  /**
   *
   */
  constructor() {
    this._states = [];
  }

  /**
   *
   * @param {Object} state
   */
  addState(state) {
    this._states.push(state);
  }

  /**
   *
   * @returns {Object}
   */
  getCurrentState() {
    let current = null;
    let diff, smallestDiff;
    const timeNow = now();

    for (let i = 0; i < this._states.length; i++) {
      diff = Math.abs(timeNow - this._states[i].timestamp);
      if (diff >= CLIENT_MIN_LAG && diff <= CLIENT_MAX_LAG && (!smallestDiff || diff < smallestDiff)) {
        current = this._states[i];
        smallestDiff = diff;
      }
    }

    if (current) {
      this._states = this._states.filter(state => state.timestamp > current.timestamp);
    }

    return current;
  }
}

export default StateManager;
