export const PHASE_INPUT = 0;
export const PHASE_LOGIC = 1;

class Component {
  /**
   *
   * @param {Entity} owner
   * @param {number} phase
   */
  constructor(owner, phase) {
    this._key = 'component';
    this._owner = owner;
    this._phase = phase;
  }

  /**
   *
   * @param {Object} newProps
   * @param {Object} props
   * @param {number} elapsed
   * @param {function} dispatch
   */
  update(newProps, props, elapsed, dispatch) {
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
