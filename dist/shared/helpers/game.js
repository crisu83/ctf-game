"use strict";Object.defineProperty(exports,"__esModule",{value:true});exports.findEntityIndexById=findEntityIndexById; /**
 *
 * @param {Array} entities
 * @param {string} id
 * @returns {number}
 */function findEntityIndexById(entities,id){var result=-1;for(var i=0;i<entities.length;i++){if(entities[i].id&&entities[i].id===id){result=i}}return result}
//# sourceMappingURL=game.js.map