import { isNumber } from 'lodash';
import { TimeActions } from '../constants';

export function onAdvanceElapsed(state, action) {
  const { elapsed: time } = action;
  return state.update('elapsed', 0, elapsed => isNumber(time) ? elapsed + time : elapsed);
}

export const handlers = {
  [TimeActions.ADVANCE_ELAPSED]: onAdvanceElapsed
};
