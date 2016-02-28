import { combineReducers, createStore } from 'redux';
import { entityReducer } from '../reducers/entity';
import { timeReducer } from '../reducers/time';

/**
 *
 * @returns {*}
 */
export function buildStore() {
  const rootReducer = combineReducers({
    entities: entityReducer,
    time: timeReducer
  });

  return createStore(rootReducer);
}
