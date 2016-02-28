import { expect } from 'chai';
import { Map, List } from 'immutable';
import {
  advanceElapsed
} from '../../../src/server/actions/time'
import {
  onAdvanceElapsed
} from '../../../src/server/handlers/time';

describe('server time logic', () => {

  it('integer value advances elapsed time in the state', () => {
    const state = Map({ elapsed: 12345 });
    const nextState = onAdvanceElapsed(state, advanceElapsed(100));
    expect(nextState).to.equal(Map({ elapsed: 12445 }));
  });

  it('nan value does not advance elapsed time in the state', () => {
    const state = Map({ elapsed: 12345 });
    const nextState = onAdvanceElapsed(state, advanceElapsed('one-hundred'));
    expect(nextState).to.equal(Map({ elapsed: 12345 }));
  });

});
