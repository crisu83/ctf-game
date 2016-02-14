export const SET_STATE = 'SET_STATE';
export const MOVE_LEFT = 'MOVE_LEFT';
export const MOVE_RIGHT = 'MOVE_RIGHT';
export const MOVE_UP = 'MOVE_UP';
export const MOVE_DOWN = 'MOVE_DOWN';

/**
 *
 * @param {Object} newState
 * @returns {{type: string, newState: Object}}
 */
export function setState(newState) {
  return {type: SET_STATE, newState};
}

/**
 *
 * @param {string} id
 * @param {number} step
 * @returns {{type: string, id: string, step: number, remote: boolean}}
 */
export function moveLeft(id, step) {
  return {type: MOVE_LEFT, id, step, remote: true};
}

/**
 *
 * @param {string} id
 * @param {number} step
 * @returns {{type: string, id: string, step: number, remote: boolean}}
 */
export function moveRight(id, step) {
  return {type: MOVE_RIGHT, id, step, remote: true};
}

/**
 *
 * @param {string} id
 * @param {number} step
 * @returns {{type: string, id: string, step: number, remote: boolean}}
 */
export function moveUp(id, step) {
  return {type: MOVE_UP, id, step, remote: true};
}

/**
 *
 * @param {string} id
 * @param {number} step
 * @returns {{type: string, id: string, step: number, remote: boolean}}
 */
export function moveDown(id, step) {
  return {type: MOVE_DOWN, id, step, remote: true};
}
