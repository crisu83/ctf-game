/*eslint no-unused-vars: 0*/

import { Map } from 'immutable';
import { ClientActions } from '../constants';

const initialState = Map({
  isConnected: false,
  isLoading: false
});

export function updateIsConnected(state, value) {
  return state.update('isConnected', isConnected => value);
}

export function updateIsLoading(state, value) {
  return state.update('isLoading', isLoading => value);
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ClientActions.BEGIN_CONNECTION:
      return updateIsConnected(state, true);

    case ClientActions.END_CONNECTION:
      return updateIsConnected(state, false);

    case ClientActions.START_LOADING:
      return updateIsLoading(state, true);

    case ClientActions.STOP_LOADING:
      return updateIsLoading(state, false);

    default:
      return state;
  }
};

export default reducer;
