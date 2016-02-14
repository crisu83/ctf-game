export const ADD_ENTITY = 'game/ADD_ENTITY';
export const REMOVE_ENTITY =  'game/REMOVE_ENTITY';
export const MOVE_LEFT = 'game/MOVE_LEFT';
export const MOVE_RIGHT = 'game/MOVE_RIGHT';
export const MOVE_UP = 'game/MOVE_UP';
export const MOVE_DOWN = 'game/MOVE_DOWN';
export const ADVANCE_TIME = 'game/ADVANCE_TIME';

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
