import { find } from 'lodash';
import Session from './session';
import Client from './client';

class Server {
  /**
   * Creates a new game server.
   * @param io
   */
  constructor(io) {
    this._io = io;
    this._clients = [];
    this._sessions = [];
  }

  /**
   * Boots the game server.
   */
  boot() {
    const session = new Session(this._io);

    this.addSession(session);

    session.start();

    this._io.on('connection', this.handleConnection.bind(this));
  }

  /**
   * Adds a session to the server's session pool.
   * @param {Session} session
   */
  addSession(session) {
    this._sessions.push(session);
  }

  /**
   * Adds a client to the server's client pool.
   * @param {Client} client
   */
  addClient(client) {
    this._clients.push(client);
  }

  /**
   * Removes a client from the server's client pool.
   * @param {string} id
   */
  removeClient(id) {
    this._clients = this._clients.filter(client => client.id !== id);
  }

  /**
   * Called when a client connects to the server.
   * @param socket
   */
  handleConnection(socket) {
    const client = new Client(this, socket);

    this.addClient(client);
    this.findSessionForClient(client)
  }

  /**
   * Finds a suitable session for a client.
   * @param {Client} client
   */
  findSessionForClient(client) {
    const session = this._sessions[0];

    client.joinSession(session);
  }
}

export default Server;
