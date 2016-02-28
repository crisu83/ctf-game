import { ContextTypes } from '../constants';
import { EntityActions, FacingDirections } from 'shared/constants';

/**
 *
 * @param {Object} newState
 * @param {string} playerId
 * @returns {{type: string, newState: Object, playerId: string}}
 */
export function updateState(newState, playerId) {
  return { type: EntityActions.UPDATE_STATE, newState, playerId, context: ContextTypes.CLIENT };
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
  return { type: EntityActions.SET_POSITION, id, x, y, context };
}

/**
 *
 * @param {string} id
 * @param {number} vx
 * @param {number} vy
 * @returns {{type: string, x: number, y: number}}
 */
export function setVelocity(id, vx, vy) {
  return { type: EntityActions.SET_VELOCITY, id, vx, vy, context: ContextTypes.CLIENT };
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
  return { type: EntityActions.SET_ANIMATION, id, animation, context: ContextTypes.SERVER };
}

/**
 *
 * @param {string} id
 * @param {string} facing
 * @returns {{type: string, id: string, facing: string}}
 */
export function setFacing(id, facing) {
  return { type: EntityActions.SET_FACING, id, facing };
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
  return { type: EntityActions.BEGIN_ATTACK, id, context: ContextTypes.CLIENT };
}

/**
 *
 * @param {string} id
 * @returns {{type: string, id: string}}
 */
export function endAttack(id) {
  return { type: EntityActions.END_ATTACK, id, context: ContextTypes.CLIENT };
}

/**
 *
 * @param {string} id
 * @param {string} victimId
 * @returns {{type: string, id: string, targetId: string}}
 */
export function damageEntity(id, victimId) {
  return { type: EntityActions.DAMAGE_ENTITY, id, victimId, context: ContextTypes.SERVER };
}

/**
 *
 * @param {string} flagId
 * @param {string} playerId
 * @returns {{type: string, playerId: string, flagId: string}}
 */
export function tagFlag(flagId, playerId) {
  return { type: EntityActions.TAG_FLAG, flagId, playerId, context: ContextTypes.SERVER };
}
