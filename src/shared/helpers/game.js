/**
 *
 * @param {Array} entities
 * @param {string} id
 * @returns {number}
 */
export function findEntityIndexById(entities, id) {
  let result = -1;

  for (let i = 0; i < entities.length; i++) {
    if (entities[i].id === id) {
      result = i;
    }
  }

  return result;
}
