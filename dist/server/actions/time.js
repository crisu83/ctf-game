'use strict';Object.defineProperty(exports,'__esModule',{value:true});exports.advanceElapsed=advanceElapsed;var _constants=require('../constants'); /**
 *
 * @param {number} elapsed
 * @returns {{type: string, elapsed: number}}
 */function advanceElapsed(elapsed){return {type:_constants.TimeActions.ADVANCE_ELAPSED,elapsed:elapsed}}
//# sourceMappingURL=time.js.map