class Entity {
  /**
   *
   * @param {string} id
   * @param {Phaser.Sprite} sprite
   */
  constructor(id, sprite) {
    this._id = id;
    this._sprite = sprite;
  }

  /**
   *
   */
  destroy() {
    this.sprite.destroy();
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
