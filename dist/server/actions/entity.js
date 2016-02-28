'use strict';Object.defineProperty(exports,'__esModule',{value:true});exports.addEntity=addEntity;exports.removeEntity=removeEntity;exports.killEntity=killEntity;exports.beginRevive=beginRevive;exports.endRevive=endRevive;exports.joinTeam=joinTeam;exports.leaveTeam=leaveTeam;exports.givePoints=givePoints;var _constants=require('../../shared/constants'); /**
 *
 * @param {Object} entity
 * @returns {{type: string, entity: Object}}
 */function addEntity(entity){return {type:_constants.EntityActions.ADD_ENTITY,entity:entity}} /**
 *
 * @param {string} id
 * @returns {{type: string, id: string}}
 */function removeEntity(id){return {type:_constants.EntityActions.REMOVE_ENTITY,id:id}} /**
 *
 * @param {string} id
 * @param {string} lastAttackerId
 * @returns {{type: string, id: string, lastAttackerId: string}}
 */function killEntity(id,lastAttackerId){return {type:_constants.EntityActions.KILL_ENTITY,id:id,lastAttackerId:lastAttackerId}} /**
 *
 * @param {string} id
 * @param {number} x
 * @param {number} y
 * @returns {{type: string, id: string}}
 */function beginRevive(id,x,y){return {type:_constants.EntityActions.BEGIN_REVIVE,id:id,x:x,y:y}} /**
 *
 * @param {string} id
 * @returns {{type: string, id: string}}
 */function endRevive(id){return {type:_constants.EntityActions.END_REVIVE,id:id}} /**
 *
 * @param {string} teamId
 * @param {string} playerId
 * @returns {{type: string, teamId: string, playerId: string}}
 */function joinTeam(teamId,playerId){return {type:_constants.EntityActions.JOIN_TEAM,teamId:teamId,playerId:playerId}} /**
 *
 * @param {string} playerId
 * @returns {{type: string, playerId: string}}
 */function leaveTeam(playerId){return {type:_constants.EntityActions.LEAVE_TEAM,playerId:playerId}} /**
 *
 * @param {string} id
 * @param {number} points
 * @returns {{type: string, id: string, points: number}}
 */function givePoints(id,points){return {type:_constants.EntityActions.GIVE_POINTS,id:id,points:points}}
//# sourceMappingURL=entity.js.map