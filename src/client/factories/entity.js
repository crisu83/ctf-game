/*eslint no-unused-vars: 0*/
/*eslint no-shadow: 0*/

import { get, now } from 'lodash';
import { Keyboard } from 'phaser';
import Entity from 'shared/game/entity';
import Input from '../game/components/input';
import Sprite from '../game/components/sprite';
import Text from '../game/components/text';
import Sound from '../game/components/sound';
import Attack from '../game/components/attack';
import Health from '../game/components/health';
import { createSprite } from './sprite';
import { createNameTag } from './text';
import { isEntityMoving, resolveActionAnimation } from '../helpers/game';
import {
  CONTEXT_SERVER,
  setPosition,
  setVelocity,
  setAnimation,
  setFacing,
  beginAttack,
  endAttack,
  damageEntity,
  tagFlag
} from '../actions/game';

const SOUND_VOLUME = 0.03;

/**
 *
 * @param {Phaser.State} state
 * @param {Object} props
 * @returns {Entity}
 */
export function createLocalPlayer(state, props) {
  const entity = new Entity(props);

  const wallLayer = state.getLayer('Walls');
  const rootGroup = state.getGroup('root');
  const knightGroup = state.getGroup('knights');
  const flagGroup = state.getGroup('flags');
  const attackGroup = state.getGroup('attacks');

  const cursorKeys = state.input.keyboard.createCursorKeys();
  const attackKey = state.input.keyboard.addKey(Keyboard.SPACEBAR);
  const sprintKey = state.input.keyboard.addKey(Keyboard.SHIFT);

  const onInputUpdate = function(updateProps, dispatch) {
    const cursors = this.getKey('cursors');
    const attack = this.getKey('attack');
    const sprint = this.getKey('sprint');

    const attackComponent = this.getComponent('attack');

    if (attack.isDown && attackComponent.canAttack()) {
      dispatch(beginAttack(updateProps.id));
    }

    const velocity = sprint.isDown ? updateProps.runSpeed * 1.5 : updateProps.runSpeed;

    // TODO: Add constants for facing directions to game/actions.

    if (cursors.left.isDown) {
      dispatch(setVelocity(updateProps.id, -velocity, 0));
      dispatch(setFacing(updateProps.id, 'left'));
    } else if (cursors.right.isDown) {
      dispatch(setVelocity(updateProps.id, velocity, 0));
      dispatch(setFacing(updateProps.id, 'right'));
    } else if (cursors.up.isDown) {
      dispatch(setVelocity(updateProps.id, 0, -velocity));
      dispatch(setFacing(updateProps.id, 'up'));
    } else if (cursors.down.isDown) {
      dispatch(setVelocity(updateProps.id, 0, velocity));
      dispatch(setFacing(updateProps.id, 'down'));
    } else if (!isEntityMoving(updateProps)) {
      dispatch(setVelocity(updateProps.id, 0, 0));
      dispatch(setFacing(updateProps.id, null));
    }
  };

  entity.addComponent(new Input({ cursors: cursorKeys, attack: attackKey, sprint: sprintKey }, onInputUpdate));

  const knightSprite = createSprite(state, null, props);
  const graveSprite = createSprite(state, rootGroup, { type: 'grave' });

  // Add the player to the root group so that it's rendered in the correct order.
  rootGroup.add(knightSprite);

  state.physics.arcade.enable(knightSprite);
  state.camera.follow(knightSprite);

  knightSprite.body.collideWorldBounds = true;

  const onSpriteUpdate = function(updateProps, dispatch) {
    const knight = this.getSprite('knight');
    const grave = this.getSprite('grave');

    state.physics.arcade.collide(knight, wallLayer);

    state.physics.arcade.collide(knight, flagGroup, null/* collideCallback */, (knight, flag) => {
      dispatch(tagFlag(updateProps.id, flag.name));
      return false; // allows passing through flags
    }/* processCallback */);

    knight.body.velocity.set(0);

    if (updateProps.vx) {
      knight.body.velocity.x = updateProps.vx;
    } else if (updateProps.vy) {
      knight.body.velocity.y = updateProps.vy;
    }

    // TODO: Clean up code related to determining the current animation.

    const animation = resolveActionAnimation(updateProps.isAttacking ? 'attack' : 'run', updateProps.facing);
    const currentAnimation = get(knight, 'animations.currentAnim.name');

    if (animation && animation !== currentAnimation) {
      knight.animations.play(animation);
      dispatch(setAnimation(updateProps.id, animation, CONTEXT_SERVER));
    }

    if (updateProps.isDead && knight.alive) {
      const dieSound = this.getComponent('sound').getSound('die');
      knight.kill();
      grave.reset(updateProps.x, updateProps.y);
      dieSound.play();
    } else if (!updateProps.isDead && !knight.alive) {
      grave.kill();
      knight.revive();
    }

    if (!updateProps.isDead && knight.x !== updateProps.x || knight.y !== updateProps.y) {
      if (!updateProps.isReviving) {
        dispatch(setPosition(updateProps.id, knight.x, knight.y, CONTEXT_SERVER));
      } else {
        knight.x = updateProps.x;
        knight.y = updateProps.y;
      }
    }

    // const nameText = this.getComponent('text').getText('name');
    //
    // nameText.x = knightSprite.x + (knightSprite.width / 2);
    // nameText.y = knightSprite.y;

    // state.game.debug.body(knightSprite);
  };

  entity.addComponent(new Sprite({ knight: knightSprite, grave: graveSprite }, onSpriteUpdate));

  const hitSound = state.add.audio('knight-hit', SOUND_VOLUME);
  const dieSound = state.add.audio('knight-die', SOUND_VOLUME);

  entity.addComponent(new Sound({ hit: hitSound, die: dieSound }));

  for (let i = 0; i < 20; i++) {
    createSprite(state, attackGroup, { type: 'attack' });
  }

  const onAttackUpdate = function(updateProps, dispatch) {
    if (updateProps.isAttacking && this.canAttack()) {
      const attack = this.getAttackSprite();

      if (attack) {
        const hit = this.getComponent('sound').getSound('hit');
        const { x, y } = this.calculateAttackTarget(attack, updateProps);

        attack.reset(x, y);
        hit.play();
        
        state.physics.arcade.collide(attack, knightGroup, null/* collideCallback */, (attack, knight) => {
          dispatch(damageEntity(updateProps.id, knight.name));
          return false; // allows passing through attacks
        });

        attack.kill();
        
        this.attackPerformed();

        setTimeout(() => {
          dispatch(endAttack(updateProps.id));
        }, 100);

        // state.game.debug.body(attack);
      }
    }
  };

  entity.addComponent(new Attack(attackGroup, onAttackUpdate));

  const onHealthUpdate = function(props) {

  };

  entity.addComponent(new Health(onHealthUpdate));

  // TODO: Fix name tag positioning
  // const nameText = createNameTag(state, props);
  // entity.addComponent(new Text({name: nameText}));

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

  const rootGroup = state.getGroup('root');
  const knightGroup = state.getGroup('knights');

  const knightSprite = createSprite(state, knightGroup, props);
  const graveSprite = createSprite(state, rootGroup, { type: 'grave' });

  const onSpriteUpdate = function(updateProps) {
    const knight = this.getSprite('knight');
    const grave = this.getSprite('grave');

    knight.x = updateProps.x;
    knight.y = updateProps.y;

    const currentAnimation = get(knight, 'animations.currentAnim.name');

    // TODO: Ensure that this works as intended.

    if (updateProps.animation && updateProps.animation !== currentAnimation) {
      knight.animations.play(updateProps.animation);
    }

    if (updateProps.isDead && knight.alive) {
      const dieSound = this.getComponent('sound').getSound('die');
      knight.kill();
      grave.reset(updateProps.x, updateProps.y);
      dieSound.play();
    } else if (!updateProps.isDead && !knight.alive) {
      grave.kill();
      knight.revive();
    }

    const name = this.getComponent('text').getText('name');

    name.x = knight.x + (knight.width / 2);
    name.y = knight.y;

    // state.game.debug.body(knight);
  };

  entity.addComponent(new Sprite({ knight: knightSprite, grave: graveSprite }, onSpriteUpdate));

  const hitSound = state.add.audio('knight-hit', SOUND_VOLUME);
  const dieSound = state.add.audio('knight-die', SOUND_VOLUME);

  entity.addComponent(new Sound({ hit: hitSound, die: dieSound }));

  const nameText = createNameTag(state, props);
  entity.addComponent(new Text({ name: nameText }));

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

  const onSpriteUpdate = function(updateProps) {
    const flag = this.getSprite('flag');

    if (updateProps.color !== this.getProp('color')) {
      flag.animations.play(updateProps.color);
    }
  };

  entity.addComponent(new Sprite({ flag: flagSprite }, onSpriteUpdate));

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
      return null;
  }
}
