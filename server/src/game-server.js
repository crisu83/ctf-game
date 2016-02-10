import GameRoom from './game-room';

class GameServer {
  constructor(io) {
    this._io = io;
    this._rooms = [];
  }

  boot() {
    this._rooms.push(new GameRoom(this._io, this));
  }
}

export default GameServer;
