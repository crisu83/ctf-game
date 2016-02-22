import { now } from 'lodash';
import Component from 'shared/game/component';

const POINTS_INTERVAL = 10000;

class Points extends Component {
  constructor(onUpdate) {
    super('points', 0, onUpdate);
    
    this._lastGivenAt = now();
  }
  
  shouldGivePoints() {
    return (now() - this._lastGivenAt) > POINTS_INTERVAL;
  }
  
  pointsGiven() {
    this._lastGivenAt = now();
  }
}

export default Points;
