/*eslint no-unused-vars: 0*/

import { Map, fromJS } from 'immutable';
import { onSetPosition, onSetAnimation } from 'shared/handlers/entity';
import { findEntityIndexById } from 'shared/helpers/game';
import { EntityActions } from 'shared/constants';

export function onUpdateState(state, action) {
  const { newState, playerProps } = action;
  const playerIndex = findEntityIndexById(state.toJS(), playerProps.id);
  const clientProps = state.get(playerIndex) || Map();
  return fromJS(newState).update(playerIndex, Map(), serverProps => mergePlayerProps(clientProps, serverProps));
}

function mergePlayerProps(clientProps, serverProps) {
  // TODO: Ensure that this happens correctly.
  return clientProps.merge(serverProps);
}

export function onSetVelocity(state, action) {
  const { id, vx, vy } = action;
  const entityIndex = findEntityIndexById(state.toJS(), id);
  return state.setIn([entityIndex, 'vx'], vx).setIn([entityIndex, 'vy'], vy);
}

export function onSetFacing(state, action) {
  const { id, facing } = action;
  const entityIndex = findEntityIndexById(state.toJS(), id);
  return state.setIn([entityIndex, 'facing'], facing);
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
