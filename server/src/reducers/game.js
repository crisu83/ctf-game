import { Map, List } from 'immutable';
import { isNumber } from 'lodash';
import { findEntityIndexById } from '../helpers/game';
import {
  ADD_ENTITY,
  REMOVE_ENTITY,
  SET_POSITION,
  SET_VELOCITY,
  SET_ANIMATION,
  SET_FACING,
  PERFORM_ATTACK,
  RESET_ATTACK,
  DAMAGE_ENTITY,
  KILL_ENTITY,
  REVIVE_ENTITY,
  CAPTURE_FLAG,
  ADVANCE_TIME
} from '../actions/game';

const initialState = Map({
  entities: List(),
  time: Map({elapsed: 0})
});

/**
 *
 * @param {Map} state
 * @param {Object} entity
 * @returns {Map}
 */
export function addEntity(state, entity) {
  return state.update('entities', entities => entities.push(Map(entity)));
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
  return state.setIn(['entities', entityIndex, 'x'], x).setIn(['entities', entityIndex, 'y'], y);
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
  return state.setIn(['entities', entityIndex, 'vx'], vx).setIn(['entities', entityIndex, 'vy'], vy);
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
  const damage = state.getIn(['entities', attackerIndex, 'damage']);
  return state.updateIn(['entities', victimIndex, 'health'], health => health - damage);
}

/**
 *
 * @param {Map} state
 * @param {string} id
 * @returns {Map}
 */
export function killEntity(state, id) {
  const nextState = setIsAlive(state, id, false);
  const entityIndex = findEntityIndexById(state.get('entities').toJS(), id);
  return nextState.setIn(['entities', entityIndex, 'health'], 0);
}

/**
 *
 * @param {Map} state
 * @param {string} id
 * @returns {Map}
 */
export function reviveEntity(state, id) {
  const nextState = setIsAlive(state, id, true);
  const entityIndex = findEntityIndexById(state.get('entities').toJS(), id);
  return nextState.setIn(['entities', entityIndex, 'health'], nextState.getIn(['entities', entityIndex, 'maxHealth']));
}

/**
 *
 * @param {Map} state
 * @param {string} id
 * @param {boolean} value
 * @returns {Map}
 */
export function setIsAlive(state, id, value) {
  const entityIndex = findEntityIndexById(state.get('entities').toJS(), id);
  return state.setIn(['entities', entityIndex, 'isAlive'], value);
}

/**
 *
 * @param {Map} state
 * @param {string} flagId
 * @param {string} playerId
 * @returns {Map}
 */
export function captureFlag(state, flagId, playerId) {
  const playerIndex = findEntityIndexById(state.get('entities').toJS(), playerId);
  const flagIndex = findEntityIndexById(state.get('entities').toJS(), flagId);
  return state.setIn(['entities', flagIndex, 'color'], state.getIn(['entities', playerIndex, 'color']));
}

/**
 *
 * @param {Map} state
 * @param {number} time
 * @returns {Map}
 */
export function advanceTime(state, time) {
  return state.updateIn(['time', 'elapsed'], elapsed => isNumber(time) ? elapsed + time : elapsed);
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

    case SET_POSITION:
      return setPosition(state, action.id, action.x, action.y);

    case SET_VELOCITY:
      return setVelocity(state, action.id, action.vx, action.vy);

    case SET_ANIMATION:
      return setAnimation(state, action.id, action.animation);

    case SET_FACING:
      return setFacing(state, action.id, action.facing);

    case PERFORM_ATTACK:
      return setIsAttacking(state, action.id, true);

    case RESET_ATTACK:
      return setIsAttacking(state, action.id, false);

    case DAMAGE_ENTITY:
      return damageEntity(state, action.id, action.victimId);

    case KILL_ENTITY:
      return killEntity(state, action.id);

    case REVIVE_ENTITY:
      return reviveEntity(state, action.id);

    case CAPTURE_FLAG:
      return captureFlag(state, action.flagId, action.playerId);

    case ADVANCE_TIME:
      return advanceTime(state, action.elapsed);

    default:
      return state;
  }
};

export default reducer;
