import { forEach, has } from 'lodash';

const MAX_ALLOWED_MOVEMENT = 1000;

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

  // TODO: Refactor this
  if (action === 'run' && facing === 'none') {
    return 'idle';
  } else if (action === 'attack' && facing === 'none') {
    return 'attackDown';
  } else {
    return action + facing.charAt(0).toUpperCase() + facing.slice(1);
  }
}

/**
 *
 * @param {Phaser.Sprite} sprite
 * @param {Object} props
 * @returns {boolean}
 */
export function validateSpritePosition(sprite, props) {
  return Math.abs(sprite.x - props.x) < MAX_ALLOWED_MOVEMENT && Math.abs(sprite.y - props.y) < MAX_ALLOWED_MOVEMENT;
}
