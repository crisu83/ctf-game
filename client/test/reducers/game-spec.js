import { expect } from 'chai';
import { Map, List } from 'immutable';
import { setState, moveLeft, moveRight, moveUp, moveDown } from '../../src/reducers/game';

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

    it('moving left decrements players x-position', () => {
      const state = Map({
        entities: List.of(
          Map({id: '1', name: 'John', x: 100, y: 100})
        )
      });
      const nextState = moveLeft(state, '1', 1);
      expect(nextState).to.equal(Map({
        entities: List.of(
          Map({id: '1', name: 'John', x: 99, y: 100})
        )
      }));
    });

    it('moving right increments players x-position', () => {
      const state = Map({
        entities: List.of(
          Map({id: '1', name: 'John', x: 100, y: 100})
        )
      });
      const nextState = moveRight(state, '1', 2);
      expect(nextState).to.equal(Map({
        entities: List.of(
          Map({id: '1', name: 'John', x: 102, y: 100})
        )
      }));
    });

    it('moving up decrements players y-position', () => {
      const state = Map({
        entities: List.of(
          Map({id: '1', name: 'John', x: 100, y: 100})
        )
      });
      const nextState = moveUp(state, '1', 3);
      expect(nextState).to.equal(Map({
        entities: List.of(
          Map({id: '1', name: 'John', x: 100, y: 97})
        )
      }));
    });

    it('moving down increments players y-position', () => {
      const state = Map({
        entities: List.of(
          Map({id: '1', name: 'John', x: 100, y: 100})
        )
      });
      const nextState = moveDown(state, '1', 4);
      expect(nextState).to.equal(Map({
        entities: List.of(
          Map({id: '1', name: 'John', x: 100, y: 104})
        )
      }));
    });

    it('moving twice actually moves the player', () => {
      const state = Map({
        entities: List.of(
          Map({id: '1', name: 'John', x: 100, y: 100})
        )
      });
      let nextState = moveDown(state, '1', 5);
      expect(nextState).to.equal(Map({
        entities: List.of(
          Map({id: '1', name: 'John', x: 100, y: 105})
        )
      }));
      nextState = moveDown(nextState, '1', 10);
      expect(nextState).to.equal(Map({
        entities: List.of(
          Map({id: '1', name: 'John', x: 100, y: 115})
        )
      }));
    });

  });

});
