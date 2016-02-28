'use strict';Object.defineProperty(exports,'__esModule',{value:true});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if('value' in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor}}();var _lodash=require('lodash');var _entity=require('../game/entity');var _entity2=_interopRequireDefault(_entity);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError('Cannot call a class as a function')}}var EntityManager=function(){ /**
   *
   * @param {function} onEntityCreate
   */function EntityManager(onEntityCreate){_classCallCheck(this,EntityManager);this._onEntityCreate=onEntityCreate;this._entities=[]} /**
   *
   * @param {Object} entityProps
   * @param {function} dispatch
   * @returns {Array}
   */_createClass(EntityManager,[{key:'updateFromProps',value:function updateFromProps(entityProps,dispatch){var _this=this;var updatedEntityIds=[];(0,_lodash.forEach)(entityProps,function(props){var entity=_this.getEntity(props.id);if(!entity){entity=_this._onEntityCreate(props);if(entity){_this.addEntity(entity)}}if(entity){entity.update(props,dispatch);updatedEntityIds.push(props.id)}});this._entities=this._entities.filter(function(entity){var found=updatedEntityIds.indexOf(entity.id)!==-1;if(!found){entity.destroy()}return found})} /**
   *
   * @param {Entity} entity
   */},{key:'addEntity',value:function addEntity(entity){if(!entity instanceof _entity2.default){throw new Error('Entity must be an instance of Entity.')}this._entities.push(entity)} /**
   *
   * @param {string} id
   * @returns {Entity}
   */},{key:'getEntity',value:function getEntity(id){return (0,_lodash.find)(this._entities,function(entity){return entity.getProp('id')===id})} /**
   *
   * @param {function} filter
   * @return {Array}
   */},{key:'filterEntities',value:function filterEntities(filter){return this._entities.filter(filter)} /**
   *
   * @param {string} type
   * @returns {Array}
   */},{key:'filterByType',value:function filterByType(type){return this._entities.filter(function(entity){return entity.getProp('type')===type})}}]);return EntityManager}();exports.default=EntityManager;
//# sourceMappingURL=entity.js.map