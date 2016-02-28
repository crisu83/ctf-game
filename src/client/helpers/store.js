import { combineReducers, compose, applyMiddleware, createStore } from 'redux';
import removeActionMiddleware from '../middleware/remote-action';
import { clientReducer } from '../reducers/client';
import { entityReducer } from '../reducers/entity';

/**
 *
 * @param socket
 * @returns {*}
 */
export function buildStore(socket) {
  const rootReducer = combineReducers({
    client: clientReducer,
    entities: entityReducer
  });

  return compose(
    applyMiddleware(removeActionMiddleware(socket)),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )(createStore)(rootReducer);
}
