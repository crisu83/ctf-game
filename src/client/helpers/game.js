import { FacingDirections } from 'shared/constants';

/**
 *
 * @returns {string}
 */
export function randomTip() {
  const tips = [
    'Use ARROW keys to move',
    'Hold down SHIFT to sprint',
    'Press SPACE to attack',
    'Press M to mute the music',
    'Run over a flag to tag it',
    'Tag flags to receive more points',
    'Players are revived in their base',
    'Tell your friends to join for more fun',
    'Use the mini-map to your advantage'
  ];

  const tipIndex = Math.round(Math.random() * (tips.length - 1));

  return tips[tipIndex];
}

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
