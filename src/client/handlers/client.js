/*eslint no-unused-vars: 0*/

import { ClientActions } from '../constants';

export function beginConnection(state, action) {
  return setIsConnected(state, action, true);
}

export function endConnection(state, action) {
  return setIsConnected(state, action, false);
}

export function startLoading(state, action) {
  return setIsLoading(state, action, true);
}

export function stopLoading(state, action) {
  return setIsLoading(state, action, false);
}

function setIsConnected(state, action, value) {
  return state.set('isConnected', value);
}

function setIsLoading(state, action, value) {
  return state.set('isLoading', value);
}

export const handlers = {
  [ClientActions.BEGIN_CONNECTION]: beginConnection,
  [ClientActions.END_CONNECTION]: endConnection,
  [ClientActions.START_LOADING]: startLoading,
  [ClientActions.STOP_LOADING]: stopLoading
};
