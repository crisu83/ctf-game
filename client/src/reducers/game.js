import { Map, fromJS } from 'immutable';
import { forEach } from 'lodash';
import { SET_STATE, SET_POSITION, SET_VELOCITY, SET_ANIMATION, CONTEXT_CLIENT } from '../actions/game';
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

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_STATE:
      return setState(state, action.newState);

    case SET_POSITION:
      return setPosition(state, action.id, action.x, action.y, action.target);

    case SET_VELOCITY:
      return setVelocity(state, action.id, action.vx, action.vy);

    case SET_ANIMATION:
      return setAnimation(state, action.id, action.animation);

    default:
      return state;
  }
};

export default reducer;
