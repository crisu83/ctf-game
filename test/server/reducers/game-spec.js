import { expect } from 'chai';
import { Map, List } from 'immutable';
import {
  addEntity,
  removeEntity,
  setPosition,
  setVelocity,
  setAnimation,
  setFacing,
  setIsAttacking,
  damageEntity,
  killEntity,
  beginRevive,
  tagFlag,
  advanceTime
} from '../../../src/server/reducers/game';

describe('game reducer', () => {

  describe('entity logic', () => {

    it('adds an entity to the state', () => {
      const state = Map({entities: List()});
      const nextState = addEntity(state, {id: '1', name: 'John'});
      expect(nextState).to.equal(Map({entities: List.of(Map({id: '1', name: 'John'}))}));
    });

    it('removes an entity from the state', () => {
      const state = Map({entities: List.of(
        Map({id: '2', name: 'Jane'})
      )});
      const nextState = removeEntity(state, '2');
      expect(nextState).to.equal(Map({entities: List.of()}));
    });

    it('damaging an entity reduces its health in the state', () => {
      const state = Map(Map({
        entities: List.of(
          Map({id: '1', name: 'John', damage: 50}),
          Map({id: '2', name: 'Jane', currentHealth: 100})
        )
      }));
      const nextState = damageEntity(state, '1', '2');
      expect(nextState).to.equal(Map({
        entities: List.of(
          Map({id: '1', name: 'John', damage: 50}),
          Map({id: '2', name: 'Jane', currentHealth: 50, lastAttackerId: '1'})
        )
      }));
    });

    it('killing an entity marks it as dead and sets its health to zero in the state', () => {
      const state = Map(Map({
        entities: List.of(
          Map({id: '1', name: 'John', damage: 50}),
          Map({id: '2', name: 'Jane', currentHealth: 9999})
        )
      }));
      const nextState = killEntity(state, '2', '1');
      expect(nextState).to.equal(Map({
        entities: List.of(
          Map({id: '1', name: 'John', damage: 50, numKills: 1}),
          Map({id: '2', name: 'Jane', currentHealth: 0, isDead: true, numDeaths: 1})
        )
      }));
    });

    it('reviving an entity marks it as alive and restores its health in the state', () => {
      const state = Map(Map({
        entities: List.of(
          Map({id: '1', name: 'John', currentHealth: -20, health: 100, isDead: true})
        )
      }));
      const nextState = beginRevive(state, '1');
      expect(nextState).to.equal(Map({
        entities: List.of(
          Map({id: '1', name: 'John', currentHealth: 100, health: 100, isReviving: true, isDead: false}),
        )
      }));
    });

  });

  describe('player logic', () => {

    it('sets player position in the state', () => {
      const state = Map(Map({
        entities: List.of(
          Map({id: '1', name: 'John', x: 100, y: 100})
        )
      }));
      const nextState = setPosition(state, '1', 123, 87);
      expect(nextState).to.equal(Map({
        entities: List.of(
          Map({id: '1', name: 'John', x: 123, y: 87})
        )
      }));
    });

    it('sets player velocity in the state', () => {
      const state = Map(Map({
        entities: List.of(
          Map({id: '1', name: 'John', vx: 0, vy: 0})
        )
      }));
      const nextState = setVelocity(state, '1', 100, 0);
      expect(nextState).to.equal(Map({
        entities: List.of(
          Map({id: '1', name: 'John', vx: 100, vy: 0})
        )
      }));
    });

    it('sets player animation in the state', () => {
      const state = Map(Map({
        entities: List.of(
          Map({id: '1', name: 'John'})
        )
      }));
      const nextState = setAnimation(state, '1', 'runRight');
      expect(nextState).to.equal(Map({
        entities: List.of(
          Map({id: '1', name: 'John', animation: 'runRight'})
        )
      }));
    });

    it('sets player facing in the state', () => {
      const state = Map(Map({
        entities: List.of(
          Map({id: '1', name: 'John'})
        )
      }));
      const nextState = setFacing(state, '1', 'down');
      expect(nextState).to.equal(Map({
        entities: List.of(
          Map({id: '1', name: 'John', facing: 'down'}),
        )
      }));
    });

    it('sets player as attacking in the state', () => {
      const state = Map(Map({
        entities: List.of(
          Map({id: '1', name: 'John'})
        )
      }));
      const nextState = setIsAttacking(state, '1', true);
      expect(nextState).to.equal(Map({
        entities: List.of(
          Map({id: '1', name: 'John', isAttacking: true})
        )
      }));

    });

    it('sets player as not attacking in the state', () => {
      const state = Map(Map({
        entities: List.of(
          Map({id: '1', name: 'John', isAttacking: true})
        )
      }));
      const nextState = setIsAttacking(state, '1', false);
      expect(nextState).to.equal(Map({
        entities: List.of(
          Map({id: '1', name: 'John', isAttacking: false})
        )
      }));
    });

  });

  describe('flag logic', () => {

    it('sets the flag color to the players color when it is captured', () => {
      const state = Map({
        entities: List.of(
          Map({type: 'player', id: '1', name: 'John', x: 100, y: 100, color: 'blue'}),
          Map({type: 'flag', id: '99', x: 100, y: 100, color: 'neutral'})
        )
      });
      const nextState = tagFlag(state, '99', '1');
      expect(nextState).to.equal(Map({
        entities: List.of(
          Map({type: 'player', id: '1', name: 'John', x: 100, y: 100, color: 'blue'}),
          Map({type: 'flag', id: '99', x: 100, y: 100, color: 'blue'})
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
