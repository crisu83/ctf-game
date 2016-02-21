import { get } from 'lodash';

class Text {
  /**
   *
   * @param {Phaser.Text} text
   * @param {string} string
   * @param {string} placeholder
   */
  constructor(text, string, placeholder = '...') {
    text.text = string.replace(/\{\w+\}/g, placeholder);

    this._text = text;
    this._string = string;
  }

  /**
   *
   * @param {Object} params
   */
  update(params) {
    const value = this._string.replace(/\{\w+\}/g, key => get(params, key.substring(1, key.length - 1), key));
    this._text.text = value;
  }

  /**
   *
   */
  destroy() {
    this._text.destroy();
  }
}

export default Text;
