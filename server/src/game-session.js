import shortid from 'shortid';

class GameSession {
  /**
   * @constructor
   */
  constructor() {
    this._id = shortid.generate();
    this._tilemap = null;
    this._world = null;
    this._teams = [];
    this._flags = [];
    this._players = [];

    console.log('session.create (session_id: %s)', this._id);
  }

  startGame() {
    loadTilemap();
    createTeams();
    createFlags();
  }

  loadTilemap() {
    // TODO: load tilemap
  }

  createTeams() {
    // TODO: create teams
  }

  createFlags() {
    // TODO: create flags
  }

  get gameState() {
    return {
      id: this._id
    };
  }
}

export default GameSession;
