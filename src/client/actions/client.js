import { ClientActions } from '../constants';

export function beginConnection() {
  return { type: ClientActions.BEGIN_CONNECTION };
}

export function endConnection() {
  return { type: ClientActions.END_CONNECTION };
}

export function startLoading() {
  return { type: ClientActions.START_LOADING };
}

export function stopLoading() {
  return { type: ClientActions.STOP_LOADING };
}
