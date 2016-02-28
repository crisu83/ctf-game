'use strict';Object.defineProperty(exports,'__esModule',{value:true});exports.findWeakestTeamId=findWeakestTeamId;exports.findTeamIndexByPlayerId=findTeamIndexByPlayerId;exports.calculateBaseSpawnPosition=calculateBaseSpawnPosition;var _vendor=require('./vendor');var _constants=require('../../shared/constants'); /**
 *
 * @param {Array} entities
 * @returns {string}
 */function findWeakestTeamId(entities){var leastPlayers=-1,result=-1;for(var i=0;i<entities.length;i++){if(entities[i].type===_constants.EntityTypes.TEAM){var teamSize=entities[i].players?entities[i].players.length:0;if(leastPlayers<0||teamSize<leastPlayers){leastPlayers=teamSize;result=entities[i].id}}}return result} /**
 *
 * @param {Array} entities
 * @param {string} id
 * @returns {number}
 */function findTeamIndexByPlayerId(entities,id){var result=-1;for(var i=0;i<entities.length;i++){if(entities[i].type===_constants.EntityTypes.TEAM&&entities[i].players){for(var j=0;j<entities[i].players.length;j++){if(entities[i].players[j]===id){result=i}}}}return result} /**
 *
 * @param {Object} playerProps
 * @param {Object} baseProps
 * @returns {{x: number, y: number}}
 */function calculateBaseSpawnPosition(playerProps,baseProps){return {x:_vendor.chance.integer({min:baseProps.x,max:baseProps.x+baseProps.width-playerProps.width}),y:_vendor.chance.integer({min:baseProps.y,max:baseProps.y+baseProps.height-playerProps.height})}}
//# sourceMappingURL=game.js.map