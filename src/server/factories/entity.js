/*eslint no-shadow: 0*/
/*eslint no-unused-vars: 0*/

import { forEach } from 'lodash';
import { logger } from '../helpers/vendor';
import Entity from 'shared/game/entity';
import Health from '../game/components/health';
import Points from '../game/components/points';
import {
  killEntity,
  beginRevive,
  endRevive,
  givePoints
} from '../actions/game';

export const PLAYER = 'player';
export const TEAM = 'team';
export const FLAG = 'flag';

const POINTS_PER_FLAG = 50;

/**
 *
 * @param {Session} session
 * @param {Object} props
 * @returns {Entity}
 */
function createPlayer(session, props) {
  const entity = new Entity(props);

  const onHealthUpdate = function(props, dispatch) {
    if (!props.isDead && props.currentHealth <= 0) {
      dispatch(killEntity(props.id, props.lastAttackerId));

      // Automatically revive the entity in a while
      setTimeout(() => {
        dispatch(beginRevive(props.id));

        setTimeout(() => {
          dispatch(endRevive(props.id));
        }, 100);
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
function createTeam(session, props) {
  const entity = new Entity(props);

  const onPointsUpdate = function(updateProps, dispatch) {
    if (updateProps.players && updateProps.numFlags && this.shouldGivePoints()) {
      const points = updateProps.numFlags * POINTS_PER_FLAG;

      forEach(updateProps.players, playerId => {
        dispatch(givePoints(playerId, points));
      });
      
      this.pointsGiven();
    }
  };

  entity.addComponent(new Points(onPointsUpdate));

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
    case PLAYER:
      return createPlayer(session, props);

    case FLAG:
      return createFlag(session, props);

    case TEAM:
      return createTeam(session, props);

    default:
      logger.warn(`trying to create entity of unknown type ${props.type}.`);
      return null;
  }
}
