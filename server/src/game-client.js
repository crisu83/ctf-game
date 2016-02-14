import shortid from 'shortid';
import { logger } from './helpers';
import { createPlayer } from './factories/entity';
import { addEntity, removeEntity } from './actions/game';
import { READY, ACTION, DISCONNECT } from './events';

class GameClient {
  /**
   * @param socket
   * @param store
   * @param {Object} assetData
   * @param {Object} gameState
   */
  constructor(socket, store, assetData, gameState) {
    this._socket = socket;
    this._store = store;
    this._id = shortid.generate();

    const playerProps = createPlayer();

    this._playerId = playerProps.id;

    logger.info(`client.create (client_id: ${this._id})`);

    this._socket.on(DISCONNECT, this.handleDisconnect.bind(this));
    this._socket.on(ACTION, this.handleAction.bind(this));

    this._store.dispatch(addEntity(playerProps));

    // Send the initial state to the client.
    this._socket.emit(READY, this._id, assetData, gameState, playerProps);
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

    this._store.dispatch(removeEntity(this._playerId));
  }
}

export default GameClient;
