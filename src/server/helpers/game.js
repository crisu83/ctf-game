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
 * @param {Object} teamProps
 * @param {Object} playerProps
 * @returns {{x: number, y: number}}
 */
export function calculateTeamSpawnPosition(teamProps, playerProps) {
  let x = 0, y = 0;

  if (teamProps.base) {
    x = chance.integer({ min: teamProps.base.x, max: (teamProps.base.x + teamProps.base.width) - playerProps.width });
    y = chance.integer({ min: teamProps.base.y, max: (teamProps.base.y + teamProps.base.height) - playerProps.height });
  }

  return { x, y };
}
