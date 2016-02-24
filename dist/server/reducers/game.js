'use strict';Object.defineProperty(exports,'__esModule',{value:true});exports.addEntity=addEntity;exports.removeEntity=removeEntity;exports.joinTeam=joinTeam;exports.leaveTeam=leaveTeam;exports.setPosition=setPosition;exports.setVelocity=setVelocity;exports.setAnimation=setAnimation;exports.setFacing=setFacing;exports.setIsAttacking=setIsAttacking;exports.damageEntity=damageEntity;exports.killEntity=killEntity;exports.beginRevive=beginRevive;exports.setIsDead=setIsDead;exports.setIsReviving=setIsReviving;exports.givePoints=givePoints;exports.tagFlag=tagFlag;exports.advanceTime=advanceTime;var _immutable=require('immutable');var _lodash=require('lodash');var _game=require('../helpers/game');var _game2=require('../actions/game');var initialState=(0,_immutable.Map)({entities:(0,_immutable.List)(),time:(0,_immutable.Map)({elapsed:0})}); /**
 *
 * @param {Map} state
 * @param {Object} entity
 * @returns {Map}
 */function addEntity(state,entity){return state.update('entities',function(entities){return entities.push((0,_immutable.fromJS)(entity))})} /**
 *
 * @param {Map} state
 * @param {string} id
 * @returns {Map}
 */function removeEntity(state,id){return state.update('entities',function(entities){return entities.filter(function(entity){return entity.get('id')!==id})})} // TODO: Write tests for assigning and leaving teams.
