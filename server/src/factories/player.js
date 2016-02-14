import shortid from 'shortid';
import { chance } from '../helpers';

/**
 *
 * @returns {{id: string, type: string, name: string, x: number, y: number, sprite: string}}
 */
export function createPlayer() {
  return {
    id: shortid.generate(),
    type: 'player',
    name: chance.first(),
    x: 0,
    y: 0,
    sprite: chance.pick(['knight-blue', 'knight-green', 'knight-orange', 'knight-purple'])
  };
}
