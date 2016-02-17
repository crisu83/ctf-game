import { expect } from 'chai';
import { Map, List, fromJS } from 'immutable';
import { setState, setPosition, setVelocity, setAnimation, captureFlag } from '../../src/reducers/game';

describe('game reducer', () => {

  it('new state overrides the current state', () => {
    const state = Map({
      entities: List.of(
        Map({id: '1', name: 'John'}),
        Map({id: '2', name: 'Jane'}),
        Map({id: '3', name: 'Alex'})
      ),
      time: Map({
        elapsed: 100
      })
    });
    const nextState = setState(state, Map({
      entities: List.of(
        Map({id: '3', name: 'Alexia'})
      ),
      time: Map({
        elapsed: 123
      })
    }));
    expect(nextState).to.equal(Map({
      entities: List.of(
        Map({id: '3', name: 'Alexia'})
      ),
      time: Map({
        elapsed: 123
      })
    }));
  });

  describe('player logic', () => {

    it('sets player position in the state', () => {
      const state = Map(Map({
        entities: List.of(
          Map({id: '1', name: 'John', x: 100, y: 100})
        ),
        time: Map({
          elapsed: 123
        })
      }));
      const nextState = setPosition(state, '1', 123, 87);
      expect(nextState).to.equal(Map({
        entities: List.of(
          Map({id: '1', name: 'John', x: 123, y: 87})
        ),
        time: Map({
          elapsed: 123
        })
      }));
    });

    it('sets player velocity in the state', () => {
      const state = Map(Map({
        entities: List.of(
          Map({id: '2', name: 'Jane', vx: 0, vy: 0})
        ),
        time: Map({
          elapsed: 123
        })
      }));
      const nextState = setVelocity(state, '2', 100, 0);
      expect(nextState).to.equal(Map({
        entities: List.of(
          Map({id: '2', name: 'Jane', vx: 100, vy: 0})
        ),
        time: Map({
          elapsed: 123
        })
      }));
    });

    it('sets player animation in the state', () => {
      const state = Map(Map({
        entities: List.of(
          Map({id: '3', name: 'Alexia'})
        ),
        time: Map({
          elapsed: 123
        })
      }));
      const nextState = setAnimation(state, '3', 'runRight');
      expect(nextState).to.equal(Map({
        entities: List.of(
          Map({id: '3', name: 'Alexia', animation: 'runRight'})
        ),
        time: Map({
          elapsed: 123
        })
      }));
    });

  });

});
