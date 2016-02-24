import { now } from 'lodash';
import Component from 'shared/game/component';
import { GIVE_POINTS_SECONDS } from '../../constants';

class PointsComponent extends Component {
  constructor(onUpdate) {
    super('points', 0, onUpdate);
    
    this._lastGivenAt = now();
  }
  
  shouldGivePoints() {
    return (now() - this._lastGivenAt) > (GIVE_POINTS_SECONDS * 1000);
  }
  
  pointsGiven() {
    this._lastGivenAt = now();
  }
}

export default PointsComponent;
