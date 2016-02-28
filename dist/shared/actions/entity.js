'use strict';Object.defineProperty(exports,'__esModule',{value:true});exports.setPosition=setPosition;var _constants=require('../constants'); /**
 *
 * @param {string} id
 * @param {number} x
 * @param {number} y
 * @param {string} context
 * @returns {{type: string, x: number, y: number}}
 */function setPosition(id,x,y,context){return {type:_constants.EntityActions.SET_POSITION,id:id,x:x,y:y,context:context}}
//# sourceMappingURL=entity.js.map