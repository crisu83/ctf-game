'use strict';Object.defineProperty(exports,'__esModule',{value:true});var _extends=Object.assign||function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source){if(Object.prototype.hasOwnProperty.call(source,key)){target[key]=source[key]}}}return target};exports.createProps=createProps;var _shortid=require('shortid');var _shortid2=_interopRequireDefault(_shortid);var _vendor=require('../helpers/vendor');function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}} // TODO: Move as much of this as possible to an entities.json file.
var teams=[{color:'blue',hexColor:'#46bce3'},{color:'green',hexColor:'#86d93d'},{color:'orange',hexColor:'#fda551'},{color:'purple',hexColor:'#9c44b5'}]; /**
 *
 * @param {Object} props
 * @returns {Object}
 */function createPlayer(props){return _extends({},props,{id:_shortid2.default.generate(),type:'player',name:_vendor.chance.first(),x:0,y:20,vx:0,vy:0,width:96,height:96,group:'knights',health:100,damage:100,runSpeed:500,attackCooldown:500,attackRange:20,reviveDuration:5000})} /**
 *
 * @param {Object} props
 * @returns {Object}
 */function createBase(props){ // TODO: Move this logic somewhere else.
var teamProps=teams.splice(0,1)[0];return _extends({},props,teamProps,{id:_shortid2.default.generate()})} /**
 *
 * @param {Object} props
 * @returns {Object}
 */function createFlag(props){return _extends({},props,{id:_shortid2.default.generate(),color:'neutral',group:'flags'})} /**
 *
 * @param {Object} props
 * @returns {Object}
 */function createProps(props){switch(props.type){case 'player':return createPlayer(props);case 'flag':return createFlag(props);case 'base':return createBase(props);default:return null;}}
//# sourceMappingURL=props.js.map