import { expect } from 'chai';
import { Map, List } from 'immutable';
import {
  setPosition,
  setAnimation,
  damageEntity,
  tagFlag
} from '../../../src/client/actions/entity';
import {
  addEntity,
  removeEntity,
  killEntity,
  beginRevive,
  endRevive,
  joinTeam,
  leaveTeam,
  givePoints
} from '../../../src/server/actions/entity';
import {
  onAddEntity,
  onRemoveEntity,
  onDamageEntity,
  onKillEntity,
  onBeginRevive,
  onEndRevive,
  onJoinTeam,
  onLeaveTeam,
  onGivePoints,
  onTagFlag
} from '../../../src/server/handlers/entity';
import {
  onSetPosition,
  onSetAnimation
} from '../../../src/shared/handlers/entity';

describe('server entity logic', () => {

  describe('entity logic', () => {

    it('adds an entity to the state', () => {
      const state = List();
      const nextState = onAddEntity(state, addEntity({ id: '1', name: 'John' }));
      expect(nextState).to.equal(List.of(
        Map({ id: '1', name: 'John' })
      ));
    });

    it('removes an entity from the state', () => {
      const state = List.of(
        Map({ id: '2', name: 'Jane' })
      );
      const nextState = onRemoveEntity(state, removeEntity('2'));
      expect(nextState).to.equal(List.of());
    });

    it('damages an entity and reduces its health in the state', () => {
      const state = List.of(
        Map({ id: '1', name: 'John', damage: 50, color: 'blue' }),
        Map({ id: '2', name: 'Jane', currentHealth: 100, color: 'green' })
      );
      const nextState = onDamageEntity(state, damageEntity('1', '2'));
      expect(nextState).to.equal(List.of(
        Map({ id: '1', name: 'John', damage: 50, color: 'blue' }),
        Map({ id: '2', name: 'Jane', currentHealth: 50, color: 'green', lastAttackerId: '1' })
      ));
    });

    it('kills an entity, marks it as dead and sets its health to zero in the state', () => {
      const state = List.of(
        Map({ id: '1', name: 'John', damage: 50 }),
        Map({ id: '2', name: 'Jane', currentHealth: 9999 })
      );
      const nextState = onKillEntity(state, killEntity('2', '1'));
      expect(nextState).to.equal(List.of(
        Map({ id: '1', name: 'John', damage: 50, numKills: 1 }),
        Map({ id: '2', name: 'Jane', currentHealth: 0, isDead: true, numDeaths: 1 })
      ));
    });

    it('starts reviving an entity by restoring its health in the state', () => {
      const state = List.of(
        Map({ id: '1', name: 'John', x: 500, y: 500, currentHealth: -20, health: 100, isDead: true })
      );
      const nextState = onBeginRevive(state, beginRevive('1', 100, 100));
      expect(nextState).to.equal(List.of(
        Map({ id: '1', name: 'John', x: 100, y: 100, currentHealth: 100, health: 100, isReviving: true, isDead: false }),
      ));
    });

    it('revives an entity, marks it as not dead nor reviving in the state', () => {
      const state = List.of(
        Map({ id: '1', name: 'John', isReviving: true, isDead: true })
      );
      const nextState = onEndRevive(state, endRevive('1'));
      expect(nextState).to.equal(List.of(
        Map({ id: '1', name: 'John', isReviving: false, isDead: false }),
      ));
    });

  });
  
  describe('team logic', () => {
    
    it('adds a player to the team in the state', () => {
      const state = List.of(
        Map({ type: 'player', id: '1', name: 'John', x: 100, y: 100 }),
        Map({ type: 'team', id: '50', color: 'blue', hexColor: '#00f' }),
      );
      const nextState = onJoinTeam(state, joinTeam('50', '1'));
      expect(nextState).to.equal(List.of(
        Map({ type: 'player', id: '1', name: 'John', x: 100, y: 100, team: '50', color: 'blue', hexColor: '#00f' }),
        Map({ type: 'team', id: '50', color: 'blue', hexColor: '#00f', players: List.of('1') }),
      ));
    });

    it('removes a player from its team in the state', () => {
      const state = List.of(
        Map({ type: 'player', id: '1', name: 'John', x: 100, y: 100, team: '50', color: 'blue', hexColor: '#00f' }),
        Map({ type: 'team', id: '50', color: 'blue', hexColor: '#00f', players: List.of('1') }),
      );
      const nextState = onLeaveTeam(state, leaveTeam('1'));
      expect(nextState).to.equal(List.of(
        Map({ type: 'player', id: '1', name: 'John', x: 100, y: 100, team: '50', color: 'blue', hexColor: '#00f' }),
        Map({ type: 'team', id: '50', color: 'blue', hexColor: '#00f', players: List() }),
      ));
    });

  });

  describe('player logic', () => {

    it('sets player position in the state', () => {
      const state = List.of(
        Map({ id: '1', name: 'John', x: 100, y: 100 })
      );
      const nextState = onSetPosition(state, setPosition('1', 123, 87));
      expect(nextState).to.equal(List.of(
        Map({ id: '1', name: 'John', x: 123, y: 87 })
      ));
    });

    // it('sets player velocity in the state', () => {
    //   const state = List.of(
    //     Map({ id: '1', name: 'John', vx: 0, vy: 0 })
    //   );
    //   const nextState = onSetVelocity(state, setVelocity('1', 100, 0));
    //   expect(nextState).to.equal(List.of(
    //     Map({ id: '1', name: 'John', vx: 100, vy: 0 })
    //   ));
    // });

    it('sets player animation in the state', () => {
      const state = List.of(
        Map({ id: '1', name: 'John' })
      );
      const nextState = onSetAnimation(state, setAnimation('1', 'runRight'));
      expect(nextState).to.equal(List.of(
        Map({ id: '1', name: 'John', animation: 'runRight' })
      ));
    });

    it('gives points to players in state', () => {
      const state = List.of(
        Map({ type: 'player', id: '1', name: 'John', points: 123 }),
        Map({ type: 'team', id: '50', color: 'blue', hexColor: '#00f', players: List() }),
      );
      const nextState = onGivePoints(state, givePoints('1', 1000));
      expect(nextState).to.equal(List.of(
        Map({ type: 'player', id: '1', name: 'John', points: 1123 }),
        Map({ type: 'team', id: '50', color: 'blue', hexColor: '#00f', players: List() }),
      ));
    });

  });

  describe('flag logic', () => {

    it('tags a flag and sets its color to the players color in the state', () => {
      const state = List.of(
        Map({ type: 'player', id: '1', name: 'John', x: 100, y: 100, color: 'blue', hexColor: '#00f', team: '50' }),
        Map({ type: 'team', id: '50', color: 'blue' }),
        Map({ type: 'team', id: '51', color: 'green', numFlags: 1 }),
        Map({ type: 'flag', id: '99', x: 100, y: 100, color: 'green', team: '51' })
      );
      const nextState = onTagFlag(state, tagFlag('99', '1'));
      expect(nextState).to.equal(List.of(
        Map({ type: 'player', id: '1', name: 'John', x: 100, y: 100, color: 'blue', hexColor: '#00f', team: '50' }),
        Map({ type: 'team', id: '50', color: 'blue', numFlags: 1 }),
        Map({ type: 'team', id: '51', color: 'green', numFlags: 0 }),
        Map({ type: 'flag', id: '99', x: 100, y: 100, color: 'blue', hexColor: '#00f', team: '50' })
      ));
    });

  });

});
