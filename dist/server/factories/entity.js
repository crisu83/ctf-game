'use strict';Object.defineProperty(exports,'__esModule',{value:true});exports.FLAG=exports.TEAM=exports.PLAYER=undefined;exports.createEntity=createEntity;var _lodash=require('lodash');var _vendor=require('../helpers/vendor');var _entity=require('../../shared/game/entity');var _entity2=_interopRequireDefault(_entity);var _health=require('../game/components/health');var _health2=_interopRequireDefault(_health);var _points=require('../game/components/points');var _points2=_interopRequireDefault(_points);var _constants=require('../constants');var _game=require('../actions/game');function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}var PLAYER=exports.PLAYER='player'; /*eslint no-shadow: 0*/ /*eslint no-unused-vars: 0*/var TEAM=exports.TEAM='team';var FLAG=exports.FLAG='flag'; /**
 *
 * @param {Session} session
 * @param {Object} props
 * @returns {Entity}
 */function createPlayer(session,props){var entity=new _entity2.default(props);var onHealthComponentUpdate=function onHealthComponentUpdate(props,dispatch){if(!props.isDead&&props.currentHealth<=0){dispatch((0,_game.killEntity)(props.id,props.lastAttackerId)); // Automatically revive the entity in a while
setTimeout(function(){dispatch((0,_game.beginRevive)(props.id));setTimeout(function(){dispatch((0,_game.endRevive)(props.id))},100)},props.reviveDuration)}};entity.addComponent(new _health2.default(onHealthComponentUpdate));return entity} /**
 *
 * @param {Session} session
 * @param {Object} props
 * @returns {Entity}
 */function createFlag(session,props){var entity=new _entity2.default(props);return entity} /**
 *
 * @param {Session} session
 * @param {Object} props
 * @returns {Entity}
 */function createTeam(session,props){var entity=new _entity2.default(props);var onPointsComponentUpdate=function onPointsComponentUpdate(updateProps,dispatch){var _this=this;if(updateProps.players&&updateProps.numFlags&&this.shouldGivePoints()){(function(){var points=updateProps.numFlags*_constants.POINTS_PER_FLAG;(0,_lodash.forEach)(updateProps.players,function(playerId){dispatch((0,_game.givePoints)(playerId,points))});_this.pointsGiven()})()}};entity.addComponent(new _points2.default(onPointsComponentUpdate));return entity} /**
 *
 * @param {Session} session
 * @param {Object} props
 * @returns {Entity}
 */function createEntity(session,props){switch(props.type){case PLAYER:return createPlayer(session,props);case FLAG:return createFlag(session,props);case TEAM:return createTeam(session,props);default:_vendor.logger.warn('trying to create entity of unknown type '+props.type+'.');return null;}}
//# sourceMappingURL=entity.js.map