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
  reviveEntity,
  captureFlag,
  advanceTime
} from '../../src/reducers/game';

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


    it('damaging an entity reduces its health in the state', () => {
      const state = Map(Map({
        entities: List.of(
          Map({id: '1', name: 'John', x: 100, y: 100}),
          Map({id: '2', name: 'Jane', vx: 100, vy: 0}),
          Map({id: '3', name: 'Alexia'}),
          Map({id: '4', name: 'Juliette', facing: 'down'}),
          Map({id: '5', name: 'Abe'}),
          Map({id: '6', name: 'Jo', damage: 50}),
          Map({id: '7', name: 'Mary-Ann', health: 100})
        ),
        time: Map({
          elapsed: 123
        })
      }));
      const nextState = damageEntity(state, '6', '7');
      expect(nextState).to.equal(Map({
        entities: List.of(
          Map({id: '1', name: 'John', x: 100, y: 100}),
          Map({id: '2', name: 'Jane', vx: 100, vy: 0}),
          Map({id: '3', name: 'Alexia'}),
          Map({id: '4', name: 'Juliette', facing: 'down'}),
          Map({id: '5', name: 'Abe'}),
          Map({id: '6', name: 'Jo', damage: 50}),
          Map({id: '7', name: 'Mary-Ann', health: 50})
        ),
        time: Map({
          elapsed: 123
        })
      }));
    });

    it('killing an entity marks it as dead and sets its health to zero in the state', () => {
      const state = Map(Map({
        entities: List.of(
          Map({id: '1', name: 'John', x: 100, y: 100, health: 9999}),
          Map({id: '2', name: 'Jane', vx: 100, vy: 0}),
          Map({id: '3', name: 'Alexia'}),
          Map({id: '4', name: 'Juliette', facing: 'down'}),
          Map({id: '5', name: 'Abe'}),
          Map({id: '6', name: 'Jo', damage: 50}),
          Map({id: '7', name: 'Mary-Ann', health: 100})
        ),
        time: Map({
          elapsed: 123
        })
      }));
      const nextState = killEntity(state, '1', false);
      expect(nextState).to.equal(Map({
        entities: List.of(
          Map({id: '1', name: 'John', x: 100, y: 100, health: 0, isDead: true}),
          Map({id: '2', name: 'Jane', vx: 100, vy: 0}),
          Map({id: '3', name: 'Alexia'}),
          Map({id: '4', name: 'Juliette', facing: 'down'}),
          Map({id: '5', name: 'Abe'}),
          Map({id: '6', name: 'Jo', damage: 50}),
          Map({id: '7', name: 'Mary-Ann', health: 100})
        ),
        time: Map({
          elapsed: 123
        })
      }));
    });

    it('reviving an entity marks it as alive and restores its health in the state', () => {
      const state = Map(Map({
        entities: List.of(
          Map({id: '1', name: 'John', x: 100, y: 100}),
          Map({id: '2', name: 'Jane', vx: 100, vy: 0}),
          Map({id: '3', name: 'Alexia'}),
          Map({id: '4', name: 'Juliette', facing: 'down'}),
          Map({id: '5', name: 'Abe'}),
          Map({id: '6', name: 'Jo', health: -20, maxHealth: 100, isDead: true}),
          Map({id: '7', name: 'Mary-Ann', health: 100})

        ),
        time: Map({
          elapsed: 123
        })
      }));
      const nextState = reviveEntity(state, '6');
      expect(nextState).to.equal(Map({
        entities: List.of(
          Map({id: '1', name: 'John', x: 100, y: 100}),
          Map({id: '2', name: 'Jane', vx: 100, vy: 0}),
          Map({id: '3', name: 'Alexia'}),
          Map({id: '4', name: 'Juliette', facing: 'down'}),
          Map({id: '5', name: 'Abe'}),
          Map({id: '6', name: 'Jo', health: 100, maxHealth: 100, isDead: false}),
          Map({id: '7', name: 'Mary-Ann', health: 100})
        ),
        time: Map({
          elapsed: 123
        })
      }));
    });

  });

  describe('player logic', () => {

    it('sets player position in the state', () => {
      const state = Map(Map({
        entities: List.of(
          Map({id: '1', name: 'John', x: 100, y: 100}),
          Map({id: '2', name: 'Jane', vx: 0, vy: 0}),
          Map({id: '3', name: 'Alexia'}),
          Map({id: '4', name: 'Juliette', facing: 'none'}),
          Map({id: '5', name: 'Abe'}),
          Map({id: '6', name: 'Jo', isAttacking: true})
        ),
        time: Map({
          elapsed: 123
        })
      }));
      const nextState = setPosition(state, '1', 123, 87);
      expect(nextState).to.equal(Map({
        entities: List.of(
          Map({id: '1', name: 'John', x: 123, y: 87}),
          Map({id: '2', name: 'Jane', vx: 0, vy: 0}),
          Map({id: '3', name: 'Alexia'}),
          Map({id: '4', name: 'Juliette', facing: 'none'}),
          Map({id: '5', name: 'Abe'}),
          Map({id: '6', name: 'Jo', isAttacking: true})
        ),
        time: Map({
          elapsed: 123
        })
      }));
    });

    it('sets player velocity in the state', () => {
      const state = Map(Map({
        entities: List.of(
          Map({id: '1', name: 'John', x: 100, y: 100}),
          Map({id: '2', name: 'Jane', vx: 0, vy: 0}),
          Map({id: '3', name: 'Alexia'}),
          Map({id: '4', name: 'Juliette', facing: 'none'}),
          Map({id: '5', name: 'Abe'}),
          Map({id: '6', name: 'Jo', isAttacking: true})
        ),
        time: Map({
          elapsed: 123
        })
      }));
      const nextState = setVelocity(state, '2', 100, 0);
      expect(nextState).to.equal(Map({
        entities: List.of(
          Map({id: '1', name: 'John', x: 100, y: 100}),
          Map({id: '2', name: 'Jane', vx: 100, vy: 0}),
          Map({id: '3', name: 'Alexia'}),
          Map({id: '4', name: 'Juliette', facing: 'none'}),
          Map({id: '5', name: 'Abe'}),
          Map({id: '6', name: 'Jo', isAttacking: true})
        ),
        time: Map({
          elapsed: 123
        })
      }));
    });

    it('sets player animation in the state', () => {
      const state = Map(Map({
        entities: List.of(
          Map({id: '1', name: 'John', x: 100, y: 100}),
          Map({id: '2', name: 'Jane', vx: 100, vy: 0}),
          Map({id: '3', name: 'Alexia'}),
          Map({id: '4', name: 'Juliette', facing: 'none'}),
          Map({id: '5', name: 'Abe'}),
          Map({id: '6', name: 'Jo', isAttacking: true})
        ),
        time: Map({
          elapsed: 123
        })
      }));
      const nextState = setAnimation(state, '3', 'runRight');
      expect(nextState).to.equal(Map({
        entities: List.of(
          Map({id: '1', name: 'John', x: 100, y: 100}),
          Map({id: '2', name: 'Jane', vx: 100, vy: 0}),
          Map({id: '3', name: 'Alexia', animation: 'runRight'}),
          Map({id: '4', name: 'Juliette', facing: 'none'}),
          Map({id: '5', name: 'Abe'}),
          Map({id: '6', name: 'Jo', isAttacking: true})
        ),
        time: Map({
          elapsed: 123
        })
      }));
    });

    it('sets player facing in the state', () => {
      const state = Map(Map({
        entities: List.of(
          Map({id: '1', name: 'John', x: 100, y: 100}),
          Map({id: '2', name: 'Jane', vx: 100, vy: 0}),
          Map({id: '3', name: 'Alexia'}),
          Map({id: '4', name: 'Juliette', facing: 'none'}),
          Map({id: '5', name: 'Abe'}),
          Map({id: '6', name: 'Jo', isAttacking: true})
        ),
        time: Map({
          elapsed: 123
        })
      }));
      const nextState = setFacing(state, '4', 'down');
      expect(nextState).to.equal(Map({
        entities: List.of(
          Map({id: '1', name: 'John', x: 100, y: 100}),
          Map({id: '2', name: 'Jane', vx: 100, vy: 0}),
          Map({id: '3', name: 'Alexia'}),
          Map({id: '4', name: 'Juliette', facing: 'down'}),
          Map({id: '5', name: 'Abe'}),
          Map({id: '6', name: 'Jo', isAttacking: true})
        ),
        time: Map({
          elapsed: 123
        })
      }));
    });

    it('sets player as attacking in the state', () => {
      const state = Map(Map({
        entities: List.of(
          Map({id: '1', name: 'John', x: 100, y: 100}),
          Map({id: '2', name: 'Jane', vx: 100, vy: 0}),
          Map({id: '3', name: 'Alexia'}),
          Map({id: '4', name: 'Juliette', facing: 'down'}),
          Map({id: '5', name: 'Abe'}),
          Map({id: '6', name: 'Jo', isAttacking: true})
        ),
        time: Map({
          elapsed: 123
        })
      }));
      const nextState = setIsAttacking(state, '5', true);
      expect(nextState).to.equal(Map({
        entities: List.of(
          Map({id: '1', name: 'John', x: 100, y: 100}),
          Map({id: '2', name: 'Jane', vx: 100, vy: 0}),
          Map({id: '3', name: 'Alexia'}),
          Map({id: '4', name: 'Juliette', facing: 'down'}),
          Map({id: '5', name: 'Abe', isAttacking: true}),
          Map({id: '6', name: 'Jo', isAttacking: true})
        ),
        time: Map({
          elapsed: 123
        })
      }));

    });

    it('sets player as not attacking in the state', () => {
      const state = Map(Map({
        entities: List.of(
          Map({id: '1', name: 'John', x: 100, y: 100}),
          Map({id: '2', name: 'Jane', vx: 100, vy: 0}),
          Map({id: '3', name: 'Alexia'}),
          Map({id: '4', name: 'Juliette', facing: 'down'}),
          Map({id: '5', name: 'Abe'}),
          Map({id: '6', name: 'Jo', isAttacking: true})
        ),
        time: Map({
          elapsed: 123
        })
      }));
      const nextState = setIsAttacking(state, '6', false);
      expect(nextState).to.equal(Map({
        entities: List.of(
          Map({id: '1', name: 'John', x: 100, y: 100}),
          Map({id: '2', name: 'Jane', vx: 100, vy: 0}),
          Map({id: '3', name: 'Alexia'}),
          Map({id: '4', name: 'Juliette', facing: 'down'}),
          Map({id: '5', name: 'Abe'}),
          Map({id: '6', name: 'Jo', isAttacking: false})
        ),
        time: Map({
          elapsed: 123
        })
      }));
    });

  });

  describe('flag logic', () => {

    it('sets the flag color to the players color when it is captured', () => {
      const state = Map({
        entities: List.of(
          Map({type: 'player', id: '1', name: 'John', x: 100, y: 100, color: 'blue'}),
          Map({type: 'flag', id: '99', x: 100, y: 100, color: 'neutral'})
        ),
        time: Map({
          elapsed: 321
        })
      });
      const nextState = captureFlag(state, '99', '1');
      expect(nextState).to.equal(Map({
        entities: List.of(
          Map({type: 'player', id: '1', name: 'John', x: 100, y: 100, color: 'blue'}),
          Map({type: 'flag', id: '99', x: 100, y: 100, color: 'blue'})
        ),
        time: Map({
          elapsed: 321
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
