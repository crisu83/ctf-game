export const SET_STATE = 'game/SET_STATE';
export const SET_POSITION = 'game/SET_POSITION';
export const SET_VELOCITY = 'game/SET_VELOCITY';
export const SET_ANIMATION = 'game/SET_ANIMATION';
export const SET_FACING = 'game/SET_FACING';
export const START_ATTACKING = 'game/START_ATTACK';
export const DAMAGE_ENTITY = 'game/DAMAGE_ENTITY';
export const CAPTURE_FLAG = 'game/CAPTURE_FLAG';

export const CONTEXT_CLIENT = 'client';
export const CONTEXT_SERVER = 'server';

/**
 *
 * @param {Object} newState
 * @returns {{type: string, newState: Object, context: string}}
 */
export function setState(newState) {
  return {type: SET_STATE, newState, context: CONTEXT_CLIENT};
}

/**
 *
 * @param {string} id
 * @param {number} x
 * @param {number} y
 * @param {string} context
 * @returns {{type: string, x: number, y: number}}
 */
export function setPosition(id, x, y, context) {
  return {type: SET_POSITION, id, x, y, context};
}

/**
 *
 * @param {string} id
 * @param {number} vx
 * @param {number} vy
 * @returns {{type: string, x: number, y: number}}
 */
export function setVelocity(id, vx, vy) {
  return {type: SET_VELOCITY, id, vx, vy};
}

/**
 *
 * @param {string} id
 * @param {string} animation
 * @returns {{type: string, animation: string}}
 */
export function setAnimation(id, animation) {
  return {type: SET_ANIMATION, id, animation};
}

/**
 *
 * @param {string} id
 * @param {string} facing
 * @returns {{type: string, id: string, facing: string}}
 */
export function setFacing(id, facing) {
  return {type: SET_FACING, id, facing};
}

/**
 *
 * @param {string} id
 * @returns {{type: string, id: string}}
 */
export function startAttacking(id) {
  return {type: START_ATTACKING, id};
}

/**
 *
 * @param {string} id
 * @param {string} victimId
 * @returns {{type: string, id: string, targetId: string}}
 */
export function damageEntity(id, victimId) {
  return {type: DAMAGE_ENTITY, id, victimId};
}

/**
 *
 * @param {string} playerId
 * @param {string} flagId
 * @returns {{type: string, playerId: string, flagId: string, context: string}}
 */
export function captureFlag(playerId, flagId) {
  return {type: CAPTURE_FLAG, playerId, flagId, context: CONTEXT_SERVER};
}
