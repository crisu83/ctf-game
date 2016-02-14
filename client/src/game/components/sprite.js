import Component, { PHASE_LOGIC } from '../component';

class Sprite extends Component {
  /**
   *
   * @param {Entity} owner
   * @param {Array<Phaser.Sprite>} sprites
   */
  constructor(owner, sprites) {
    super(owner, PHASE_LOGIC);

    this._key = 'sprite';
    this._sprites = sprites;
  }

  /**
   *
   * @param {string} key
   * @returns {Phaser.Sprite}
   */
  get(key) {
    return this._sprites[key];
  }
}

export default Sprite;


