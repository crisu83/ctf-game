import { now } from 'lodash';
import Component from 'shared/game/component';

const DEFAULT_COOLDOWN = 500;

class Attack extends Component {
  /**
   *
   * @param {Phaser.Group} group
   * @param {function} onUpdate
   */
  constructor(group, onUpdate) {
    super('attack', 0, onUpdate);

    this._group = group;
    this._attackedAt = null;
  }

  /**
   *
   * @param {Phaser.Sprite} attack
   * @param {Object} props
   * @returns {{x: number, y: number}}
   */
  calculateAttackTarget(attack, props) {
    const { x, y, facing, attackRange } = props;

    // TODO: Calculate attack offset properly based on the sprite size.
    const { width, height } = attack;

    switch (facing) {
      case 'left':
        return {x: x - attackRange, y};

      case 'right':
        return {x: x + attackRange , y};

      case 'up':
        return {x, y: y - attackRange};

      case 'down':
        return {x, y: y + attackRange};

      default: {
        return {x, y};
      }
    }
  }

  /**
   *
   * @returns {boolean}
   */
  canAttack() {
    const cooldown = this.getProp('attackCooldown') || DEFAULT_COOLDOWN;
    
    return !this._attackedAt || now() - this._attackedAt > cooldown;
  }

  /**
   *
   * @returns {Phaser.Sprite}
   */
  getAttackSprite() {
    this._attackedAt = now();

    return this._group.getFirstExists(false);
  }
}

export default Attack;
