import Component, { PHASE_INPUT } from '../component';
import { moveLeft, moveRight, moveUp, moveDown } from '../../actions/game';

const MOVE_STEP = 5;

class Input extends Component {
  /**
   *
   * @param {Entity} owner
   * @param {Phaser.Keyboard} cursors
   * @param {Phaser.Keyboard} attack
   */
  constructor(owner, cursors, attack) {
    super(owner, PHASE_INPUT);

    this._key = 'input';
    this._cursors = cursors;
    this._attack = attack;
  }

  /**
   * 
   * @param {Object} newProps
   * @param {Object} props
   * @param {number} elapsed
   * @param {function} dispatch
   */
  update(newProps, props, elapsed, dispatch) {
    const knightSprite = this.getComponent('sprite').get('knight');

    if (this._cursors.left.isDown) {
      dispatch(moveLeft(props.id, MOVE_STEP));
      knightSprite.animations.play(this._attack.isDown ? 'attackLeft' : 'runLeft');
    } else if (this._cursors.right.isDown) {
      dispatch(moveRight(props.id, MOVE_STEP));
      knightSprite.animations.play(this._attack.isDown ? 'attackRight' : 'runRight');
    } else if (this._cursors.up.isDown) {
      dispatch(moveUp(props.id, MOVE_STEP));
      knightSprite.animations.play(this._attack.isDown ? 'attackUp' : 'runUp');
    } else if (this._cursors.down.isDown) {
      dispatch(moveDown(props.id, MOVE_STEP));
      knightSprite.animations.play(this._attack.isDown ? 'attackDown' : 'runDown');
    } else {
      knightSprite.animations.play('idle');
    }
  }
}

export default Input;
