/*eslint no-unused-vars: 0*/

import { Map, fromJS } from 'immutable';
import { onSetPosition, onSetFacing, onSetAnimation } from 'shared/handlers/entity';
import { findEntityIndexById } from 'shared/helpers/game';
import { EntityActions } from 'shared/constants';

export function onUpdateState(state, action) {
  const { newState, playerId } = action;
  const nextState = fromJS(newState);
  const playerIndex = findEntityIndexById(state.toJS(), playerId);
  const playerProps = state.get(playerIndex) || Map();
  return nextState.update(playerIndex, Map(), props => playerProps.merge(props));
}

export function onSetVelocity(state, action) {
  const { id, vx, vy } = action;
  const entityIndex = findEntityIndexById(state.toJS(), id);
  return state.setIn([entityIndex, 'vx'], vx).setIn([entityIndex, 'vy'], vy);
}

export function onBeginAttack(state, action) {
  return setIsAttacking(state, action, true);
}

export function onEndAttack(state, action) {
  return setIsAttacking(state, action, false);
}

function setIsAttacking(state, action, value) {
  const { id } = action;
  const entityIndex = findEntityIndexById(state.toJS(), id);
  return state.setIn([entityIndex, 'isAttacking'], value);
}

export const handlers = {
  [EntityActions.UPDATE_STATE]: onUpdateState,
  [EntityActions.SET_POSITION]: onSetPosition,
  [EntityActions.SET_VELOCITY]: onSetVelocity,
  [EntityActions.SET_FACING]: onSetFacing,
  [EntityActions.SET_ANIMATION]: onSetAnimation,
  [EntityActions.BEGIN_ATTACK]: onBeginAttack,
  [EntityActions.END_ATTACK]: onEndAttack
};
