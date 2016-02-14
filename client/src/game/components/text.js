import Component, { PHASE_LOGIC } from '../component';

class Text extends Component {
  /**
   *
   * @param {Entity} owner
   * @param {Array<Phaser.Text>} texts
   */
  constructor(owner, texts) {
    super(owner, PHASE_LOGIC);

    this._key = 'text';
    this._texts = texts;
  }

  /**
   *
   * @param {string} key
   * @returns {Phaser.Text}
   */
  get(key) {
    return this._texts[key];
  }
}

export default Text;


