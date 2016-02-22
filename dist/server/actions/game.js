'use strict';Object.defineProperty(exports,'__esModule',{value:true});exports.addEntity=addEntity;exports.removeEntity=removeEntity;exports.assignTeam=assignTeam;exports.leaveTeam=leaveTeam;exports.killEntity=killEntity;exports.reviveEntity=reviveEntity;exports.addPoints=addPoints;exports.advanceTime=advanceTime;var ADD_ENTITY=exports.ADD_ENTITY='game/ADD_ENTITY';var REMOVE_ENTITY=exports.REMOVE_ENTITY='game/REMOVE_ENTITY';var ASSIGN_TEAM=exports.ASSIGN_TEAM='game/ASSIGN_TEAM';var LEAVE_TEAM=exports.LEAVE_TEAM='game/LEAVE_TEAM';var SET_POSITION=exports.SET_POSITION='game/SET_POSITION';var SET_VELOCITY=exports.SET_VELOCITY='game/SET_VELOCITY';var SET_ANIMATION=exports.SET_ANIMATION='game/SET_ANIMATION';var SET_FACING=exports.SET_FACING='game/SET_FACING';var BEGIN_ATTACK=exports.BEGIN_ATTACK='game/BEGIN_ATTACK';var END_ATTACK=exports.END_ATTACK='game/END_ATTACK';var DAMAGE_ENTITY=exports.DAMAGE_ENTITY='game/DAMAGE_ENTITY';var KILL_ENTITY=exports.KILL_ENTITY='game/KILL_ENTITY';var REVIVE_ENTITY=exports.REVIVE_ENTITY='game/REVIVE_ENTITY';var ADD_POINTS=exports.ADD_POINTS='game/ADD_POINTS';var TAG_FLAG=exports.TAG_FLAG='game/TAG_FLAG';var ADVANCE_TIME=exports.ADVANCE_TIME='game/ADVANCE_TIME'; /**
 *
 * @param {Object} entity
 * @returns {{type: string, entity: Object}}
 */function addEntity(entity){return {type:ADD_ENTITY,entity:entity}} /**
 *
 * @param {string} id
 * @returns {{type: string, id: string}}
 */function removeEntity(id){return {type:REMOVE_ENTITY,id:id}} /**
 *
 * @param {string} id
 * @returns {{type: string, id: string}}
 */function assignTeam(id){return {type:ASSIGN_TEAM,id:id}} /**
 *
 * @param {string} id
 * @returns {{type: string, id: string}}
 */function leaveTeam(id){return {type:LEAVE_TEAM,id:id}} /**
 *
 * @param {string} id
 * @param {string} lastAttackerId
 * @returns {{type: string, id: string, lastAttackerId: string}}
 */function killEntity(id,lastAttackerId){return {type:KILL_ENTITY,id:id,lastAttackerId:lastAttackerId}} /**
 *
 * @param {string} id
 * @returns {{type: string, id: string}}
 */function reviveEntity(id){return {type:REVIVE_ENTITY,id:id}} /**
 *
 * @param {string} id
 * @param {number} points
 * @returns {{type: string, id: string, points: number}}
 */function addPoints(id,points){return {type:ADD_POINTS,id:id,points:points}} /**
 *
 * @param {number} elapsed
 * @returns {{type: string, elapsed: number}}
 */function advanceTime(elapsed){return {type:ADVANCE_TIME,elapsed:elapsed}}
//# sourceMappingURL=game.js.map