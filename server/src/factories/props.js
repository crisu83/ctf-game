import shortid from 'shortid';
import { chance } from '../helpers';

/**
 *
 * @param {Object} props
 * @returns {Object}
 */
function createPlayer(props) {
  return {
    ...props,
    id: shortid.generate(),
    type: 'player',
    name: chance.first(),
    x: 0,
    y: 20,
    vx: 0,
    vy: 0,
    width: 96,
    height: 96,
    group: 'knights',
    maxHealth: 100,
    health: 100,
    damage: 20,
    runSpeed: 800,
    attackCooldown: 500,
    attackRange: 20,
    reviveDuration: 5000,
    isAlive: true,
    // TODO: Add logic for picking the color based on the player's team.
    color: chance.pick(['blue', 'green', 'orange', 'purple'])
  };
}

/**
 *
 * @param {Object} props
 * @returns {Object}
 */
function createFlag(props) {
  return {
    ...props,
    id: shortid.generate(),
    color: 'neutral',
    group: 'flags'
  };
}

/**
 *
 * @param {Object} props
 * @returns {Object}
 */
export function createProps(props) {
  switch (props.type) {
    case 'player':
      return createPlayer(props);

    case 'flag':
      return createFlag(props);

    default:
      return null;
  }
}
