import { combineReducers, compose, applyMiddleware, createStore } from 'redux';
import remoteActionMiddleware from './middleware/remote-action';
import gameReducer from './reducers/game';

const rootReducer = combineReducers({
  game: gameReducer
});

export default (socket) => compose(
  applyMiddleware(remoteActionMiddleware(socket)),
  window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore)(rootReducer);
