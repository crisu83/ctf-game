import shortid from 'shortid';
import { chance } from '../helpers/vendor';

// TODO: Move as much of this as possible to an entities.json file.

const teams = [
  { color: 'blue', hexColor: '#46bce3' },
  { color: 'green', hexColor: '#86d93d' },
  { color: 'orange', hexColor: '#fda551' },
  { color: 'purple', hexColor: '#9c44b5' }
];

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
  // TODO: Move this logic somewhere else.
  const teamProps = teams.splice(0, 1)[0];

  return {
    ...props,
    ...teamProps,
    id: shortid.generate()
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
