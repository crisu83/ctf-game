'use strict';Object.defineProperty(exports,'__esModule',{value:true});exports.findEntityById=findEntityById;exports.findEntityIndexById=findEntityIndexById;exports.findWeakestTeamIndex=findWeakestTeamIndex;exports.findTeamIndexByPlayerId=findTeamIndexByPlayerId;exports.findTeamByColor=findTeamByColor;exports.calculateBaseSpawnPosition=calculateBaseSpawnPosition;var _lodash=require('lodash');var _vendor=require('./vendor'); /**
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
 * @returns {number}
 */function findWeakestTeamIndex(entities){var leastPlayers=undefined,result=-1;(0,_lodash.forEach)(entities,function(entity,index){if(entity.type==='base'){var teamSize=entity.players?entity.players.length:0;if((0,_lodash.isUndefined)(leastPlayers)||teamSize<leastPlayers){leastPlayers=teamSize;result=index}}});return result} /**
 *
 * @param {Array} entities
 * @param {string} id
 * @returns {number}
 */function findTeamIndexByPlayerId(entities,id){var result=-1;(0,_lodash.forEach)(entities,function(entity,index){if(entity.type==='base'){(0,_lodash.forEach)(entity.players,function(playerId){if(playerId===id){result=index}})}});return result} /**
 *
 * @param {Array} entities
 * @param {string} color
 * @returns {Object}
 */function findTeamByColor(entities,color){var result=-1;(0,_lodash.forEach)(entities,function(entity){if(entity.type==='base'){if(entity.color===color){result=entity}}});return result} /**
 *
 * @param {Object} playerProps
 * @param {Object} baseProps
 * @returns {{x: number, y: number}}
 */function calculateBaseSpawnPosition(playerProps,baseProps){return {x:_vendor.chance.integer({min:baseProps.x,max:baseProps.x+baseProps.width-playerProps.width}),y:_vendor.chance.integer({min:baseProps.y,max:baseProps.y+baseProps.height-playerProps.height})}}
//# sourceMappingURL=game.js.map