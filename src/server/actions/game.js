export const ADD_ENTITY = 'game/ADD_ENTITY';
export const REMOVE_ENTITY = 'game/REMOVE_ENTITY';
export const JOIN_TEAM = 'game/JOIN_TEAM';
export const LEAVE_TEAM = 'game/LEAVE_TEAM';
export const SET_POSITION = 'game/SET_POSITION';
export const SET_VELOCITY = 'game/SET_VELOCITY';
export const SET_ANIMATION = 'game/SET_ANIMATION';
export const SET_FACING = 'game/SET_FACING';
export const BEGIN_ATTACK = 'game/BEGIN_ATTACK';
export const END_ATTACK = 'game/END_ATTACK';
export const DAMAGE_ENTITY = 'game/DAMAGE_ENTITY';
export const KILL_ENTITY = 'game/KILL_ENTITY';
export const BEGIN_REVIVE = 'game/BEGIN_REVIVE';
export const END_REVIVE = 'game/END_REVIVE';
export const GIVE_POINTS = 'game/GIVE_POINTS';
export const TAG_FLAG = 'game/TAG_FLAG';
export const ADVANCE_TIME = 'game/ADVANCE_TIME';

/**
 *
 * @param {Object} entity
 * @returns {{type: string, entity: Object}}
 */
export function addEntity(entity) {
  return { type: ADD_ENTITY, entity };
}

/**
 *
 * @param {string} id
 * @returns {{type: string, id: string}}
 */
export function removeEntity(id) {
  return { type: REMOVE_ENTITY, id };
}

/**
 *
 * @param {string} id
 * @param {string} teamId
 * @returns {{type: string, id: string, teamId: string}}
 */
export function joinTeam(id, teamId) {
  return { type: JOIN_TEAM, id, teamId };
}

/**
 *
 * @param {string} id
 * @returns {{type: string, id: string}}
 */
export function leaveTeam(id) {
  return { type: LEAVE_TEAM, id };
}

/**
 *
 * @param {string} id
 * @param {string} lastAttackerId
 * @returns {{type: string, id: string, lastAttackerId: string}}
 */
export function killEntity(id, lastAttackerId) {
  return { type: KILL_ENTITY, id, lastAttackerId };
}

/**
 *
 * @param {string} id
 * @returns {{type: string, id: string}}
 */
export function beginRevive(id) {
  return { type: BEGIN_REVIVE, id };
}

/**
 *
 * @param {string} id
 * @returns {{type: string, id: string}}
 */
export function endRevive(id) {
  return { type: END_REVIVE, id };
}

/**
 *
 * @param {string} id
 * @param {number} points
 * @returns {{type: string, id: string, points: number}}
 */
export function givePoints(id, points) {
  return { type: GIVE_POINTS, id, points };
}

/**
 *
 * @param {number} elapsed
 * @returns {{type: string, elapsed: number}}
 */
export function advanceTime(elapsed) {
  return { type: ADVANCE_TIME, elapsed };
}
