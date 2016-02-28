import { EntityActions } from 'shared/constants';

/**
 *
 * @param {string} id
 * @param {number} x
 * @param {number} y
 * @param {string} context
 * @returns {{type: string, x: number, y: number}}
 */
export function setPosition(id, x, y, context) {
  return { type: EntityActions.SET_POSITION, id, x, y, context };
}
