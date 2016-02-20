class Component {
  /**
   *
   * @param {string} key
   * @param {number} priority
   * @param {function} onUpdate
   */
  constructor(key, priority, onUpdate) {
    this._key = key;
    this._priority = priority;
    this._onUpdate = onUpdate ? onUpdate.bind(this) : () => {};
    this._entity = null;
    this._props = {};
  }

  /**
   *
   * @param {Object} props
   * @param {function} dispatch
   */
  update(props, dispatch) {
    this._onUpdate(props, dispatch);
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
    return this._entity.getComponent(key);
  }

  /**
   *
   * @param {string} key
   * @param {*} value
   */
  setProp(key, value) {
    this._props[key] = value;
  }

  /**
   *
   * @param {string} key
   * @returns {*}
   */
  getProp(key) {
    return this._props[key];
  }

  /**
   *
   * @param {Entity} entity
   */
  set entity(entity) {
     this._entity = entity;
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
