class Entity {
  /**
   *
   * @param {Object} props
   */
  constructor(props) {
    this._props = props;
    this._components = [];
  }

  /**
   *
   * @param {Object} props
   * @param {function} dispatch
   */
  update(props, dispatch) {
    this._components.sort((a, b) => a.priority - b.priority);

    for (let i = 0; i < this._components.length; i++) {
      this._components[i].update(props, dispatch);
    }

    this._props = props;
  }

  /**
   *
   */
  destroy() {
    for (let i = 0; i < this._components.length; i++) {
      this._components[i].destroy();
    }
  }

  /**
   *
   * @param {Component} component
   */
  addComponent(component) {
    component.entity = this;
    this._components.push(component);
  }

  /**
   *
   * @param {string} key
   * @returns {Component}
   */
  getComponent(key) {
    for (let i = 0; i < this._components.length; i++) {
      if (this._components[i].key === key) {
        return this._components[i];
      }
    }

    return null;
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
   * @returns {string}
   */
  get id() {
    return this.getProp('id');
  }

  /**
   *
   * @param {Array<Component>} components
   */
  set components(components) {
    this._components = components;
  }
}

export default Entity;
