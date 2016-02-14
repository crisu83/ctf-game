import { Map, fromJS } from 'immutable';
import { forEach } from 'lodash';
import { SET_STATE, MOVE_LEFT, MOVE_RIGHT, MOVE_UP, MOVE_DOWN } from '../actions/game';
import { findEntityIndexById } from '../helpers/game';

const initialState = Map();

/**
 *
 * @param {Map} state
 * @param {Object} newState
 * @returns {Map}
 */
export function setState(state, newState) {
  // Server is always correct so we do NOT want to merge the states.
  return fromJS(newState);
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

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_STATE:
      return setState(state, action.newState);

    case MOVE_LEFT:
      return moveLeft(state, action.id, action.step);

    case MOVE_RIGHT:
      return moveRight(state, action.id, action.step);

    case MOVE_UP:
      return moveUp(state, action.id, action.step);

    case MOVE_DOWN:
      return moveDown(state, action.id, action.step);

    default:
      return state;
  }
};

export default reducer;
