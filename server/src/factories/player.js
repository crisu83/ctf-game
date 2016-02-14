import shortid from 'shortid';
import { chance } from '../helpers';

/**
 *
 * @returns {{id: string, type: string, name: string, x: number, y: number, color: string}}
 */
export function createPlayer() {
  return {
    id: shortid.generate(),
    type: 'player',
    name: chance.first(),
    x: 0,
    y: 20,
    color: chance.pick(['blue', 'green', 'orange', 'purple'])
  };
}
