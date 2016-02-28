import { TimeActions } from '../constants';

/**
 *
 * @param {number} elapsed
 * @returns {{type: string, elapsed: number}}
 */
export function advanceElapsed(elapsed) {
  return { type: TimeActions.ADVANCE_ELAPSED, elapsed };
}
