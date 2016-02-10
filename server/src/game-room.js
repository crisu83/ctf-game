import shortid from 'shortid';
import _ from 'lodash';
import GameSession from './game-session';
import GameClient from './game-client';
import {GAME_TICK_RATE} from './constants';

class GameRoom {
  /**
   * @constructor
   * @param {object} io
   * @param {GameServer} server
   */
  constructor(io, server) {
    this._io = io;
    this._server = server;
    this._id = shortid.generate();
    this._clients = [];
    this._lastTickAt = null;
    this._isRunning = true;

    console.log('room.create (room_id: %s)', this._id);

    this._session = new GameSession();

    setInterval(this.loop.bind(this), 1000 / GAME_TICK_RATE);

    this._io.on('connection', this.onConnect.bind(this));
  }

  /**
   * @param {object} socket
   */
  onConnect(socket) {
    console.log('room.connect (room_id: %s)', this._id);

    this._clients.push(new GameClient(socket, this));
  }

  /**
   * Game loop
   */
  loop() {
    let timeNow, timeElapsed;

    if (this._isRunning) {
      timeNow     = _.now();
      timeElapsed = timeNow - this._lastTickAt;

      this.update(timeElapsed);

      this._lastTickAt = timeNow;
    }
  }

  /**
   * Called every time the game state should update.
   * @param {Number} timeElapsed
   */
  update(timeElapsed) {
    this.updateClients();
  }

  /**
   * Updates the clients connected to this room.
   */
  updateClients() {
    for (let client of this._clients) {
      client.update(this._session.gameState);
    }
  }
}

export default GameRoom;
