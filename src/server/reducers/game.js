import { Map, List, fromJS } from 'immutable';
import { isNumber } from 'lodash';
import {
  findEntityIndexById,
  findTeamIndexByPlayerId,
  calculateBaseSpawnPosition
} from '../helpers/game';
import {
  ADD_ENTITY,
  REMOVE_ENTITY,
  JOIN_TEAM,
  LEAVE_TEAM,
  SET_POSITION,
  SET_VELOCITY,
  SET_ANIMATION,
  SET_FACING,
  BEGIN_ATTACK,
  END_ATTACK,
  DAMAGE_ENTITY,
  KILL_ENTITY,
  BEGIN_REVIVE,
  END_REVIVE,
  GIVE_POINTS,
  TAG_FLAG,
  ADVANCE_TIME
} from '../actions/game';

const initialState = Map({
  entities: List(),
  time: Map({ elapsed: 0 })
});

/**
 *
 * @param {Map} state
 * @param {Object} entity
 * @returns {Map}
 */
export function addEntity(state, entity) {
  return state.update('entities', entities => entities.push(fromJS(entity)));
}

/**
 *
 * @param {Map} state
 * @param {string} id
 * @returns {Map}
 */
export function removeEntity(state, id) {
  return state.update('entities', entities => entities.filter(entity => entity.get('id') !== id));
}

// TODO: Write tests for assigning and leaving teams.

/**
 *
 * @param {Map} state
 * @param {string} id
 * @param {string} teamId
 * @returns {Map}
 */
export function joinTeam(state, id, teamId) {
  const playerIndex = findEntityIndexById(state.get('entities').toJS(), id);
  const teamIndex = findEntityIndexById(state.get('entities').toJS(), teamId);
  const playerProps = state.getIn(['entities', playerIndex]).toJS();
  const teamProps = state.getIn(['entities', teamIndex]).toJS();
  const { x, y } = calculateBaseSpawnPosition(playerProps, teamProps.base);
  return setPosition(state, id, x, y)
    .updateIn(['entities', teamIndex, 'players'], List(), players => players.push(id))
    .setIn(['entities', playerIndex, 'team'], teamProps.id)
    .setIn(['entities', playerIndex, 'color'], teamProps.color)
    .setIn(['entities', playerIndex, 'hexColor'], teamProps.hexColor);
}

/**
 *
 * @param {Map} state
 * @param {string} id
 * @returns {Map}
 */
export function leaveTeam(state, id) {
  const teamIndex = findTeamIndexByPlayerId(state.get('entities').toJS(), id);
  return state.updateIn(['entities', teamIndex, 'players'], players => players.filter(playerId => playerId !== id));
}

/**
 *
 * @param {Map} state
 * @param {string} id
 * @param {number} x
 * @param {number} y
 * @returns {Map}
 */
export function setPosition(state, id, x, y) {
  const entityIndex = findEntityIndexById(state.get('entities').toJS(), id);
  return state.setIn(['entities', entityIndex, 'x'], x)
    .setIn(['entities', entityIndex, 'y'], y);
}

/**
 *
 * @param {Map} state
 * @param {string} id
 * @param {number} vx
 * @param {number} vy
 * @returns {Map}
 */
export function setVelocity(state, id, vx, vy) {
  const entityIndex = findEntityIndexById(state.get('entities').toJS(), id);
  return state.setIn(['entities', entityIndex, 'vx'], vx)
    .setIn(['entities', entityIndex, 'vy'], vy);
}
/**
 *
 * @param {Map} state
 * @param {string} id
 * @param {string} animation
 * @returns {Map}
 */
export function setAnimation(state, id, animation) {
  const entityIndex = findEntityIndexById(state.get('entities').toJS(), id);
  return state.setIn(['entities', entityIndex, 'animation'], animation);
}

/**
 *
 * @param {Map} state
 * @param {string} id
 * @param {string} facing
 * @returns {Map}
 */
export function setFacing(state, id, facing) {
  const entityIndex = findEntityIndexById(state.get('entities').toJS(), id);
  return state.setIn(['entities', entityIndex, 'facing'], facing);
}

/**
 *
 * @param {Map} state
 * @param {string} id
 * @param {boolean} value
 * @returns {Map}
 */
export function setIsAttacking(state, id, value) {
  const entityIndex = findEntityIndexById(state.get('entities').toJS(), id);
  return state.setIn(['entities', entityIndex, 'isAttacking'], value);
}

/**
 *
 * @param {Map} state
 * @param {string} id
 * @param {string} victimId
 * @returns {Map}
 */
export function damageEntity(state, id, victimId) {
  const attackerIndex = findEntityIndexById(state.get('entities').toJS(), id);
  const victimIndex = findEntityIndexById(state.get('entities').toJS(), victimId);
  const attackerColor = state.getIn(['entities', attackerIndex, 'color']);
  const victimColor = state.getIn(['entities', victimIndex, 'color']);
  if (attackerColor === victimColor) {
    return state;
  }
  const damage = state.getIn(['entities', attackerIndex, 'damage']);
  const health = state.getIn(['entities', victimIndex, 'health']);
  return state.updateIn(['entities', victimIndex, 'currentHealth'], health, value => value - damage)
    .setIn(['entities', victimIndex, 'lastAttackerId'], id);
}

/**
 *
 * @param {Map} state
 * @param {string} id
 * @param {string} lastAttackerId
 * @returns {Map}
 */