/**
 *
 * @param {Map} state
 * @param {string} id
 * @param {string} teamId
 * @returns {Map}
 */function joinTeam(state,id,teamId){var playerIndex=(0,_game.findEntityIndexById)(state.get('entities').toJS(),id);var teamIndex=(0,_game.findEntityIndexById)(state.get('entities').toJS(),teamId);var playerProps=state.getIn(['entities',playerIndex]).toJS();var teamProps=state.getIn(['entities',teamIndex]).toJS();var _calculateBaseSpawnPo=(0,_game.calculateBaseSpawnPosition)(playerProps,teamProps.base);var x=_calculateBaseSpawnPo.x;var y=_calculateBaseSpawnPo.y;return setPosition(state,id,x,y).updateIn(['entities',teamIndex,'players'],(0,_immutable.List)(),function(players){return players.push(id)}).setIn(['entities',playerIndex,'team'],teamProps.id).setIn(['entities',playerIndex,'color'],teamProps.color).setIn(['entities',playerIndex,'hexColor'],teamProps.hexColor)} /**
 *
 * @param {Map} state
 * @param {string} id
 * @returns {Map}
 */function leaveTeam(state,id){var teamIndex=(0,_game.findTeamIndexByPlayerId)(state.get('entities').toJS(),id);return state.updateIn(['entities',teamIndex,'players'],function(players){return players.filter(function(playerId){return playerId!==id})})} /**
 *
 * @param {Map} state
 * @param {string} id
 * @param {number} x
 * @param {number} y
 * @returns {Map}
 */function setPosition(state,id,x,y){var entityIndex=(0,_game.findEntityIndexById)(state.get('entities').toJS(),id);return state.setIn(['entities',entityIndex,'x'],x).setIn(['entities',entityIndex,'y'],y)} /**
 *
 * @param {Map} state
 * @param {string} id
 * @param {number} vx
 * @param {number} vy
 * @returns {Map}
 */function setVelocity(state,id,vx,vy){var entityIndex=(0,_game.findEntityIndexById)(state.get('entities').toJS(),id);return state.setIn(['entities',entityIndex,'vx'],vx).setIn(['entities',entityIndex,'vy'],vy)} /**
 *
 * @param {Map} state
 * @param {string} id
 * @param {string} animation
 * @returns {Map}
 */function setAnimation(state,id,animation){var entityIndex=(0,_game.findEntityIndexById)(state.get('entities').toJS(),id);return state.setIn(['entities',entityIndex,'animation'],animation)} /**
 *
 * @param {Map} state
 * @param {string} id
 * @param {string} facing
 * @returns {Map}
 */function setFacing(state,id,facing){var entityIndex=(0,_game.findEntityIndexById)(state.get('entities').toJS(),id);return state.setIn(['entities',entityIndex,'facing'],facing)} /**
 *
 * @param {Map} state
 * @param {string} id
 * @param {boolean} value
 * @returns {Map}
 */function setIsAttacking(state,id,value){var entityIndex=(0,_game.findEntityIndexById)(state.get('entities').toJS(),id);return state.setIn(['entities',entityIndex,'isAttacking'],value)} /**
 *
 * @param {Map} state
 * @param {string} id
 * @param {string} victimId
 * @returns {Map}
 */function damageEntity(state,id,victimId){var attackerIndex=(0,_game.findEntityIndexById)(state.get('entities').toJS(),id);var victimIndex=(0,_game.findEntityIndexById)(state.get('entities').toJS(),victimId);var attackerColor=state.getIn(['entities',attackerIndex,'color']);var victimColor=state.getIn(['entities',victimIndex,'color']);if(attackerColor===victimColor){return state}var damage=state.getIn(['entities',attackerIndex,'damage']);var health=state.getIn(['entities',victimIndex,'health']);return state.updateIn(['entities',victimIndex,'currentHealth'],health,function(value){return value-damage}).setIn(['entities',victimIndex,'lastAttackerId'],id)} /**
 *
 * @param {Map} state
 * @param {string} id
 * @param {string} lastAttackerId
 * @returns {Map}
 */function killEntity(state,id,lastAttackerId){var entityIndex=(0,_game.findEntityIndexById)(state.get('entities').toJS(),id);var attackerIndex=(0,_game.findEntityIndexById)(state.get('entities').toJS(),lastAttackerId);return setIsDead(state,id,true).setIn(['entities',entityIndex,'currentHealth'],0).updateIn(['entities',attackerIndex,'numKills'],0,function(value){return value+1}).updateIn(['entities',entityIndex,'numDeaths'],0,function(value){return value+1})} /**
 *
 * @param {Map} state
 * @param {string} id
 * @returns {Map}
 */function beginRevive(state,id){var playerIndex=(0,_game.findEntityIndexById)(state.get('entities').toJS(),id);var playerProps=(0,_game.findEntityById)(state.get('entities').toJS(),id);if(playerProps.team){var teamIndex=(0,_game.findEntityIndexById)(state.get('entities').toJS(),playerProps.team);var teamProps=state.getIn(['entities',teamIndex]).toJS();var _calculateBaseSpawnPo2=(0,_game.calculateBaseSpawnPosition)(playerProps,teamProps.base);var x=_calculateBaseSpawnPo2.x;var y=_calculateBaseSpawnPo2.y;state=setPosition(state,id,x,y)}var health=state.getIn(['entities',playerIndex,'health']);return setIsDead(setIsReviving(state,id,true),id,false).setIn(['entities',playerIndex,'currentHealth'],health).removeIn(['entities',playerIndex,'lastAttackerId'])} /**
 *
 * @param {Map} state
 * @param {string} id
 * @param {boolean} value
 * @returns {Map}
 */function setIsDead(state,id,value){var entityIndex=(0,_game.findEntityIndexById)(state.get('entities').toJS(),id);return state.setIn(['entities',entityIndex,'isDead'],value)} /**
 *
 * @param {Map} state
 * @param {string} id
 * @param {boolean} value
 * @returns {Map}
 */function setIsReviving(state,id,value){var entityIndex=(0,_game.findEntityIndexById)(state.get('entities').toJS(),id);return state.setIn(['entities',entityIndex,'isReviving'],value)} /**
 *
 * @param {Map} state
 * @param {string} id
 * @param {number} points
 * @returns {Map}
 */function givePoints(state,id,points){var entityIndex=(0,_game.findEntityIndexById)(state.get('entities').toJS(),id);return state.updateIn(['entities',entityIndex,'points'],0,function(value){return value+points})} /**
 *
 * @param {Map} state
 * @param {string} flagId
 * @param {string} playerId
 * @returns {Map}
 */function tagFlag(state,flagId,playerId){var playerIndex=(0,_game.findEntityIndexById)(state.get('entities').toJS(),playerId);var flagIndex=(0,_game.findEntityIndexById)(state.get('entities').toJS(),flagId);var oldTeamId=state.getIn(['entities',flagIndex,'team']);var newTeamId=state.getIn(['entities',playerIndex,'team']);var oldTeamIndex=(0,_game.findEntityIndexById)(state.get('entities').toJS(),oldTeamId);var newTeamIndex=(0,_game.findEntityIndexById)(state.get('entities').toJS(),newTeamId);var playerColor=state.getIn(['entities',playerIndex,'color']);var flagColor=state.getIn(['entities',flagIndex,'color']);if(playerColor===flagColor){return state}return state.setIn(['entities',flagIndex,'color'],playerColor).setIn(['entities',flagIndex,'team'],newTeamId).updateIn(['entities',oldTeamIndex,'numFlags'],function(value){return value-1}).updateIn(['entities',newTeamIndex,'numFlags'],function(value){return (value||0)+1})} /**
 *
 * @param {Map} state
 * @param {number} time
 * @returns {Map}
 */function advanceTime(state,time){return state.updateIn(['time','elapsed'],0,function(elapsed){return (0,_lodash.isNumber)(time)?elapsed+time:elapsed})} /**
 *
 * @param {Map} state
 * @param {Object} action
 * @returns {Map}
 */var reducer=function reducer(){var state=arguments.length<=0||arguments[0]===undefined?initialState:arguments[0];var action=arguments[1];switch(action.type){case _game2.ADD_ENTITY:return addEntity(state,action.entity);case _game2.REMOVE_ENTITY:return removeEntity(state,action.id);case _game2.JOIN_TEAM:return joinTeam(state,action.id,action.teamId);case _game2.LEAVE_TEAM:return leaveTeam(state,action.id);case _game2.SET_POSITION:return setPosition(state,action.id,action.x,action.y);case _game2.SET_VELOCITY:return setVelocity(state,action.id,action.vx,action.vy);case _game2.SET_ANIMATION:return setAnimation(state,action.id,action.animation);case _game2.SET_FACING:return setFacing(state,action.id,action.facing);case _game2.BEGIN_ATTACK:return setIsAttacking(state,action.id,true);case _game2.END_ATTACK:return setIsAttacking(state,action.id,false);case _game2.DAMAGE_ENTITY:return damageEntity(state,action.id,action.victimId);case _game2.KILL_ENTITY:return killEntity(state,action.id,action.lastAttackerId);case _game2.BEGIN_REVIVE:return beginRevive(state,action.id);case _game2.END_REVIVE:return setIsReviving(state,action.id,false);case _game2.GIVE_POINTS:return givePoints(state,action.id,action.points);case _game2.TAG_FLAG:return tagFlag(state,action.flagId,action.playerId);case _game2.ADVANCE_TIME:return advanceTime(state,action.elapsed);default:return state;}};exports.default=reducer;
//# sourceMappingURL=game.js.map