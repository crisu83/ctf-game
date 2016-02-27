import { chance } from './vendor';
import { EntityTypes } from 'shared/constants';

/**
 *
 * @param {Array} entities
 * @returns {string}
 */
export function findWeakestTeamId(entities) {
  let leastPlayers = -1, result = -1;

  for (let i = 0; i < entities.length; i++) {
    if (entities[i].type === EntityTypes.TEAM) {
      let teamSize = entities[i].players ? entities[i].players.length : 0;
      if (leastPlayers < 0 || teamSize < leastPlayers) {
        leastPlayers = teamSize;
        result = entities[i].id;
      }
    }
  }

  return result;
}

/**
 *
 * @param {Array} entities
 * @param {string} id
 * @returns {number}
 */
export function findTeamIndexByPlayerId(entities, id) {
  let result = -1;

  for (let i = 0; i < entities.length; i++) {
    if (entities[i].type === EntityTypes.TEAM && entities[i].players) {
      for (let j = 0; j < entities[i].players.length; j++) {
        if (entities[i].players[j] === id) {
          result = i;
        }
      }
    }
  }

  return result;
}

/**
 *
 * @param {Object} playerProps
 * @param {Object} baseProps
 * @returns {{x: number, y: number}}
 */
export function calculateBaseSpawnPosition(playerProps, baseProps) {
  return {
    x: chance.integer({ min: baseProps.x, max: (baseProps.x + baseProps.width) - playerProps.width }),
    y: chance.integer({ min: baseProps.y, max: (baseProps.y + baseProps.height) - playerProps.height })
  };
}
