import shortid from 'shortid';
import { chance } from '../helpers/vendor';

const colors = ['blue', 'green', 'orange', 'purple'];

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
    damage: 100,
    runSpeed: 500,
    attackCooldown: 500,
    attackRange: 20,
    reviveDuration: 5000
  };
}

/**
 *
 * @param {Object} props
 * @returns {Object}
 */
function createBase(props) {
  return {
    ...props,
    color: colors.splice(0, 1)[0],
    players: []
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

    case 'base':
      return createBase(props);

    default:
      return null;
  }
}