export function killEntity(state, id, lastAttackerId) {
  const entityIndex = findEntityIndexById(state.get('entities').toJS(), id);
  const attackerIndex = findEntityIndexById(state.get('entities').toJS(), lastAttackerId);
  return setIsDead(state, id, true)
    .setIn(['entities', entityIndex, 'currentHealth'], 0)
    .updateIn(['entities', attackerIndex, 'numKills'], 0, value => value + 1)
    .updateIn(['entities', entityIndex, 'numDeaths'], 0, value => value + 1);
}

/**
 *
 * @param {Map} state
 * @param {string} id
 * @returns {Map}
 */
export function beginRevive(state, id) {
  const playerIndex = findEntityIndexById(state.get('entities').toJS(), id);
  const playerProps = state.getIn(['entities', playerIndex]);
  if (playerProps.team) {
    const teamIndex = findEntityIndexById(state.get('entities').toJS(), playerProps.team);
    const teamProps = state.getIn(['entities', teamIndex]).toJS();
    const { x, y } = calculateBaseSpawnPosition(playerProps, teamProps.base);
    state = setPosition(state, id, x, y);
  }
  const health = state.getIn(['entities', playerIndex, 'health']);
  return setIsDead(setIsReviving(state, id, true), id, false)
    .setIn(['entities', playerIndex, 'currentHealth'], health)
    .removeIn(['entities', playerIndex, 'lastAttackerId']);
}

/**
 *
 * @param {Map} state
 * @param {string} id
 * @param {boolean} value
 * @returns {Map}
 */
export function setIsDead(state, id, value) {
  const entityIndex = findEntityIndexById(state.get('entities').toJS(), id);
  return state.setIn(['entities', entityIndex, 'isDead'], value);
}

/**
 *
 * @param {Map} state
 * @param {string} id
 * @param {boolean} value
 * @returns {Map}
 */
export function setIsReviving(state, id, value) {
  const entityIndex = findEntityIndexById(state.get('entities').toJS(), id);
  return state.setIn(['entities', entityIndex, 'isReviving'], value);
}

/**
 *
 * @param {Map} state
 * @param {string} id
 * @param {number} points
 * @returns {Map}
 */
export function givePoints(state, id, points) {
  const entityIndex = findEntityIndexById(state.get('entities').toJS(), id);
  return state.updateIn(['entities', entityIndex, 'points'], 0, value => value + points);
}

/**
 *
 * @param {Map} state
 * @param {string} flagId
 * @param {string} playerId
 * @returns {Map}
 */
export function tagFlag(state, flagId, playerId) {
  const playerIndex = findEntityIndexById(state.get('entities').toJS(), playerId);
  const flagIndex = findEntityIndexById(state.get('entities').toJS(), flagId);
  const oldTeamId = state.getIn(['entities', flagIndex, 'team']);
  const newTeamId = state.getIn(['entities', playerIndex, 'team']);
  const oldTeamIndex = findEntityIndexById(state.get('entities').toJS(), oldTeamId);
  const newTeamIndex = findEntityIndexById(state.get('entities').toJS(), newTeamId);
  const playerColor = state.getIn(['entities', playerIndex, 'color']);
  const flagColor = state.getIn(['entities', flagIndex, 'color']);
  if (playerColor === flagColor) {
    return state;
  }
  return state.setIn(['entities', flagIndex, 'color'], playerColor)
    .setIn(['entities', flagIndex, 'team'], newTeamId)
    .updateIn(['entities', oldTeamIndex, 'numFlags'], value => value - 1)
    .updateIn(['entities', newTeamIndex, 'numFlags'], value => (value || 0) + 1);
}

/**
 *
 * @param {Map} state
 * @param {number} time
 * @returns {Map}
 */
export function advanceTime(state, time) {
  return state.updateIn(['time', 'elapsed'], 0, elapsed => isNumber(time) ? elapsed + time : elapsed);
}

/**
 *
 * @param {Map} state
 * @param {Object} action
 * @returns {Map}
 */
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_ENTITY:
      return addEntity(state, action.entity);

    case REMOVE_ENTITY:
      return removeEntity(state, action.id);

    case JOIN_TEAM:
      return joinTeam(state, action.id, action.teamId);

    case LEAVE_TEAM:
      return leaveTeam(state, action.id);

    case SET_POSITION:
      return setPosition(state, action.id, action.x, action.y);

    case SET_VELOCITY:
      return setVelocity(state, action.id, action.vx, action.vy);

    case SET_ANIMATION:
      return setAnimation(state, action.id, action.animation);

    case SET_FACING:
      return setFacing(state, action.id, action.facing);

    case BEGIN_ATTACK:
      return setIsAttacking(state, action.id, true);

    case END_ATTACK:
      return setIsAttacking(state, action.id, false);

    case DAMAGE_ENTITY:
      return damageEntity(state, action.id, action.victimId);

    case KILL_ENTITY:
      return killEntity(state, action.id, action.lastAttackerId);

    case BEGIN_REVIVE:
      return beginRevive(state, action.id);

    case END_REVIVE:
      return setIsReviving(state, action.id, false);

    case GIVE_POINTS:
      return givePoints(state, action.id, action.points);

    case TAG_FLAG:
      return tagFlag(state, action.flagId, action.playerId);

    case ADVANCE_TIME:
      return advanceTime(state, action.elapsed);

    default:
      return state;
  }
};

export default reducer;
