import Phaser, { Game } from 'phaser';
import GameState from '../states/game';

/**
 *
 * @param store
 * @param {Object} playerProps
 * @param {Object} config
 * @returns {Phaser.Game}
 */
function createGame(store, playerProps, config) {
  const game = new Game(
    config.width,
    config.height,
    Phaser.AUTO,
    'phaser',
    null/* state */,
    false/* transparent */,
    false/* antialias */
  );

  game.state.add('game', new GameState(store, playerProps), true/* auto-start */);

  return game;
}

export default createGame;
