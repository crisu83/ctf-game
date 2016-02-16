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
   * @param {Object} nextProps
   * @param {function} dispatch
   */
  update(nextProps, dispatch) {
    const prevProps = this._props;

    this._components.sort((a, b) => a.priority - b.priority);

    forEach(this._components, component => {
      component.update(nextProps, prevProps, dispatch);
    });

    this._props = nextProps;
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
