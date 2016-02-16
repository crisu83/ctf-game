import { Map, List } from 'immutable';
import { isNumber } from 'lodash';
import { ADD_ENTITY, REMOVE_ENTITY, SET_POSITION, SET_VELOCITY, SET_ANIMATION, ADVANCE_TIME } from '../actions/game';
import { findEntityIndexById } from '../helpers/game';

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

    case ADVANCE_TIME:
      return advanceTime(state, action.elapsed);

    default:
      return state;
  }
};

export default reducer;
