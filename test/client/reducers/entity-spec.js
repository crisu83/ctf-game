import { expect } from 'chai';
import { Map, List } from 'immutable';
import {
  updateState,
  setPosition,
  setVelocity,
  setFacing,
  setAnimation,
  beginAttack,
  endAttack
} from '../../../src/client/actions/entity';
import {
  onUpdateState,
  onSetVelocity,
  onSetFacing,
  onBeginAttack,
  onEndAttack
} from '../../../src/client/handlers/entity';
import {
  onSetPosition,
  onSetAnimation
} from '../../../src/shared/handlers/entity';

describe('client entity logic', () => {

  it('state is updated correctly', () => {
    const state = List.of(
      Map({ id: '1', name: 'John', vx: 100, vy: 0, isAttacking: true, facing: 'right' })
    );
    const newState = [
      { id: '1', name: 'John' }
    ];
    const nextState = onUpdateState(state, updateState(newState, '1'));
    expect(nextState).to.equal(List.of(
      Map({ id: '1', name: 'John', vx: 100, vy: 0, isAttacking: true, facing: 'right' })
    ));
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

    it('sets player velocity in the state', () => {
      const state = List.of(
        Map({ id: '2', name: 'Jane', vx: 0, vy: 0 })
      );
      const nextState = onSetVelocity(state, setVelocity('2', 100, 0));
      expect(nextState).to.equal(List.of(
        Map({ id: '2', name: 'Jane', vx: 100, vy: 0 })
      ));
    });

    it('sets player facing in the state', () => {
      const state = List.of(
        Map({ id: '1', name: 'John' })
      );
      const nextState = onSetFacing(state, setFacing('1', 'down'));
      expect(nextState).to.equal(List.of(
        Map({ id: '1', name: 'John', facing: 'down' }),
      ));
    });

    it('sets player animation in the state', () => {
      const state = List.of(
        Map({ id: '3', name: 'Alexia' })
      );
      const nextState = onSetAnimation(state, setAnimation('3', 'runRight'));
      expect(nextState).to.equal(List.of(
        Map({ id: '3', name: 'Alexia', animation: 'runRight' })
      ));
    });

    it('sets player as attacking in the state', () => {
      const state = List.of(
        Map({ id: '1', name: 'John' })
      );
      const nextState = onBeginAttack(state, beginAttack('1'));
      expect(nextState).to.equal(List.of(
        Map({ id: '1', name: 'John', isAttacking: true })
      ));
    });

    it('sets player as not attacking in the state', () => {
      const state = List.of(
        Map({ id: '1', name: 'John', isAttacking: true })
      );
      const nextState = onEndAttack(state, endAttack('1'));
      expect(nextState).to.equal(List.of(
        Map({ id: '1', name: 'John', isAttacking: false })
      ));
    });

  });

});
