"use strict";Object.defineProperty(exports,"__esModule",{value:true});exports.createReducer=createReducer; /**
 *
 * @param {*} initialState
 * @param {Object} handlers
 * @returns {function}
 * @see http://redux.js.org/docs/recipes/ReducingBoilerplate.html
 */function createReducer(initialState,handlers){return function reducer(){var state=arguments.length<=0||arguments[0]===undefined?initialState:arguments[0];var action=arguments[1];if(handlers.hasOwnProperty(action.type)){return handlers[action.type](state,action)}else {return state}}}
//# sourceMappingURL=store.js.map