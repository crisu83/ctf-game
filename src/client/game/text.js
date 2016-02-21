import { get } from 'lodash';

class Text {
  /**
   *
   * @param {Phaser.Text} text
   * @param {Object} style
   * @param {string} string
   * @param {string} placeholder
   */
  constructor(text, style, string, placeholder = '...') {
    text.setStyle(style);
    text.text = string.replace(/\{\w+\}/g, placeholder);

    this._text = text;
    this._style = style;
    this._string = string;
  }

  /**
   *
   * @param {Object} params
   * @param {Object} style
   */
  update(params, style) {
    const value = this._string.replace(/\{\w+\}/g, key => get(params, key.substring(1, key.length - 1), key));
    this._text.text = value;
    this._text.setStyle({ ...this._style, ...style });
  }

  /**
   *
   */
  destroy() {
    this._text.destroy();
  }
}

export default Text;
