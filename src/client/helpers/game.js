import { forEach, has } from 'lodash';

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
 * @param {number} value1
 * @param {number} value2
 * @returns {float}
 */
export function calculateRatio(value1, value2) {
  if (value1 === 0) {
    return 0;
  } else if (value2 === 0) {
    return value1;
  } else {
    return value1 / value2;
  }
}

/**
 *
 * @param {string} action
 * @param {string} facing
 * @returns {string}
 */
export function resolveActionAnimation(action, facing) {
  facing = facing || 'none';

  // TODO: Refactor this method
  if (action === 'run' && facing === 'none') {
    return 'idle';
  } else if (action === 'attack' && facing === 'none') {
    return 'attackDown';
  } else {
    return action + facing.charAt(0).toUpperCase() + facing.slice(1);
  }
}
