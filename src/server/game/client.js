import shortid from 'shortid';
import { find } from 'lodash';
import { logger } from '../helpers/vendor';
import { createProps } from '../factories/props';

const CONNECT_DELAY = 750;

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

    this._socket.on('latency', this.handleLatency.bind(this));

    logger.info(`client.connect (client_id: ${this._id})`);
  }

  /**
   * Connects this client to a game session.
   * @param {Session} session
   */
  joinSession(session) {
    let playerProps = createProps({type: 'player'});

    session.addPlayer(playerProps);

    this._channel = this._socket.join(session.channel);
    this._channel.on('disconnect', this.handleDisconnect.bind(this));
    this._channel.on('action', this.handleAction.bind(this));

    setTimeout(() => {
      playerProps = find(session.gameState.entities, props => props.id === playerProps.id);
      this._channel.emit('ready', this._id, session.gameData, session.gameState, playerProps);

      this._session = session;
      this._playerId = playerProps.id;

      logger.info(`client.join (client_id: ${this._id}, session_id: ${session.id})`);
    }, CONNECT_DELAY);
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
   * Called each time the client pings the server.
   * @param {number} timestamp
   */
  handleLatency(timestamp) {
    this._socket.emit('latency', timestamp);
  }

  /**
   * Called each time an action is received from the browser.
   * @param {Object} action
   */
  handleAction(action) {
    if (this._session) {
      // TODO: Add a white-list for client actions and check against that.
      // TODO: Consider adding a limit for how often actions will be dispatched.
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
