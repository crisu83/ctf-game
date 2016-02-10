import shortid from 'shortid';

class GameClient {
  /**
   * @constructor
   * @param {object} socket
   * @param {GameRoom} room
   */
  constructor(socket, room) {
    this._socket = socket;
    this._room = room;
    this._id = shortid.generate();
    this._isReady = false;

    console.log('client.create (client_id: %s)', this._id);

    this._socket.on('client.ready', this.onReady.bind(this));
    this._socket.on('disconnect', this.onDisconnect.bind(this));

    this._socket.emit('client.connected', this._id);
  }

  /**
   *
   */
  onReady() {
    console.log('client.ready (client_id: %s)', this._id);

    this._isReady = true;
  }

  /**
   *
   */
  onDisconnect() {
    console.log('client.disconnected (client_id: %s)', this._id);
  }

  /**
   * @param {object} gameState
   */
  update(gameState) {
    this._socket.emit('client.update', this._id, gameState);
  }
}

export default GameClient;
