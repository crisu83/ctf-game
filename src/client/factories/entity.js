import { Physics, Keyboard } from 'phaser';
import { has } from 'lodash';
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
  performAttack,
  resetAttack,
  damageEntity,
  captureFlag
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

  const knightSprite = createSprite(state, null, props);
  const graveSprite = createSprite(state, rootGroup, {type: 'grave'});

  // Add the player to the root group so that it's rendered in the correct order.
  rootGroup.add(knightSprite);

  state.physics.arcade.enable(knightSprite);
  state.camera.follow(knightSprite);

  knightSprite.body.collideWorldBounds = true;

  const onSpriteUpdate = function(props, dispatch) {
    const knightSprite = this.getSprite('knight');
    const graveSprite = this.getSprite('grave');

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

    const animation = resolveActionAnimation(props.isAttacking ? 'attack' : 'run', props.facing);
    knightSprite.animations.play(animation, 15);
    dispatch(setAnimation(props.id, animation));

    if (!props.isDead && (knightSprite.x !== props.x || knightSprite.y !== props.y)) {
      dispatch(setPosition(props.id, knightSprite.x, knightSprite.y, CONTEXT_SERVER));
    }

    if (props.isDead && knightSprite.alive) {
      const dieSound = this.getComponent('sound').getSound('die');
      knightSprite.kill();
      graveSprite.reset(props.x, props.y);
      dieSound.play();
    } else if (!props.isDead && !knightSprite.alive) {
      graveSprite.kill();
      knightSprite.revive();
    }

    // const nameText = this.getComponent('text').getText('name');
    //
    // nameText.x = knightSprite.x + (knightSprite.width / 2);
    // nameText.y = knightSprite.y;

    // state.game.debug.body(knight);
  };

  entity.addComponent(new Sprite({knight: knightSprite, grave: graveSprite}, onSpriteUpdate));

  const cursorKeys = state.input.keyboard.createCursorKeys();
  const attackKey = state.input.keyboard.addKey(Keyboard.SPACEBAR);
  const sprintKey = state.input.keyboard.addKey(Keyboard.SHIFT);

  const onInputUpdate = function(props, dispatch) {
    const cursorKeys = this.getKey('cursors');
    const attackKey = this.getKey('attack');
    const sprintKey = this.getKey('sprint');

    const attackComponent = this.getComponent('attack');

    if (attackKey.isDown && attackComponent.canAttack()) {
      dispatch(performAttack(props.id));

      setTimeout(() => {
        dispatch(resetAttack(props.id));
      }, 100);
    }

    const velocity = sprintKey.isDown ? props.runSpeed * 1.5 : props.runSpeed;

    if (cursorKeys.left.isDown) {
      dispatch(setVelocity(props.id, -velocity, 0));
      dispatch(setFacing(props.id, 'left'));
    } else if (cursorKeys.right.isDown) {
      dispatch(setVelocity(props.id, velocity, 0));
      dispatch(setFacing(props.id, 'right'));
    } else if (cursorKeys.up.isDown) {
      dispatch(setVelocity(props.id, 0, -velocity));
      dispatch(setFacing(props.id, 'up'));
    } else if (cursorKeys.down.isDown) {
      dispatch(setVelocity(props.id, 0, velocity));
      dispatch(setFacing(props.id, 'down'));
    } else if (!isEntityMoving(props)) {
      dispatch(setVelocity(props.id, 0, 0));
      dispatch(setFacing(props.id, null));
    }
  };

  entity.addComponent(new Input({cursors: cursorKeys, attack: attackKey, sprint: sprintKey}, onInputUpdate));

  const hitSound = state.add.audio('knight-hit', SOUND_VOLUME);
  const dieSound = state.add.audio('knight-die', SOUND_VOLUME);

  entity.addComponent(new Sound({hit: hitSound, die: dieSound}));

  for(let i = 0; i < 20; i++) {
    createSprite(state, attackGroup, {type: 'attack'});
  }

  const onAttackUpdate = function(props, dispatch) {
    if (props.isAttacking && this.canAttack()) {
      const attackSprite = this.getAttackSprite();

      if (attackSprite) {
        const hitSound = this.getComponent('sound').getSound('hit');
        const { x, y } = this.calculateAttackTarget(attackSprite, props);

        attackSprite.reset(x, y);
        hitSound.play();

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

  const onHealthUpdate = function(props, dispatch) {
    
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
  const graveSprite = createSprite(state, rootGroup, {type: 'grave'});

  const onSpriteUpdate = function(props, dispatch) {
    const knightSprite = this.getSprite('knight');
    const graveSprite = this.getSprite('grave');

    knightSprite.x = props.x;
    knightSprite.y = props.y;

    if (props.animation && props.aniamtion !== knightSprite.animations.currentAnim()) {
      knightSprite.animations.play(props.animation);
    }

    if (props.isDead && knightSprite.alive) {
      const dieSound = this.getComponent('sound').getSound('die');
      knightSprite.kill();
      graveSprite.reset(props.x, props.y);
      dieSound.play();
    } else if (!props.isDead && !knightSprite.alive) {
      graveSprite.kill();
      knightSprite.revive();
    }

    const nameText = this.getComponent('text').getText('name');

    nameText.x = knightSprite.x + (knightSprite.width / 2);
    nameText.y = knightSprite.y;

    // state.game.debug.body(knight);
  };

  entity.addComponent(new Sprite({knight: knightSprite, grave: graveSprite}, onSpriteUpdate));

  const hitSound = state.add.audio('knight-hit', SOUND_VOLUME);
  const dieSound = state.add.audio('knight-die', SOUND_VOLUME);

  entity.addComponent(new Sound({hit: hitSound, die: dieSound}));

  const nameText = createNameTag(state, props);
  entity.addComponent(new Text({name: nameText}));

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
      return null;
  }
}
