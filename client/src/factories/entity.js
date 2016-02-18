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
import { isEntityMoving } from '../helpers/game';
import {
  CONTEXT_SERVER,
  setPosition,
  setVelocity,
  setAnimation,
  setFacing,
  startAttacking,
  damageEntity,
  captureFlag
} from '../actions/game';

const RUN_SPEED = 500;

/**
 *
 * @param {Phaser.State} state
 * @param {Object} props
 * @returns {Entity}
 */
export function createLocalPlayer(state, props) {
  const entity = new Entity(props);

  const walls = state.getLayer('Walls');
  const knights = state.getGroup('knights');
  const flags = state.getGroup('flags');
  const attacks = state.getGroup('attacks');

  const knight = createSprite(state, null, props);

  state.physics.arcade.enable(knight);
  state.camera.follow(knight);

  knight.body.collideWorldBounds = true;

  const cursors = state.input.keyboard.createCursorKeys();
  const attack = state.input.keyboard.addKey(Keyboard.SPACEBAR);

  const onInputUpdate = function(props, dispatch) {
    const cursors = this.getKey('cursors');
    const attack = this.getKey('attack');
    const knight = this.getComponent('sprite').getSprite('knight');
    const hit = this.getComponent('sound').getSound('hit');
    const isAttacking = attack.isDown;

    if (isAttacking) {
      dispatch(startAttacking(props.id));
    }

    if (cursors.left.isDown) {
      dispatch(setVelocity(props.id, -RUN_SPEED, 0));
      dispatch(setAnimation(props.id, isAttacking ? 'attackLeft' : 'runLeft'));
      dispatch(setFacing(props.id, 'left'));
    } else if (cursors.right.isDown) {
      dispatch(setVelocity(props.id, RUN_SPEED, 0));
      dispatch(setAnimation(props.id, isAttacking ? 'attackRight' : 'runRight'));
      dispatch(setFacing(props.id, 'right'));
    } else if (cursors.up.isDown) {
      dispatch(setVelocity(props.id, 0, -RUN_SPEED));
      dispatch(setAnimation(props.id, isAttacking ? 'attackUp' : 'runUp'));
      dispatch(setFacing(props.id, 'up'));
    } else if (cursors.down.isDown) {
      dispatch(setVelocity(props.id, 0, RUN_SPEED));
      dispatch(setAnimation(props.id, isAttacking ? 'attackDown' : 'runDown'));
      dispatch(setFacing(props.id, 'down'));
    } else if (!isEntityMoving(props)) {
      dispatch(setVelocity(props.id, 0, 0));
      dispatch(setAnimation(props.id, 'idle'));
      dispatch(setFacing(props.id, 'none'));
    }
  };

  entity.addComponent(new Input({cursors, attack}, onInputUpdate));

  const onSpriteUpdate = function(props, dispatch) {
    const knight = this.getSprite('knight');

    state.physics.arcade.collide(knight, walls);

    state.physics.arcade.collide(knight, flags, null/* collideCallback */, (knight, flag) => {
      dispatch(captureFlag(props.id, flag.name));
      return false; // allows passing through flags
    }/* processCallback */);

    knight.body.velocity.set(0);

    if (props.vx) {
      knight.body.velocity.x = props.vx;
    } else if (props.vy) {
      knight.body.velocity.y = props.vy;
    }

    if (props.animation) {
      knight.animations.play(props.animation);
    }

    if (knight.x !== props.x || knight.y !== props.y) {
      dispatch(setPosition(props.id, knight.x, knight.y, CONTEXT_SERVER));
    }

    // state.game.debug.body(knight);
  };

  entity.addComponent(new Sprite({knight}, onSpriteUpdate));

  const hit = state.add.audio('knight-hit', 0.1);
  const die = state.add.audio('knight-die', 0.1);

  entity.addComponent(new Sound({hit, die}));

  for(let i = 0; i < 20; i++) {
    let a = createSprite(state, attacks, {type: 'attack'});
    a.name = `attack${i}`;
    a.exists = false;
    a.visibile = false;
  }

  const onAttackUpdate = function(props, dispatch) {
    if (props.isAttacking) {
      const attack = this.getAttack();
      const knight = this.getComponent('sprite').getSprite('knight');

      if (attack) {
        const target = this.calculateAttackTarget(attack, props);

        attack.reset(target.x, target.y);

        state.physics.arcade.collide(attack, knights, null/* collideCallback */, (attack, knight) => {
          dispatch(damageEntity(props.id, knight.name));
          return false; // allows passing through attacks
        });

        state.game.debug.body(attack);

        setTimeout(() => { attack.kill(); }, 100);
      }
    }
  };

  entity.addComponent(new Attack(attacks, onAttackUpdate));

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

  const knights = state.getGroup('knights');

  const knight = createSprite(state, knights, props);

  const onSpriteUpdate = function(props, dispatch) {
    const knight = this.getSprite('knight');

    knight.x = props.x;
    knight.y = props.y;

    if (props.animation) {
      knight.animations.play(props.animation);
    }

    // const name = this.getComponent('text').getText('name');

    // name.x = props.x + (props.width / 2);
    // name.y = props.y;

    // state.game.debug.body(knight);
  };

  entity.addComponent(new Sprite({knight}, onSpriteUpdate));

  const hit = state.add.audio('knight-hit', 0.1);
  const die = state.add.audio('knight-die', 0.1);

  entity.addComponent(new Sound({hit, die}));

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

  const flags = state.getGroup('flags');
  const knights = state.getGroup('knights');

  const flag = createSprite(state, flags, props);

  const onSpriteUpdate = function(props, dispatch) {
    const flag = this.getSprite('flag');

    if (props.color !== this.getProp('color')) {
      flag.animations.play(props.color);
      this.setProp('color', props.color);
    }
  };

  entity.addComponent(new Sprite({flag: flag}, onSpriteUpdate));

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
