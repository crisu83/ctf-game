import shortid from 'shortid';
import { logger } from './helpers';
import GameInstance from './game-instance';
import GameClient from './game-client';
import { SET_STATE } from './events';
import createStore from './store';
import { createMap } from './factories/map';

class GameRoom {
  /**
   * @param io
   */
  constructor(io) {
    this._io = io;
    this._id = shortid.generate();
    this._store = createStore();
    this._clients = [];
    this._lastTickAt = null;
    this._isRunning = true;
    this._gameData = this.loadGameData();

    this.close = this.close.bind(this);

    logger.info(`room.create (room_id: ${this._id})`);

    // Handle each new client connecting to this room.
    this._io.on('connection', this.handleConnection.bind(this));

    // Notify each client every time the state is changed.
    this._unsubscribeFromStore = this._store.subscribe(this.handleChange.bind(this));

    this._gameInstance = new GameInstance(this._store);
  }

  /**
   *
   * @returns {Object}
   */
  loadGameData() {
    return {
      assets: require('../data/assets.json'),
      config: require('../data/config.json'),
      map: createMap('castle', this._store.dispatch)
    };
  }

  /**
   *
   */
  handleChange() {
    this._io.emit(SET_STATE, this.gameState);
  }

  /**
   * @param socket
   */
  handleConnection(socket) {
    logger.info(`room.connect (room_id: ${this._id})`);

    this._clients.push(new GameClient(socket, this._store, this.gameData, this.gameState));
  }

  /**
   *
   * @returns {Object}
   */
  get gameState() {
    return this._store.getState().game.toJS();
  }

  /**
   *
   * @returns {Object}
   */
  get gameData() {
    return this._gameData;
  }

  /**
   *
   */
  close() {
    this._unsubscribeFromStore();
  }
}

export default GameRoom;
