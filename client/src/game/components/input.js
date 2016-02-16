import Component from '../component';

class Input extends Component {
  /**
   *
   * @param {Entity} owner
   * @param {Object} keys
   * @param {function} onUpdate
   */
  constructor(owner, keys, onUpdate) {
    super('input', 0, owner, onUpdate);

    this._keys = keys;
  }

  /**
   *
   * @param {string} key
   * @returns {Object}
   */
  getKey(key) {
    return this._keys[key];
  }
}

export default Input;
