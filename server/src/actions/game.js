export const ADD_ENTITY = 'ADD_ENTITY';
export const REMOVE_ENTITY =  'REMOVE_ENTITY';
export const MOVE_LEFT = 'MOVE_LEFT';
export const MOVE_RIGHT = 'MOVE_RIGHT';
export const MOVE_UP = 'MOVE_UP';
export const MOVE_DOWN = 'MOVE_DOWN';
export const ADVANCE_TIME = 'ADVANCE_TIME';

/**
 *
 * @param {Object} entity
 * @returns {{type: string, entity: Object}}
 */
export function addEntity(entity) {
  return {type: ADD_ENTITY, entity};
}

/**
 *
 * @param {string} id
 * @returns {{type: string, id: string}}
 */
export function removeEntity(id) {
  return {type: REMOVE_ENTITY, id};
}

/**
 *
 * @param {number} elapsed
 * @returns {{type: string, elapsed: number}}
 */
export function advanceTime(elapsed) {
  return {type: ADVANCE_TIME, elapsed};
}
