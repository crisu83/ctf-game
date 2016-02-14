import shortid from 'shortid';
import { Map } from 'immutable';
import { logger } from './helpers';
import GameInstance from './game-instance';
import GameClient from './game-client';
import { SET_STATE } from './events';
import createStore from './store';

function mapStateToClient(state) {

}

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

    this.close = this.close.bind(this);

    logger.info(`room.create (room_id: ${this._id})`);

    // Handle each new client connecting to this room.
    this._io.on('connection', this.handleConnection.bind(this));

    // Notify each client every time the state is changed.
    this._unsubscribeFromStore = this._store.subscribe(this.handleChange.bind(this));

    this._gameInstance = new GameInstance(this._store);
  }

  handleChange() {
    this._io.emit(SET_STATE, this.state);
  }

  /**
   * @param socket
   */
  handleConnection(socket) {
    logger.info(`room.connect (room_id: ${this._id})`);

    this._clients.push(new GameClient(socket, this._store));
  }

  /**
   *
   * @returns {Map}
   */
  get state() {
    return this._store.getState().game.toJS();
  }

  close() {
    this._unsubscribeFromStore();
  }
}

export default GameRoom;
