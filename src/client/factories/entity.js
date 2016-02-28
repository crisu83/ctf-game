/*eslint no-unused-vars: 0*/
/*eslint no-shadow: 0*/

import { get, now } from 'lodash';
import { Keyboard } from 'phaser';
import Entity from 'shared/game/entity';
import InputComponent from '../game/components/input';
import SpriteComponent from '../game/components/sprite';
import TextComponent from '../game/components/text';
import SoundComponent from '../game/components/sound';
import AttackComponent from '../game/components/attack';
import { createSprite } from './sprite';
import { createNameTag } from './text';
import { resolveActionAnimation } from '../helpers/game';
import { setPosition } from 'shared/actions/entity';
import {
  setVelocity,
  resetVelocity,
  setAnimation,
  setFacing,
  resetFacing,
  beginAttack,
  endAttack,
  damageEntity,
  tagFlag
} from '../actions/entity';
import { ContextTypes, SOUND_VOLUME } from '../constants';
import { EntityTypes, FacingDirections } from 'shared/constants';

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

  const onInputComponentUpdate = function(updateProps, dispatch) {
    const cursors = this.getKey('cursors');
    const attack = this.getKey('attack');
    const sprint = this.getKey('sprint');

    const attackComponent = this.getComponent('attack');

    if (attack.isDown && attackComponent.canAttack()) {
      dispatch(beginAttack(updateProps.id));
    }

    const velocity = sprint.isDown ? updateProps.runSpeed * 1.5 : updateProps.runSpeed;

    if (cursors.left.isDown) {
      dispatch(setVelocity(updateProps.id, -velocity, 0));
      dispatch(setFacing(updateProps.id, FacingDirections.LEFT));
    } else if (cursors.up.isDown) {
      dispatch(setVelocity(updateProps.id, 0, -velocity));
      dispatch(setFacing(updateProps.id, FacingDirections.UP));
    } else if (cursors.right.isDown) {
      dispatch(setVelocity(updateProps.id, velocity, 0));
      dispatch(setFacing(updateProps.id, FacingDirections.RIGHT));
    } else if (cursors.down.isDown) {
      dispatch(setVelocity(updateProps.id, 0, velocity));
      dispatch(setFacing(updateProps.id, FacingDirections.DOWN));
    } else {
      dispatch(resetVelocity(updateProps.id));
      dispatch(resetFacing(updateProps.id));
    }
  };

  entity.addComponent(new InputComponent({ cursors: cursorKeys, attack: attackKey, sprint: sprintKey }, onInputComponentUpdate));

  const knightSprite = createSprite(state, null, props);
  const graveSprite = createSprite(state, rootGroup, { type: 'grave' });

  // Add the player to the root group so that it's rendered in the correct order.
  rootGroup.add(knightSprite);

  state.physics.arcade.enable(knightSprite);
  state.camera.follow(knightSprite);

  knightSprite.body.collideWorldBounds = true;

  const onSpriteComponentUpdate = function(updateProps, dispatch) {
    const knight = this.getSprite('knight');
    const grave = this.getSprite('grave');

    state.physics.arcade.collide(knight, wallLayer);

    state.physics.arcade.collide(knight, flagGroup, null/* collideCallback */, (knight, flag) => {
      dispatch(tagFlag(flag.name, updateProps.id));
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
      dispatch(setAnimation(updateProps.id, animation));
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

    if (knight.x !== updateProps.x || knight.y !== updateProps.y) {
      if (updateProps.isReviving) {
        knight.x = updateProps.x;
        knight.y = updateProps.y;
      } else if (!updateProps.isDead) {
        dispatch(setPosition(updateProps.id, knight.x, knight.y, ContextTypes.SERVER));
      }
    }
  };

  entity.addComponent(new SpriteComponent({ knight: knightSprite, grave: graveSprite }, onSpriteComponentUpdate));

  const hitSound = state.add.audio('knight-hit', SOUND_VOLUME);
  const dieSound = state.add.audio('knight-die', SOUND_VOLUME);

  entity.addComponent(new SoundComponent({ hit: hitSound, die: dieSound }));

  for (let i = 0; i < 20; i++) {
    createSprite(state, attackGroup, { type: 'attack' });
  }

  const onAttackComponentUpdate = function(updateProps, dispatch) {
    if (!updateProps.isDead && updateProps.isAttacking && this.canAttack()) {
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

  entity.addComponent(new AttackComponent(attackGroup, onAttackComponentUpdate));

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

  const onSpriteComponentUpdate = function(updateProps) {
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

  entity.addComponent(new SpriteComponent({ knight: knightSprite, grave: graveSprite }, onSpriteComponentUpdate));

  const hitSound = state.add.audio('knight-hit', SOUND_VOLUME);
  const dieSound = state.add.audio('knight-die', SOUND_VOLUME);

  entity.addComponent(new SoundComponent({ hit: hitSound, die: dieSound }));

  const nameText = createNameTag(state, props);
  entity.addComponent(new TextComponent({ name: nameText }));

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

  const onSpriteComponentUpdate = function(updateProps) {
    const flag = this.getSprite('flag');

    if (updateProps.color !== this.getProp('color')) {
      flag.animations.play(updateProps.color);
    }
  };

  entity.addComponent(new SpriteComponent({ flag: flagSprite }, onSpriteComponentUpdate));

  return entity;
}

/**
 * @param {Phaser.State} state
 * @param {Object} props
 * @returns {Entity}
 */
export function createEntity(state, props) {
  switch (props.type) {
    case EntityTypes.PLAYER:
      return createRemotePlayer(state, props);

    case EntityTypes.FLAG:
      return createFlag(state, props);

    default:
      return null;
  }
}
