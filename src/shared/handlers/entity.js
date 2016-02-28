import { findEntityIndexById } from '../helpers/game';

export function onSetPosition(state, action) {
  const { id, x, y } = action;
  const entityIndex = findEntityIndexById(state.toJS(), id);
  return state.setIn([entityIndex, 'x'], x).setIn([entityIndex, 'y'], y);
}

export function onSetAnimation(state, action) {
  const { id, animation } = action;
  const entityIndex = findEntityIndexById(state.toJS(), id);
  return state.setIn([entityIndex, 'animation'], animation);
}
