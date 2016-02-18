import Component from '../component';

const ATTACK_RANGE_MULTIPLIER = 0.5;

class Attack extends Component {
  constructor(group, onUpdate) {
    super('attack', 0, onUpdate);

    this._group = group;
  }

  calculateAttackTarget(attack, props) {
    const { x, y, facing } = props;
    const { width, height } = attack;

    switch (facing) {
      case 'left':
        return {x: x - (width * ATTACK_RANGE_MULTIPLIER), y};

      case 'right':
        return {x: x + (width * ATTACK_RANGE_MULTIPLIER) , y};

      case 'up':
        return {x, y: y - (height * ATTACK_RANGE_MULTIPLIER)};

      case 'down':
        return {x, y: y + (height * ATTACK_RANGE_MULTIPLIER)};

      default: {
        return {x, y};
      }
    }
  }

  getAttack() {
    return this._group.getFirstExists(false);
  }
}

export default Attack;
