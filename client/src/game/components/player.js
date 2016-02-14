import Component, { PHASE_LOGIC } from '../component';

class Player extends Component {
  /**
   *
   * @param {Entity} owner
   */
  constructor(owner) {
    super(owner, PHASE_LOGIC);

    this._key = 'player';
  }

  /**
   *
   * @param {Object} newProps
   * @param {Object} props
   * @param {number} elapsed
   * @param {function} dispatch
   */
  update(newProps, props, elapsed, dispatch) {
    const knight = this.getComponent('sprite').get('knight');

    knight.x = newProps.x;
    knight.y = newProps.y;

    const name = this.getComponent('text').get('name');
    name.x = newProps.x + (knight.width / 2);
    name.y = newProps.y;
  }
}

export default Player;
