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

      case 'down':
        return { x, y: y + attackRange };

      default:
        return { x, y };
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
