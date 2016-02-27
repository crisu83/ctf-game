import { find, forEach } from 'lodash';
import Entity from 'shared/game/entity';

class EntityManager {
  /**
   *
   * @param {function} onEntityCreate
   */
  constructor(onEntityCreate) {
    this._onEntityCreate = onEntityCreate;
    this._entities = [];
  }

  /**
   *
   * @param {Object} entityProps
   * @param {function} dispatch
   * @returns {Array}
   */
  updateFromProps(entityProps, dispatch) {
    let updatedEntityIds = [];

    forEach(entityProps, props => {
      let entity = this.getEntity(props.id);

      if (!entity) {
        entity = this._onEntityCreate(props);

        if (entity) {
          this.addEntity(entity);
        }
      }

      if (entity) {
        entity.update(props, dispatch);
        updatedEntityIds.push(props.id);
      }
    });

    this._entities = this._entities.filter(entity => {
      const found = updatedEntityIds.indexOf(entity.id) !== -1;

      if (!found) {
        entity.destroy();
      }

      return found;
    });
  }

  /**
   *
   * @param {Entity} entity
   */
  addEntity(entity) {
    if (!entity instanceof Entity) {
      throw new Error('Entity must be an instance of Entity.');
    }

    this._entities.push(entity);
  }

  /**
   *
   * @param {string} id
   * @returns {Entity}
   */
  getEntity(id) {
    return find(this._entities, entity => entity.getProp('id') === id);
  }

  /**
   *
   * @param {function} filter
   * @return {Array}
   */
  filterEntities(filter) {
    return this._entities.filter(filter);
  }

  /**
   *
   * @param {string} type
   * @returns {Array}
   */
  filterByType(type) {
    return this._entities.filter(entity => entity.getProp('type') === type);
  }
}

export default EntityManager;
