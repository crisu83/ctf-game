import { Map } from 'immutable';
import { createReducer } from 'shared/helpers/store';
import { handlers } from '../handlers/client';

const initialState = Map({
  isConnected: false,
  isLoading: false
});

export const clientReducer = createReducer(initialState, handlers);
