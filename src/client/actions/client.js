export const BEGIN_CONNECTION = 'client/BEGIN_CONNECTION';
export const END_CONNECTION = 'client/END_CONNECTION';
export const START_LOADING = 'client/START_LOADING';
export const STOP_LOADING = 'client/STOP_LOADING';

export function beginConnection() {
  return { type: BEGIN_CONNECTION };
}

export function endConnection() {
  return { type: END_CONNECTION };
}

export function startLoading() {
  return { type: START_LOADING };
}

export function stopLoading() {
  return { type: STOP_LOADING };
}
