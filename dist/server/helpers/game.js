'use strict';Object.defineProperty(exports,'__esModule',{value:true});exports.findEntityById=findEntityById;exports.findEntityIndexById=findEntityIndexById;exports.findWeakestTeamId=findWeakestTeamId;exports.findTeamIndexByPlayerId=findTeamIndexByPlayerId;exports.calculateBaseSpawnPosition=calculateBaseSpawnPosition;var _lodash=require('lodash');var _vendor=require('./vendor');var _entity=require('../factories/entity'); /**
 *
 * @param {Array} entities
 * @param {string} id
 * @returns {Object}
 */function findEntityById(entities,id){var result=null;(0,_lodash.forEach)(entities,function(entity){if(entity.id===id){result=entity}});return result} /**
 *
 * @param {Array} entities
 * @param {string} id
 * @returns {number}
 */function findEntityIndexById(entities,id){var result=-1;(0,_lodash.forEach)(entities,function(entity,index){if(entity.id===id){result=index}});return result} /**
 *
 * @param {Array} entities
 * @returns {string}
 */function findWeakestTeamId(entities){var leastPlayers=undefined,result=-1;(0,_lodash.forEach)(entities,function(entity){if(entity.type===_entity.TEAM){var teamSize=entity.players?entity.players.length:0;if((0,_lodash.isUndefined)(leastPlayers)||teamSize<leastPlayers){leastPlayers=teamSize;result=entity.id}}});return result} /**
 *
 * @param {Array} entities
 * @param {string} id
 * @returns {number}
 */function findTeamIndexByPlayerId(entities,id){var result=-1;(0,_lodash.forEach)(entities,function(entity,index){if(entity.type===_entity.TEAM){(0,_lodash.forEach)(entity.players,function(playerId){if(playerId===id){result=index}})}});return result} /**
 *
 * @param {Object} playerProps
 * @param {Object} baseProps
 * @returns {{x: number, y: number}}
 */function calculateBaseSpawnPosition(playerProps,baseProps){return {x:_vendor.chance.integer({min:baseProps.x,max:baseProps.x+baseProps.width-playerProps.width}),y:_vendor.chance.integer({min:baseProps.y,max:baseProps.y+baseProps.height-playerProps.height})}}
//# sourceMappingURL=game.js.map