import Phaser, { Game } from 'phaser';
import GameState from '../states/game';

function createGame(socket, store, playerProps, config) {
  const game = new Game(
    config.width,
    config.height,
    Phaser.AUTO,
    'game',
    null/* state */,
    false/* transparent */,
    false/* antialias */
  );

  game.state.add('game', new GameState(socket, store, playerProps), true/* auto-start */);

  return game;
}

export default createGame;
