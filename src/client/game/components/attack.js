import { now } from 'lodash';
import Component from 'shared/game/component';

const DEFAULT_COOLDOWN = 500;

class AttackComponent extends Component {
  /**
   *
   * @param {Phaser.Group} group
   * @param {function} onUpdate
   */
  constructor(group, onUpdate) {
    super('attack', 0, onUpdate);

    this._group = group;
    this._lastAttackAt = null;
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
    // const { width, height } = attack;

    switch (facing) {
      case 'left':
        return { x: x - attackRange, y };

      case 'right':
        return { x: x + attackRange, y };

      case 'up':
        return { x, y: y - attackRange };

      // NOTE: Attack direction is down when standing still.
      case 'down':
      default:
        return { x, y: y + attackRange };
    }
  }

  /**
   *
   * @returns {Phaser.Sprite}
   */
  getAttackSprite() {
    return this._group.getFirstExists(false);
  }

  canAttack() {
    const cooldown = this.getProp('attackCooldown') || DEFAULT_COOLDOWN;

    return !this._lastAttackAt || (now() - this._lastAttackAt) > cooldown;
  }

  attackPerformed() {
    this._lastAttackAt = now();
  }
}

export default AttackComponent;
