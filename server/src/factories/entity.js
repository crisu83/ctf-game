import { Box, Body } from 'p2';
import { logger } from '../helpers';
import Entity from '../game/entity';

/**
 *
 * @param {Session} session
 * @param {Object} props
 * @returns {Entity}
 */
function createPlayer(session, props) {
  const entity = new Entity(props);

  return entity;
}

/**
 *
 * @param {Session} session
 * @param {Object} props
 * @returns {Entity}
 */
function createFlag(session, props) {
  const entity = new Entity(props);

  return entity;
}

/**
 *
 * @param {Session} session
 * @param {Object} props
 * @returns {Entity}
 */
export function createEntity(session, props) {
  switch (props.type) {
    case 'player':
      return createPlayer(session, props);

    case 'flag':
      return createFlag(session, props);

    default:
      logger.warn(`trying to create entity of unknown type ${props.type}.`);
      return null;
  }
}
