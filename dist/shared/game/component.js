"use strict";Object.defineProperty(exports,"__esModule",{value:true});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value" in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor}}();function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function")}}var Component=function(){ /**
   *
   * @param {string} key
   * @param {number} priority
   * @param {function} onUpdate
   */function Component(key,priority,onUpdate){_classCallCheck(this,Component);this._key=key;this._priority=priority;this._onUpdate=onUpdate?onUpdate.bind(this):function(){};this._entity=null;this._props={}} /**
   *
   * @param {Object} props
   * @param {function} dispatch
   */_createClass(Component,[{key:"update",value:function update(props,dispatch){this._onUpdate(props,dispatch)} /**
   *
   */},{key:"destroy",value:function destroy(){} /**
   *
   * @param {string} key
   * @returns {Component}
   */},{key:"getComponent",value:function getComponent(key){return this._entity.getComponent(key)} /**
   *
   * @param {string} key
   * @param {*} value
   */},{key:"setProp",value:function setProp(key,value){this._props[key]=value} /**
   *
   * @param {string} key
   * @returns {*}
   */},{key:"getProp",value:function getProp(key){return this._props[key]} /**
   *
   * @param {Entity} entity
   */},{key:"entity",set:function set(entity){this._entity=entity} /**
   *
   * @returns {string}
   */},{key:"key",get:function get(){return this._key} /**
   *
   * @returns {number}
   */},{key:"priority",get:function get(){return this._priority}}]);return Component}();exports.default=Component;
//# sourceMappingURL=component.js.map