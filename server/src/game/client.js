import shortid from 'shortid';
import { logger } from '../helpers';
import { createProps } from '../factories/props';
import { READY, ACTION, DISCONNECT } from '../events';

class Client {
  /**
   * Creates a new game client.
   * @param {Server} server
   * @param socket
   */
  constructor(server, socket) {
    this._server = server;
    this._socket = socket;
    this._channel = null;
    this._id = shortid.generate();
    this._session = null;
    this._playerId = null;

    logger.info(`client.connect (client_id: ${this._id})`);
  }

  /**
   * Connects this client to a game session.
   * @param {Session} session
   */
  joinSession(session) {
    const playerProps = createProps({type: 'player'});

    session.addPlayer(playerProps);

    this._channel = this._socket.join(session.channel);
    this._channel.on(DISCONNECT, this.handleDisconnect.bind(this));
    this._channel.on(ACTION, this.handleAction.bind(this));
    this._channel.emit(READY, this._id, session.gameData, session.gameState, playerProps);

    this._session = session;
    this._playerId = playerProps.id;

    logger.info(`client.join (client_id: ${this._id}, session_id: ${session.id})`);
  }

  /**
   * Disconnects the client from the current game session.
   */
  leaveSession() {
    if (!this._session) {
      return;
    }

    this._channel.leave();

    logger.info(`client.leave (client_id: ${this._id}, session_id: ${this._session.id})`);

    this._session.removePlayer(this._playerId);
    this._session = null;
  }

  /**
   * Called each time an action is received from the browser.
   * @param {Object} action
   */
  handleAction(action) {
    if (this._session) {
      this._session.handleClientAction(action);
    }
  }

  /**
   * Called when the connection to the browser is lost.
   */
  handleDisconnect() {
    if (this._session) {
      this.leaveSession();
    }

    this._server.removeClient(this._id);

    logger.info(`client.disconnected (client_id: ${this._id})`);
  }

  /**
   * Returns the id of this client.
   * @returns {string}
   */
  get id() {
    return this._id;
  }
}

export default Client;
