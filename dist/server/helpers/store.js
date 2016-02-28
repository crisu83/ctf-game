'use strict';Object.defineProperty(exports,'__esModule',{value:true});exports.buildStore=buildStore;var _redux=require('redux');var _entity=require('../reducers/entity');var _time=require('../reducers/time'); /**
 *
 * @returns {*}
 */function buildStore(){var rootReducer=(0,_redux.combineReducers)({entities:_entity.entityReducer,time:_time.timeReducer});return (0,_redux.createStore)(rootReducer)}
//# sourceMappingURL=store.js.map