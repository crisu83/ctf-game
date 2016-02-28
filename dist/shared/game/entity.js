'use strict';Object.defineProperty(exports,'__esModule',{value:true});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if('value' in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor}}();function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError('Cannot call a class as a function')}}var Entity=function(){ /**
   *
   * @param {Object} props
   */function Entity(props){_classCallCheck(this,Entity);this._props=props;this._components=[]} /**
   *
   * @param {Object} props
   * @param {function} dispatch
   */_createClass(Entity,[{key:'update',value:function update(props,dispatch){this._components.sort(function(a,b){return a.priority-b.priority});for(var i=0;i<this._components.length;i++){this._components[i].update(props,dispatch)}this._props=props} /**
   *
   */},{key:'destroy',value:function destroy(){for(var i=0;i<this._components.length;i++){this._components[i].destroy()}} /**
   *
   * @param {Component} component
   */},{key:'addComponent',value:function addComponent(component){component.entity=this;this._components.push(component)} /**
   *
   * @param {string} key
   * @returns {Component}
   */},{key:'getComponent',value:function getComponent(key){for(var i=0;i<this._components.length;i++){if(this._components[i].key===key){return this._components[i]}}return null} /**
   *
   * @param {string} key
   * @returns {*}
   */},{key:'getProp',value:function getProp(key){return this._props[key]} /**
   *
   * @returns {string}
   */},{key:'id',get:function get(){return this.getProp('id')} /**
   *
   * @returns {Object}
   */},{key:'props',get:function get(){return this._props} /**
   *
   * @param {Array<Component>} components
   */},{key:'components',set:function set(components){this._components=components}}]);return Entity}();exports.default=Entity;
//# sourceMappingURL=entity.js.map