/*eslint no-unused-vars: 0*/

import { Map } from 'immutable';
import { BEGIN_CONNECTION, END_CONNECTION, START_LOADING, STOP_LOADING } from '../actions/client';

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
    case BEGIN_CONNECTION:
      return updateIsConnected(state, true);

    case END_CONNECTION:
      return updateIsConnected(state, false);

    case START_LOADING:
      return updateIsLoading(state, true);

    case STOP_LOADING:
      return updateIsLoading(state, false);

    default:
      return state;
  }
};

export default reducer;
