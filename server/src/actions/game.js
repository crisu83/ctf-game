export const ADD_ENTITY = 'game/ADD_ENTITY';
export const REMOVE_ENTITY =  'game/REMOVE_ENTITY';
export const SET_POSITION = 'game/SET_POSITION';
export const SET_VELOCITY = 'game/SET_VELOCITY';
export const SET_ANIMATION = 'game/SET_ANIMATION';
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
