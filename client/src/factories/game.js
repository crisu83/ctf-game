import Phaser, { Game } from 'phaser';
import GameState from '../game/states/game';

/**
 *
 * @param store
 * @param {Object} gameData
 * @param {Object} playerProps
 * @param {Object} config
 * @returns {Phaser.Game}
 */
export function createGame(store, gameData, playerProps, config) {
  const game = new Game(
    config.width,
    config.height,
    Phaser.AUTO,
    'phaser',
    null/* state */,
    false/* transparent */,
    false/* antialias */
  );

  game.state.add('game', new GameState(store, gameData, playerProps), true/* auto-start */);

  return game;
}
