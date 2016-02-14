export default function remoteActionMiddleware(socket) {
  return store => next => action => {
    if (action.remote) {
      socket.emit('action', action);
    }

    return next(action);
  }
}
