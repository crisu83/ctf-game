import { forEach } from 'lodash';
import Component, { PHASE_LOGIC } from '../component';

class Text extends Component {
  /**
   *
   * @param {Entity} owner
   * @param {Array<Phaser.Text>} texts
   * @param {function} onUpdate
   */
  constructor(owner, texts, onUpdate) {
    super('text', PHASE_LOGIC, owner, onUpdate);

    this._texts = texts;
  }

  /**
   *
   */
  destroy() {
    forEach(this._texts, text => {
      text.destroy();
    });
  }

  /**
   *
   * @param {string} key
   * @returns {Phaser.Text}
   */
  getText(key) {
    return this._texts[key];
  }
}

export default Text;


