/*eslint no-unused-vars: 0*/
/*eslint consistent-return: 0*/

import { ContextTypes } from '../constants';

export default function remoteActionMiddleware(socket) {
  return store => next => action => {
    if (action.context && action.context === ContextTypes.SERVER) {
      socket.emit('action', action);
    } else if (action.context && action.context === ContextTypes.CLIENT) {
      return next(action);
    } else {
      socket.emit('action', action);
      return next(action);
    }
  };
}
