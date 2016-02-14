import { Map, List } from 'immutable';
import { isNumber } from 'lodash';
import { ADD_ENTITY, REMOVE_ENTITY, MOVE_LEFT, MOVE_RIGHT, MOVE_UP, MOVE_DOWN, ADVANCE_TIME } from '../actions/game';
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
 * @param {number} step
 * @returns {Map}
 */
export function moveLeft(state, id, step) {
  const entityIndex = findEntityIndexById(state.get('entities').toJS(), id);
  return state.updateIn(['entities', entityIndex, 'x'], x => x - step);
}

/**
 *
 * @param {Map} state
 * @param {string} id
 * @param {number} step
 * @returns {Map}
 */
export function moveRight(state, id, step) {
  const entityIndex = findEntityIndexById(state.get('entities').toJS(), id);
  return state.updateIn(['entities', entityIndex, 'x'], x => x + step);
}

/**
 *
 * @param {Map} state
 * @param {string} id
 * @param {number} step
 * @returns {Map}
 */
export function moveUp(state, id, step) {
  const entityIndex = findEntityIndexById(state.get('entities').toJS(), id);
  return state.updateIn(['entities', entityIndex, 'y'], y => y - step);
}

/**
 *
 * @param {Map} state
 * @param {string} id
 * @param {number} step
 * @returns {Map}
 */
export function moveDown(state, id, step) {
  const entityIndex = findEntityIndexById(state.get('entities').toJS(), id);
  return state.updateIn(['entities', entityIndex, 'y'], y => y + step);
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

    case MOVE_LEFT:
      return moveLeft(state, action.id, action.step);

    case MOVE_RIGHT:
      return moveRight(state, action.id, action.step);

    case MOVE_UP:
      return moveUp(state, action.id, action.step);

    case MOVE_DOWN:
      return moveDown(state, action.id, action.step);

    case ADVANCE_TIME:
      return advanceTime(state, action.elapsed);

    default:
      return state;
  }
};

export default reducer;
