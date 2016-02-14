import { find, forEach } from 'lodash';

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
   * @param {Object} newProps
   * @param {number} elapsed
   * @param {function} dispatch
   */
  update(newProps, elapsed, dispatch) {
    this._components.sort((a, b) => a.phase - b.phase);

    forEach(this._components, component => {
      component.update(newProps, this._props, elapsed, dispatch);
    });

    this._props = newProps;
  }

  /**
   *
   */
  destroy() {
    forEach(this._components, component => {
      component.destroy();
    });
  }

  /**
   *
   * @param {Component} component
   */
  addComponent(component) {
    this._components.push(component);
  }

  /**
   *
   * @param {string} key
   * @returns {Component}
   */
  getComponent(key) {
    return find(this._components, component => component.key === key);
  }

  /**
   *
   * @returns {string}
   */
  get id() {
    return this._props.id;
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
