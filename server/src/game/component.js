class Component {
  /**
   *
   * @param {string} key
   * @param {number} priority
   * @param {Entity} owner
   * @param {function} onUpdate
   */
  constructor(key, priority, owner, onUpdate) {
    this._key = key;
    this._priority = priority;
    this._owner = owner;
    this._onUpdate = onUpdate ? onUpdate.bind(this) : () => {};
  }

  /**
   *
   * @param {Object} nextProps
   * @param {Object} prevProps
   * @param {function} dispatch
   */
  update(nextProps, prevProps, dispatch) {
    this._onUpdate(nextProps, prevProps, dispatch);
  }

  /**
   *
   */
  destroy() {
  }

  /**
   *
   * @param {string} key
   * @returns {Component}
   */
  getComponent(key) {
    return this._owner.getComponent(key);
  }

  /**
   *
   * @returns {string}
   */
  get key() {
    return this._key;
  }

  /**
   *
   * @returns {number}
   */
  get priority() {
    return this._priority;
  }
}

export default Component;
