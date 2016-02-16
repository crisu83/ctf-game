import { expect } from 'chai';
import { Map, List } from 'immutable';
import { addEntity, removeEntity, setPosition, setVelocity, setAnimation, advanceTime } from '../../src/reducers/game';

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
