import { EntityActions } from 'shared/constants';

/**
 *
 * @param {Object} entity
 * @returns {{type: string, entity: Object}}
 */
export function addEntity(entity) {
  return { type: EntityActions.ADD_ENTITY, entity };
}

/**
 *
 * @param {string} id
 * @returns {{type: string, id: string}}
 */
export function removeEntity(id) {
  return { type: EntityActions.REMOVE_ENTITY, id };
}

/**
 *
 * @param {string} id
 * @param {string} lastAttackerId
 * @returns {{type: string, id: string, lastAttackerId: string}}
 */
export function killEntity(id, lastAttackerId) {
  return { type: EntityActions.KILL_ENTITY, id, lastAttackerId };
}

/**
 *
 * @param {string} id
 * @returns {{type: string, id: string}}
 */
export function beginRevive(id) {
  return { type: EntityActions.BEGIN_REVIVE, id };
}

/**
 *
 * @param {string} id
 * @returns {{type: string, id: string}}
 */
export function endRevive(id) {
  return { type: EntityActions.END_REVIVE, id };
}

/**
 *
 * @param {string} teamId
 * @param {string} playerId
 * @returns {{type: string, teamId: string, playerId: string}}
 */
export function joinTeam(teamId, playerId) {
  return { type: EntityActions.JOIN_TEAM, teamId, playerId };
}

/**
 *
 * @param {string} playerId
 * @returns {{type: string, playerId: string}}
 */
export function leaveTeam(playerId) {
  return { type: EntityActions.LEAVE_TEAM, playerId };
}

/**
 *
 * @param {string} id
 * @param {number} points
 * @returns {{type: string, id: string, points: number}}
 */
export function givePoints(id, points) {
  return { type: EntityActions.GIVE_POINTS, id, points };
}
