import { Physics, Keyboard } from 'phaser';
import { has } from 'lodash';
import Entity from '../game/entity';
import Input from '../game/components/input';
import Sprite from '../game/components/sprite';
import Text from '../game/components/text';
import Sound from '../game/components/sound';
import Attack from '../game/components/attack';
import { createSprite } from './sprite';
import { createNameTag } from './text';
import { isEntityMoving, resolveActionAnimation } from '../helpers/game';
import {
  CONTEXT_SERVER,
  setPosition,
  setVelocity,
  setAnimation,
  setFacing,
  performAttack,
  damageEntity,
  captureFlag
} from '../actions/game';

/**
 *
 * @param {Phaser.State} state
 * @param {Object} props
 * @returns {Entity}
 */
export function createLocalPlayer(state, props) {
  const entity = new Entity(props);

  const wallLayer = state.getLayer('Walls');
  const knightGroup = state.getGroup('knights');
  const flagGroup = state.getGroup('flags');
  const attackGroup = state.getGroup('attacks');

  const knightSprite = createSprite(state, null, props);

  // Add the player to the root group so that it's rendered in the correct order.
  state.getGroup('root').add(knightSprite);

  state.physics.arcade.enable(knightSprite);
  state.camera.follow(knightSprite);

  knightSprite.body.collideWorldBounds = true;

  const cursorKeys = state.input.keyboard.createCursorKeys();
  const attackKey = state.input.keyboard.addKey(Keyboard.SPACEBAR);

  const onInputUpdate = function(props, dispatch) {
    const cursorKeys = this.getKey('cursors');
    const attackKey = this.getKey('attack');
    const attackComponent = this.getComponent('attack');

    if (attackKey.isDown && attackComponent.canAttack()) {
      dispatch(performAttack(props.id));
    }

    if (cursorKeys.left.isDown) {
      dispatch(setVelocity(props.id, -props.runSpeed, 0));
      dispatch(setFacing(props.id, 'left'));
    } else if (cursorKeys.right.isDown) {
      dispatch(setVelocity(props.id, props.runSpeed, 0));
      dispatch(setFacing(props.id, 'right'));
    } else if (cursorKeys.up.isDown) {
      dispatch(setVelocity(props.id, 0, -props.runSpeed));
      dispatch(setFacing(props.id, 'up'));
    } else if (cursorKeys.down.isDown) {
      dispatch(setVelocity(props.id, 0, props.runSpeed));
      dispatch(setFacing(props.id, 'down'));
    } else if (!isEntityMoving(props)) {
      dispatch(setVelocity(props.id, 0, 0));
      dispatch(setFacing(props.id, null));
    }
  };

  entity.addComponent(new Input({cursors: cursorKeys, attack: attackKey}, onInputUpdate));

  const onSpriteUpdate = function(props, dispatch) {
    const knightSprite = this.getSprite('knight');

    state.physics.arcade.collide(knightSprite, wallLayer);

    state.physics.arcade.collide(knightSprite, flagGroup, null/* collideCallback */, (knight, flag) => {
      dispatch(captureFlag(props.id, flag.name));
      return false; // allows passing through flags
    }/* processCallback */);

    knightSprite.body.velocity.set(0);

    if (props.vx) {
      knightSprite.body.velocity.x = props.vx;
    } else if (props.vy) {
      knightSprite.body.velocity.y = props.vy;
    }

    const animation = props.facing
      ? resolveActionAnimation(props.isAttacking ? 'attack' : 'run', props.facing)
      : 'idle';
    knightSprite.animations.play(animation);
    dispatch(setAnimation(props.id, animation));

    if (knightSprite.x !== props.x || knightSprite.y !== props.y) {
      dispatch(setPosition(props.id, knightSprite.x, knightSprite.y, CONTEXT_SERVER));
    }

    // state.game.debug.body(knight);
  };

  entity.addComponent(new Sprite({knight: knightSprite}, onSpriteUpdate));

  const hitSound = state.add.audio('knight-hit', 0.1);
  const dieSound = state.add.audio('knight-die', 0.1);

  entity.addComponent(new Sound({hit: hitSound, die: dieSound}));

  for(let i = 0; i < 20; i++) {
    let a = createSprite(state, attackGroup, {type: 'attack'});
    a.name = `attack${i}`;
    a.exists = false;
    a.visibile = false;
  }

  const onAttackUpdate = function(props, dispatch) {
    if (props.isAttacking && this.canAttack()) {
      const attackSprite = this.getAttackSprite();

      if (attackSprite) {
        const { x, y } = this.calculateAttackTarget(attackSprite, props);

        attackSprite.reset(x, y);

        state.physics.arcade.collide(attackSprite, knightGroup, null/* collideCallback */, (attack, knight) => {
          dispatch(damageEntity(props.id, knight.name));
          return false; // allows passing through attacks
        });

        setTimeout(() => {
          attackSprite.kill();
        }, 100);

        // state.game.debug.body(attack);
      }
    }
  };

  entity.addComponent(new Attack(attackGroup, onAttackUpdate));

  // TODO: Fix name tag positioning
  // const name = createNameTag(game, props);
  // const onTextUpdate = function(props, dispatch) {
  //   const name = this.getText('name');
  //   const knight = this.getComponent('sprite').getSprite('knight');
  //   name.x = knight.x + (knight.width / 2);
  //   name.y = knight.y;
  // };
  // entity.addComponent(new Text({name}, onTextUpdate));

  return entity;
}

/**
 *
 * @param {Phaser.State} state
 * @param {Object} props
 * @returns {Entity}
 */
function createRemotePlayer(state, props) {
  const entity = new Entity(props);

  const knightGroup = state.getGroup('knights');

  const knightSprite = createSprite(state, knightGroup, props);

  const onSpriteUpdate = function(props, dispatch) {
    const knightSprite = this.getSprite('knight');

    knightSprite.x = props.x;
    knightSprite.y = props.y;

    if (props.animation) {
      knightSprite.animations.play(props.animation);
    }

    // const name = this.getComponent('text').getText('name');

    // name.x = props.x + (props.width / 2);
    // name.y = props.y;

    // state.game.debug.body(knight);
  };

  entity.addComponent(new Sprite({knight: knightSprite}, onSpriteUpdate));

  const hitSound = state.add.audio('knight-hit', 0.1);
  const dieSound = state.add.audio('knight-die', 0.1);

  entity.addComponent(new Sound({hit: hitSound, die: dieSound}));

  // const name = createNameTag(game, props);
  // entity.addComponent(new Text({name}));

  return entity;
}

/**
 *
 * @param {Phaser.State} state
 * @param {Object} props
 * @returns {Entity}
 */
function createFlag(state, props) {
  const entity = new Entity(props);

  const flagGroup = state.getGroup('flags');

  const flagSprite = createSprite(state, flagGroup, props);

  const onSpriteUpdate = function(props, dispatch) {
    const flagSprite = this.getSprite('flag');

    if (props.color !== this.getProp('color')) {
      flagSprite.animations.play(props.color);
      this.setProp('color', props.color);
    }
  };

  entity.addComponent(new Sprite({flag: flagSprite}, onSpriteUpdate));

  return entity;
}

/**
 * @param {Phaser.State} state
 * @param {Object} props
 * @returns {Entity}
 */
export function createEntity(state, props) {
  switch (props.type) {
    case 'player':
      return createRemotePlayer(state, props);

    case 'flag':
      return createFlag(state, props);

    default:
      console.warn(`trying to create unknown entity ${key}`);
      return null;
  }
}
