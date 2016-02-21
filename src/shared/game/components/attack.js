import { now } from 'lodash';
import Component from '../component';

const DEFAULT_COOLDOWN = 500;

class Attack extends Component {
  constructor(onUpdate) {
    super('attack', 0, onUpdate);

    this._lastAttackAt = null;
  }
  
  canAttack() {
    const cooldown = this.getProp('attackCooldown') || DEFAULT_COOLDOWN;

    console.log(now() - this._lastAttackAt);

    return !this._lastAttackAt || (now() - this._lastAttackAt) > cooldown;
  }

  performAttack() {
    this._lastAttackAt = now();
  }
}

export default Attack;
