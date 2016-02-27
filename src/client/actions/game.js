import { ContextTypes } from '../constants';
import { GameActions, FacingDirections } from 'shared/constants';

/**
 *
 * @param {Object} newState
 * @param {string} playerId
 * @returns {{type: string, newState: Object, playerId: string}}
 */
export function setState(newState, playerId) {
  return { type: GameActions.SET_STATE, newState, playerId, context: ContextTypes.CLIENT };
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
  return { type: GameActions.SET_POSITION, id, x, y, context };
}

/**
 *
 * @param {string} id
 * @param {number} vx
 * @param {number} vy
 * @returns {{type: string, x: number, y: number}}
 */
export function setVelocity(id, vx, vy) {
  return { type: GameActions.SET_VELOCITY, id, vx, vy };
}

/**
 *
 * @param {string} id
 * @returns {{type: string, x: number, y: number}}
 */
export function resetVelocity(id) {
  return setVelocity(id, 0, 0);
}

/**
 *
 * @param {string} id
 * @param {string} animation
 * @returns {{type: string, animation: string}}
 */
export function setAnimation(id, animation) {
  return { type: GameActions.SET_ANIMATION, id, animation, context: ContextTypes.SERVER };
}

/**
 *
 * @param {string} id
 * @param {string} facing
 * @returns {{type: string, id: string, facing: string}}
 */
export function setFacing(id, facing) {
  return { type: GameActions.SET_FACING, id, facing };
}

/**
 *
 * @param {string} id
 * @returns {{type: string, id: string, facing: string}}
 */
export function resetFacing(id) {
  return setFacing(id, FacingDirections.NONE);
}

/**
 *
 * @param {string} id
 * @returns {{type: string, id: string}}
 */
export function beginAttack(id) {
  return { type: GameActions.BEGIN_ATTACK, id };
}

/**
 *
 * @param {string} id
 * @returns {{type: string, id: string}}
 */
export function endAttack(id) {
  return { type: GameActions.END_ATTACK, id };
}

/**
 *
 * @param {string} id
 * @param {string} victimId
 * @returns {{type: string, id: string, targetId: string}}
 */
export function damageEntity(id, victimId) {
  return { type: GameActions.DAMAGE_ENTITY, id, victimId };
}

/**
 *
 * @param {string} playerId
 * @param {string} flagId
 * @returns {{type: string, playerId: string, flagId: string}}
 */
export function tagFlag(playerId, flagId) {
  return { type: GameActions.TAG_FLAG, playerId, flagId, context: ContextTypes.SERVER };
}
