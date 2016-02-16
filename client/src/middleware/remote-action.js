import {CONTEXT_CLIENT, CONTEXT_SERVER} from '../actions/game';

export default function remoteActionMiddleware(socket) {
  return store => next => action => {
    if (action.context && action.context === CONTEXT_SERVER) {
      socket.emit('action', action);
    } else if (action.context && action.context === CONTEXT_CLIENT) {
      return next(action);
    } else {
      socket.emit('action', action);
      return next(action);
    }
  }
}
