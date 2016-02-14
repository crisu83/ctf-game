import { expect } from 'chai';
import { Map, List } from 'immutable';
import { addEntity, removeEntity, moveLeft, moveRight, moveUp, moveDown, advanceTime } from '../../src/reducers/game';

describe('game reducer', () => {

  describe('entity logic', () => {

    it('adds an entity to the state', () => {
      const state = Map({entities: List()});
      const nextState = addEntity(state, {id: '1', name: 'John'});
      expect(nextState).to.equal(Map({entities: List.of(Map({id: '1', name: 'John'}))}));
    });

    it('removes an entity from the state', () => {
      const state = Map({entities: List.of(
        Map({id: '1', name: 'John'}),
        Map({id: '2', name: 'Jane'}),
        Map({id: '3', name: 'Alex'})
      )});
      const nextState = removeEntity(state, '2');
      expect(nextState).to.equal(Map({entities: List.of(
        Map({id: '1', name: 'John'}),
        Map({id: '3', name: 'Alex'})
      )}));
    });

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

  describe('timer logic', () => {

    it('integer value advances elapsed time in the state', () => {
      const state = Map({time: Map({elapsed: 12345})});
      const nextState = advanceTime(state, 100);
      expect(nextState).to.equal(Map({time: Map({elapsed: 12445})}));
    });

    it('nan value does not advance elapsed time in the state', () => {
      const state = Map({time: Map({elapsed: 12345})});
      const nextState = advanceTime(state, 'one-hundred');
      expect(nextState).to.equal(Map({time: Map({elapsed: 12345})}));
    });

  });

});
