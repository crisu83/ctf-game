import { FacingDirections } from 'shared/constants';

/**
 *
 * @param {string} action
 * @param {string} facing
 * @returns {string}
 */
export function resolveActionAnimation(action, facing) {
  facing = facing || 'none';

  // TODO: Refactor this method
  if (action === 'run' && facing === FacingDirections.NONE) {
    return 'idle';
  } else if (action === 'attack' && facing === FacingDirections.NONE) {
    return 'attackDown';
  } else {
    return action + facing.charAt(0).toUpperCase() + facing.slice(1);
  }
}
