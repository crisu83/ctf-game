import { forEach } from 'lodash';

/**
 *
 * @param {Array} entities
 * @param {string} id
 * @returns {Object}
 */
export function findEntityById(entities, id) {
  let result = null;

  forEach(entities, (entity) => {
    if (entity.id === id) {
      result = entity;
    }
  });

  return result;
}

/**
 *
 * @param {Array}entities
 * @param {string} id
 * @returns {number}
 */
export function findEntityIndexById(entities, id) {
  let result = -1;

  forEach(entities, (entity, index) => {
    if (entity.id === id) {
      result = index;
    }
  });

  return result;
}
