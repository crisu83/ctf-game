import Phaser, { Game } from 'phaser';
import GameState from '../states/game';

/**
 *
 * @param socket
 * @param store
 * @param {Object} playerProps
 * @param {Object} config
 * @returns {Phaser.Game}
 */
function createGame(socket, store, playerProps, config) {
  const game = new Game(
    config.width,
    config.height,
    Phaser.AUTO,
    'container',
    null/* state */,
    false/* transparent */,
    false/* antialias */
  );

  game.state.add('game', new GameState(socket, store, playerProps), true/* auto-start */);

  return game;
}

export default createGame;
