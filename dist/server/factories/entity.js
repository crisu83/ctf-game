'use strict';Object.defineProperty(exports,'__esModule',{value:true});exports.createEntity=createEntity;var _vendor=require('../helpers/vendor');var _entity=require('../../shared/game/entity');var _entity2=_interopRequireDefault(_entity);var _health=require('../game/components/health');var _health2=_interopRequireDefault(_health);var _game=require('../actions/game');function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}} /**
 *
 * @param {Session} session
 * @param {Object} props
 * @returns {Entity}
 */ /*eslint no-shadow: 0*/ /*eslint no-unused-vars: 0*/function createPlayer(session,props){var entity=new _entity2.default(props);var onHealthUpdate=function onHealthUpdate(props,dispatch){if(!props.isDead&&props.currentHealth<=0){dispatch((0,_game.killEntity)(props.id,props.lastAttackerId)); // Automatically revive the entity in a while
setTimeout(function(){dispatch((0,_game.reviveEntity)(props.id))},props.reviveDuration)}};entity.addComponent(new _health2.default(onHealthUpdate));return entity} /**
 *
 * @param {Session} session
 * @param {Object} props
 * @returns {Entity}
 */function createFlag(session,props){var entity=new _entity2.default(props);return entity} /**
 *
 * @param {Session} session
 * @param {Object} props
 * @returns {Entity}
 */function createBase(session,props){var entity=new _entity2.default(props);return entity} /**
 *
 * @param {Session} session
 * @param {Object} props
 * @returns {Entity}
 */function createEntity(session,props){switch(props.type){case 'player':return createPlayer(session,props);case 'flag':return createFlag(session,props);case 'base':return createBase(session,props);default:_vendor.logger.warn('trying to create entity of unknown type '+props.type+'.');return null;}}
//# sourceMappingURL=entity.js.map