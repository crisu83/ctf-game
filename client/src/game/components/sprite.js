import { forEach } from 'lodash';
import Component, { PHASE_LOGIC } from '../component';

class Sprite extends Component {
  /**
   *
   * @param {Entity} owner
   * @param {Array<Phaser.Sprite>} sprites
   * @param {function} onUpdate
   */
  constructor(owner, sprites, onUpdate) {
    super('sprite', PHASE_LOGIC, owner, onUpdate);

    this._sprites = sprites;
  }

  /**
   *
   */
  destroy() {
    forEach(this._sprites, sprite => {
      sprite.destroy();
    });
  }

  /**
   *
   * @param {string} key
   * @returns {Phaser.Sprite}
   */
  getSprite(key) {
    return this._sprites[key];
  }
}

export default Sprite;


