export const SET_STATE = 'game/SET_STATE';
export const SET_POSITION = 'game/SET_POSITION';
export const SET_VELOCITY = 'game/SET_VELOCITY';
export const SET_ANIMATION = 'game/SET_ANIMATION';

export const CONTEXT_CLIENT = 'client';
export const CONTEXT_SERVER = 'server';

/**
 *
 * @param {Object} newState
 * @returns {{type: string, newState: Object}}
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
 * @returns {{type: string, x: number, y: number, serverOnly: boolean, remote: boolean}}
 */
export function setPosition(id, x, y, context) {
  return {type: SET_POSITION, id, x, y, context};
}

/**
 *
 * @param {string} id
 * @param {number} vx
 * @param {number} vy
 * @returns {{type: string, x: number, y: number, remote: boolean}}
 */
export function setVelocity(id, vx, vy) {
  return {type: SET_VELOCITY, id, vx, vy};
}

/**
 *
 * @param {string} id
 * @param {string} animation
 * @returns {{type: string, animation: string, remote: boolean}}
 */
export function setAnimation(id, animation) {
  return {type: SET_ANIMATION, id, animation};
}
