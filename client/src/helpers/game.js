import { forEach, has } from 'lodash';

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

/**
 *
 * @param {Object} props
 * @returns {boolean}
 */
export function isEntityMoving(props) {
  return (has(props, 'vx') && props.vx !== 0) && (has(props, 'vy') && props.vy !== 0);
}

/**
 *
 * @param {string} action
 * @param {string} facing
 * @returns {string}
 */
export function resolveActionAnimation(action, facing) {
  facing = facing || 'none';
  return action + facing.charAt(0).toUpperCase() + facing.slice(1);
}
