import Component from 'shared/game/components/attack';

class Attack extends Component {
  /**
   *
   * @param {Phaser.Group} group
   * @param {function} onUpdate
   */
  constructor(group, onUpdate) {
    super(onUpdate);

    this._group = group;
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
}

export default Attack;
