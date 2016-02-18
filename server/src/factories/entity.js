import { Box, Body } from 'p2';
import { logger } from '../helpers';
import Entity from '../game/entity';
import Attack from '../game/components/attack';
import Health from '../game/components/health';
import { killEntity, reviveEntity, stopAttacking } from '../actions/game';

/**
 *
 * @param {Session} session
 * @param {Object} props
 * @returns {Entity}
 */
function createPlayer(session, props) {
  const entity = new Entity(props);

  const onHealthUpdate = function(props, dispatch) {
    if (props.isAlive && props.health <= 0) {
      console.log('entity died', props.id);
      dispatch(killEntity(props.id));

      // Automatically revive in 10 seconds
      setTimeout(() => {
        console.log('entity revived', props.id);
        dispatch(reviveEntity(props.id));
      }, 10000);
    }
  };

  entity.addComponent(new Health(onHealthUpdate));

  const onAttackUpdate = function(props, dispatch) {
    if (props.isAttacking) {
      dispatch(stopAttacking(props.id));
    }
  };

  entity.addComponent(new Attack(onAttackUpdate));

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
