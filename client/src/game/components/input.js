import Component from '../component';

class Input extends Component {
  /**
   *
   * @param {Object} keys
   * @param {function} onUpdate
   */
  constructor(keys, onUpdate) {
    super('input', 0, onUpdate);

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
