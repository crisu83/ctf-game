export const PHASE_INPUT = 0;
export const PHASE_LOGIC = 1;

class Component {
  /**
   *
   * @param {string} key
   * @param {number} phase
   * @param {Entity} owner
   * @param {function} onUpdate
   */
  constructor(key, phase, owner, onUpdate) {
    this._key = key;
    this._phase = phase;
    this._owner = owner;
    this._onUpdate = onUpdate ? onUpdate.bind(this) : () => {};
  }

  /**
   *
   * @param {Object} newProps
   * @param {number} elapsed
   * @param {function} dispatch
   */
  update(newProps, elapsed, dispatch) {
    this._onUpdate(newProps, elapsed, dispatch);
  }

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
  get phase() {
    return this._phase;
  }
}

export default Component;
