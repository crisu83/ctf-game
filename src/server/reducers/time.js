import { Map } from 'immutable';
import { createReducer } from 'shared/helpers/store';
import { handlers } from '../handlers/time';

const initialState = Map();

export const timeReducer = createReducer(initialState, handlers);
