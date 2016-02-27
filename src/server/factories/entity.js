/*eslint no-shadow: 0*/
/*eslint no-unused-vars: 0*/

import { forEach } from 'lodash';
import { logger } from '../helpers/vendor';
import Entity from 'shared/game/entity';
import HealthComponent from '../game/components/health';
import PointsComponent from '../game/components/points';
import { POINTS_PER_FLAG } from '../constants';
import {
  killEntity,
  beginRevive,
  endRevive,
  givePoints
} from '../actions/game';
import { EntityTypes } from 'shared/constants';

/**
 *
 * @param {Session} session
 * @param {Object} props
 * @returns {Entity}
 */
function createPlayer(session, props) {
  const entity = new Entity(props);

  const onHealthComponentUpdate = function(props, dispatch) {
    if (!props.isDead && props.currentHealth <= 0) {
      dispatch(killEntity(props.id, props.lastAttackerId));

      // Automatically revive the entity in a while
      setTimeout(() => {
        dispatch(beginRevive(props.id));

        setTimeout(() => {
          dispatch(endRevive(props.id));
        }, 500);
      }, props.reviveDuration);
    }
  };

  entity.addComponent(new HealthComponent(onHealthComponentUpdate));

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

  const onPointsComponentUpdate = function(updateProps, dispatch) {
    if (updateProps.players && updateProps.numFlags && this.shouldGivePoints()) {
      const points = updateProps.numFlags * POINTS_PER_FLAG;

      forEach(updateProps.players, playerId => {
        dispatch(givePoints(playerId, points));
      });
      
      this.pointsGiven();
    }
  };

  entity.addComponent(new PointsComponent(onPointsComponentUpdate));

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
    case EntityTypes.PLAYER:
      return createPlayer(session, props);

    case EntityTypes.FLAG:
      return createFlag(session, props);

    case EntityTypes.TEAM:
      return createTeam(session, props);

    default:
      logger.warn(`trying to create entity of unknown type ${props.type}.`);
      return null;
  }
}
