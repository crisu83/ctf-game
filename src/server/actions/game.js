import { GameActions } from 'shared/constants';

/**
 *
 * @param {Object} entity
 * @returns {{type: string, entity: Object}}
 */
export function addEntity(entity) {
  return { type: GameActions.ADD_ENTITY, entity };
}

/**
 *
 * @param {string} id
 * @returns {{type: string, id: string}}
 */
export function removeEntity(id) {
  return { type: GameActions.REMOVE_ENTITY, id };
}

/**
 *
 * @param {string} id
 * @param {string} teamId
 * @returns {{type: string, id: string, teamId: string}}
 */
export function joinTeam(id, teamId) {
  return { type: GameActions.JOIN_TEAM, id, teamId };
}

/**
 *
 * @param {string} id
 * @returns {{type: string, id: string}}
 */
export function leaveTeam(id) {
  return { type: GameActions.LEAVE_TEAM, id };
}

/**
 *
 * @param {string} id
 * @param {string} lastAttackerId
 * @returns {{type: string, id: string, lastAttackerId: string}}
 */
export function killEntity(id, lastAttackerId) {
  return { type: GameActions.KILL_ENTITY, id, lastAttackerId };
}

/**
 *
 * @param {string} id
 * @returns {{type: string, id: string}}
 */
export function beginRevive(id) {
  return { type: GameActions.BEGIN_REVIVE, id };
}

/**
 *
 * @param {string} id
 * @returns {{type: string, id: string}}
 */
export function endRevive(id) {
  return { type: GameActions.END_REVIVE, id };
}

/**
 *
 * @param {string} id
 * @param {number} points
 * @returns {{type: string, id: string, points: number}}
 */
export function givePoints(id, points) {
  return { type: GameActions.GIVE_POINTS, id, points };
}

/**
 *
 * @param {number} elapsed
 * @returns {{type: string, elapsed: number}}
 */
export function advanceTime(elapsed) {
  return { type: GameActions.ADVANCE_TIME, elapsed };
}
