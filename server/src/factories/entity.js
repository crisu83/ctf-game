import { Box, Body } from 'p2';
import { logger } from '../helpers';
import Entity from '../game/entity';

/**
 *
 * @param {World} world
 * @param {Object} props
 * @returns {Entity}
 */
function createPlayer(world, props) {
  const entity = new Entity(props);

  return entity;
}

/**
 *
 * @param {World} world
 * @param {Object} props
 * @returns {Entity}
 */
function createFlag(world, props) {
  const entity = new Entity(props);

  return entity;
}

/**
 *
 * @param {World} world
 * @param {Object} props
 * @returns {Entity}
 */
export function createEntity(world, props) {
  switch (props.type) {
    case 'player':
      return createPlayer(world, props);

    case 'flag':
      return createFlag(world, props);

    default:
      logger.warn(`trying to create entity of unknown type ${props.type}.`);
      return null;
  }
}
