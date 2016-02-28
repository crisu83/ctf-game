import { List } from 'immutable';
import { createReducer } from 'shared/helpers/store';
import { handlers } from '../handlers/entity';

const initialState = List();

export const entityReducer = createReducer(initialState, handlers);
