import { forEach } from 'lodash';
import Component from 'shared/game/component';

class Text extends Component {
  /**
   *
   * @param {Array<Phaser.Text>} texts
   * @param {function} onUpdate
   */
  constructor(texts, onUpdate) {
    super('text', 2, onUpdate);

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


