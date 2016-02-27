import { Map, List, fromJS } from 'immutable';
import { findEntityIndexById } from 'shared/helpers/game';
import { GameActions } from 'shared/constants';

const initialState = Map({
  entities: List()
});

/**
 *
 * @param {Map} state
 * @param {Object} newState
 * @returns {Map}
 */
export function setState(state, newState, playerId) {
  const nextState = fromJS(newState);
  if (!playerId) {
    return nextState;
  }
  return nextState;
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
 * @param {boolean} value
 * @returns {Map}
 */
export function setIsAttacking(state, id, value) {
  const entityIndex = findEntityIndexById(state.get('entities').toJS(), id);
  return state.setIn(['entities', entityIndex, 'isAttacking'], value);
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GameActions.SET_STATE:
      return setState(state, action.newState, action.playerId);

    case GameActions.SET_POSITION:
      return setPosition(state, action.id, action.x, action.y, action.target);

    case GameActions.SET_VELOCITY:
      return setVelocity(state, action.id, action.vx, action.vy);

    case GameActions.SET_ANIMATION:
      return setAnimation(state, action.id, action.animation);

    case GameActions.BEGIN_ATTACK:
      return setIsAttacking(state, action.id, true);

    case GameActions.END_ATTACK:
      return setIsAttacking(state, action.id, false);

    default:
      return state;
  }
};

export default reducer;
