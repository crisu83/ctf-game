import GameRoom from './game-room';

class GameServer {
  /**
   * @param io
   */
  constructor(io) {
    this._io = io;
  }

  boot() {
    new GameRoom(this._io);
  }
}

export default GameServer;
