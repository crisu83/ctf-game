import { forEach, isUndefined } from 'lodash';
import { chance } from './vendor';

/**
 *
 * @param {Array} entities
 * @param {string} id
 * @returns {Object}
 */
export function findEntityById(entities, id) {
  let result = null;

  forEach(entities, (entity) => {
    if (entity.id === id) {
      result = entity;
    }
  });

  return result;
}

/**
 *
 * @param {Array} entities
 * @param {string} id
 * @returns {number}
 */
export function findEntityIndexById(entities, id) {
  let result = -1;

  forEach(entities, (entity, index) => {
    if (entity.id === id) {
      result = index;
    }
  });

  return result;
}

/**
 *
 * @param {Array} entities
 * @returns {number}
 */
export function findWeakestTeamIndex(entities) {
  let leastPlayers, result = -1;

  forEach(entities, (entity, index) => {
    if (entity.type === 'base') {
      if (isUndefined(leastPlayers) || entity.players.length < leastPlayers) {
        leastPlayers = entity.players.length;
        result = index;
      }
    }
  });

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

  forEach(entities, (entity, index) => {
    if (entity.type === 'base') {
      forEach(entity.players, playerId => {
        if (playerId === id) {
          result = index;
        }
      });
    }
  });

  return result;
}

/**
 *
 * @param {Array} entities
 * @param {string} color
 * @returns {Object}
 */
export function findTeamByColor(entities, color) {
  let result = -1;

  forEach(entities, entity => {
    if (entity.type === 'base') {
      if (entity.color === color) {
        result = entity;
      }
    }
  });

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
