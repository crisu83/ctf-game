export const ADD_ENTITY = 'game/ADD_ENTITY';
export const REMOVE_ENTITY =  'game/REMOVE_ENTITY';
export const SET_POSITION = 'game/SET_POSITION';
export const SET_VELOCITY = 'game/SET_VELOCITY';
export const SET_ANIMATION = 'game/SET_ANIMATION';
export const SET_FACING = 'game/SET_FACING';
export const START_ATTACKING = 'game/START_ATTACK';
export const STOP_ATTACKING = 'game/STOP_ATTACKING';
export const DAMAGE_ENTITY = 'game/DAMAGE_ENTITY';
export const KILL_ENTITY = 'game/KILL_ENTITY';
export const REVIVE_ENTITY = 'game/REVIVE_ENTITY';
export const CAPTURE_FLAG = 'game/CAPTURE_FLAG';
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
 * @param {string} id
 * @returns {{type: string, id: string}}
 */
export function stopAttacking(id) {
  return {type: STOP_ATTACKING, id};
}

/**
 *
 * @param {string} id
 * @returns {{type: string, id: string}}
 */
export function killEntity(id) {
  return {type: KILL_ENTITY, id};
}

/**
 *
 * @param {string} id
 * @returns {{type: string, id: string}}
 */
export function reviveEntity(id) {
  return {type: REVIVE_ENTITY, id};
}

/**
 *
 * @param {number} elapsed
 * @returns {{type: string, elapsed: number}}
 */
export function advanceTime(elapsed) {
  return {type: ADVANCE_TIME, elapsed};
}
