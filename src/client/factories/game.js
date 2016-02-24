import Phaser, { Game } from 'phaser';
import { get } from 'lodash';
import Castle from '../game/states/castle';

/**
 *
 * @param store
 * @param socket
 * @param {Object} gameData
 * @param {Object} playerProps
 * @returns {Phaser.Game}
 */
export function createGame(store, socket, gameData, playerProps) {
  const game = new Game(
    get(gameData, 'config.gameWidth') || 800,
    get(gameData, 'config.gameHeight') || 600,
    Phaser.AUTO,
    'phaser',
    null/* state */,
    false/* transparent */,
    false/* antialias */
  );

  game.state.add('game', new Castle(store, socket, gameData, playerProps), true/* autoStart */);

  return game;
}
