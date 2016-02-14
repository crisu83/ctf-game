class Entity {
  /**
   *
   * @param {string} id
   * @param {Phaser.Sprite} sprite
   * @param {Phaser.Text} text
   */
  constructor(id, sprite, text) {
    this._id = id;
    this._sprite = sprite;
    this._text = text;
  }

  /**
   *
   * @param {Object} props
   */
  update(props) {
    if (props.x) {
      this._sprite.x = props.x;
      this._text.x = props.x + (this._sprite.width / 2);
    }
    if (props.y) {
      this._sprite.y = props.y;
      this._text.y = props.y;
    }
  }

  /**
   *
   */
  destroy() {
    this._sprite.destroy();
  }

  /**
   *
   * @returns {string}
   */
  get id() {
    return this._id;
  }

  /**
   *
   * @returns {Phaser.Sprite}
   */
  get sprite() {
    return this._sprite;
  }
}

export default Entity;
