import { combineReducers, compose, applyMiddleware, createStore } from 'redux';
import remoteActionMiddleware from './middleware/remote-action';
import clientReducer from './reducers/client';
import gameReducer from './reducers/game';

const rootReducer = combineReducers({
  client: clientReducer,
  game: gameReducer
});

export default (socket) => compose(
  applyMiddleware(remoteActionMiddleware(socket)),
  window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore)(rootReducer);
