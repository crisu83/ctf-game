'use strict';Object.defineProperty(exports,'__esModule',{value:true});exports.findWeakestTeamId=findWeakestTeamId;exports.findTeamIndexByPlayerId=findTeamIndexByPlayerId;exports.calculateTeamSpawnPosition=calculateTeamSpawnPosition;var _vendor=require('./vendor');var _constants=require('../../shared/constants'); /**
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
 * @param {Object} teamProps
 * @param {Object} playerProps
 * @returns {{x: number, y: number}}
 */function calculateTeamSpawnPosition(teamProps,playerProps){var x=0,y=0;if(teamProps.base){x=_vendor.chance.integer({min:teamProps.base.x,max:teamProps.base.x+teamProps.base.width-playerProps.width});y=_vendor.chance.integer({min:teamProps.base.y,max:teamProps.base.y+teamProps.base.height-playerProps.height})}return {x:x,y:y}}
//# sourceMappingURL=game.js.map