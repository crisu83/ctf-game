/*eslint no-shadow: 0*/
/*eslint no-unused-vars: 0*/

import { logger } from '../helpers/vendor';
import Entity from 'shared/game/entity';
import Health from '../game/components/health';
import {
  killEntity,
  reviveEntity
} from '../actions/game';

/**
 *
 * @param {Session} session
 * @param {Object} props
 * @returns {Entity}
 */
function createPlayer(session, props) {
  const entity = new Entity(props);

  const onHealthUpdate = function(props, dispatch) {
    if (!props.isDead && props.health <= 0) {
      dispatch(killEntity(props.id));

      // Automatically revive the entity in a while
      setTimeout(() => {
        dispatch(reviveEntity(props.id));
      }, props.reviveDuration);
    }
  };

  entity.addComponent(new Health(onHealthUpdate));

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
function createBase(session, props) {
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

    case 'base':
      return createBase(session, props);

    default:
      logger.warn(`trying to create entity of unknown type ${props.type}.`);
      return null;
  }
}
