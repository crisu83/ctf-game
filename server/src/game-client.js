import shortid from 'shortid';
import { logger } from './helpers';
import { createPlayer } from './factories/player';
import { addEntity, removeEntity } from './actions/game';
import { READY, ACTION, DISCONNECT } from './events';

class GameClient {
  /**
   * @param socket
   * @param store
   */
  constructor(socket, store) {
    this._socket = socket;
    this._store = store;
    this._id = shortid.generate();
    this._playerProps = createPlayer();

    logger.info(`client.create (client_id: ${this._id})`);

    this._socket.on(DISCONNECT, this.handleDisconnect.bind(this));
    this._socket.on(ACTION, this.handleAction.bind(this));

    this._store.dispatch(addEntity(this._playerProps));

    // Send the initial state to the client.
    this._socket.emit(READY, this._id, this._playerProps, this.state);
  }

  /**
   *
   * @param {Object} action
   */
  handleAction(action) {
    this._store.dispatch(action);
  }

  /**
   *
   */
  handleDisconnect() {
    logger.info(`client.disconnected (client_id: ${this._id})`);

    this._store.dispatch(removeEntity(this._playerProps.id));
  }

  get state() {
    return this._store.getState().game.toJS();
  }
}

export default GameClient;
