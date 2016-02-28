import { now } from 'lodash';
import { CLIENT_LAG } from '../constants';

class StateManager {
  constructor() {
    this._states = [];
  }

  addState(state) {
    this._states.push(state);
  }

  getCurrentState() {
    let current = null, index = -1;
    let diff, smallestDiff;
    const timeNow = now();

    for (let i = 0; i < this._states.length; i++) {
      diff = Math.abs(timeNow - this._states[i].timestamp);
      if (diff >= CLIENT_LAG && (!smallestDiff || diff < smallestDiff)) {
        current = this._states[i];
        index = i;
        smallestDiff = diff;
      }
    }

    if (current) {
      this._states.splice(index, 1);
    }

    return current;
  }
}

export default StateManager;
