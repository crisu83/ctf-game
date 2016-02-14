import Phaser, { Game } from 'phaser';
import GameState from '../game/states/game';

/**
 *
 * @param store
 * @param {Object} assetData
 * @param {Object} playerProps
 * @param {Object} config
 * @returns {Phaser.Game}
 */
export function createGame(store, assetData, playerProps, config) {
  const game = new Game(
    config.width,
    config.height,
    Phaser.AUTO,
    'phaser',
    null/* state */,
    false/* transparent */,
    false/* antialias */
  );

  game.state.add('game', new GameState(store, assetData, playerProps), true/* auto-start */);

  return game;
}
