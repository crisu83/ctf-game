import { Keyboard } from 'phaser';
import { has } from 'lodash';
import Entity from '../game/entity';
import Input from '../game/components/input';
import Sprite from '../game/components/sprite';
import Text from '../game/components/text';
import Sound from '../game/components/sound';
import { createSprite } from './sprite';
import { createNameTag } from './text';
import { CONTEXT_SERVER, setPosition, setVelocity, setAnimation } from '../actions/game';
import { isEntityMoving } from '../helpers/game';

const RUN_SPEED = 500;

/**
 *
 * @param {Phaser.Game} game
 * @param {Phaser.Group} group
 * @param {Phaser.TilemapLayer} walls
 * @param {Object} props
 * @returns {Entity}
 */
export function createLocalPlayer(game, group, walls, props) {
  const entity = new Entity(props);

  const knight = createSprite(game, group, props.type, props.x, props.y, `knight-${props.color}`);

  game.camera.follow(knight);
  game.physics.enable(knight);

  knight.body.collideWorldBounds = true;

  const cursors = game.input.keyboard.createCursorKeys();
  const attack = game.input.keyboard.addKey(Keyboard.SPACEBAR);
  const onInputUpdate = function(nextProps, prevProps, dispatch) {
    const cursors = this.getKey('cursors');
    const attack = this.getKey('attack');
    const knight = this.getComponent('sprite').getSprite('knight');
    const hit = this.getComponent('sound').getSound('hit');

    if (cursors.left.isDown) {
      dispatch(setVelocity(nextProps.id, -RUN_SPEED, 0));
      dispatch(setAnimation(nextProps.id, attack.isDown ? 'attackLeft' : 'runLeft'));
    } else if (cursors.right.isDown) {
      dispatch(setVelocity(nextProps.id, RUN_SPEED, 0));
      dispatch(setAnimation(nextProps.id, attack.isDown ? 'attackRight' : 'runRight'));
    } else if (cursors.up.isDown) {
      dispatch(setVelocity(nextProps.id, 0, -RUN_SPEED));
      dispatch(setAnimation(nextProps.id, attack.isDown ? 'attackUp' : 'runUp'));
    } else if (cursors.down.isDown) {
      dispatch(setVelocity(nextProps.id, 0, RUN_SPEED));
      dispatch(setAnimation(nextProps.id, attack.isDown ? 'attackDown' : 'runDown'));
    } else if (!isEntityMoving(nextProps)) {
      dispatch(setVelocity(nextProps.id, 0, 0));
      dispatch(setAnimation(nextProps.id, 'idle'));
    }
  };
  entity.addComponent(new Input(entity, {cursors, attack}, onInputUpdate));

  const onSpriteUpdate = function(nextProps, prevProps, dispatch) {
    const knight = this.getSprite('knight');

    game.physics.arcade.collide(knight, walls);

    knight.body.velocity.set(0);

    if (nextProps.vx) {
      knight.body.velocity.x = nextProps.vx;
    } else if (nextProps.vy) {
      knight.body.velocity.y = nextProps.vy;
    }

    if (nextProps.animation) {
      knight.animations.play(nextProps.animation);
    }

    if (knight.x !== nextProps.x || knight.y !== nextProps.y) {
      dispatch(setPosition(nextProps.id, knight.x, knight.y, CONTEXT_SERVER));
    }
  };
  entity.addComponent(new Sprite(entity, {knight}, onSpriteUpdate));

  const hit = game.add.audio('knight-hit', 0.1);
  const die = game.add.audio('knight-die', 0.1);
  entity.addComponent(new Sound(entity, {hit, die}));

  // TODO: Fix name tag positioning
  // const name = createNameTag(game, props);
  // const onTextUpdate = function(nextProps, prevProps) {
  //   const name = this.getText('name');
  //   const knight = this.getComponent('sprite').getSprite('knight');
  //   name.x = knight.x + (knight.width / 2);
  //   name.y = knight.y;
  // };
  // entity.addComponent(new Text(entity, {name}, onTextUpdate));

  return entity;
}

/**
 *
 * @param {Phaser.Game} game
 * @param {Phaser.Group} group
 * @param {Object} props
 * @returns {Entity}
 */
function createRemotePlayer(game, group, props) {
  const entity = new Entity(props);

  const knight = createSprite(game, group, props.type, props.x, props.y, `knight-${props.color}`);
  const onSpriteUpdate = function(nextProps, prevProps, dispatch) {
    const knight = this.getSprite('knight');
    knight.x = nextProps.x;
    knight.y = nextProps.y;

    if (nextProps.animation) {
      knight.animations.play(nextProps.animation);
    }
  };
  entity.addComponent(new Sprite(entity, {knight}, onSpriteUpdate));

  const hit = game.add.audio('knight-hit', 0.1);
  const die = game.add.audio('knight-die', 0.1);
  entity.addComponent(new Sound(entity, {hit, die}));

  const name = createNameTag(game, props);
  const onTextUpdate = function(nextProps, prevProps, dispatch) {
    const name = this.getText('name');
    name.x = nextProps.x + (nextProps.width / 2);
    name.y = nextProps.y;
  };
  entity.addComponent(new Text(entity, {name}, onTextUpdate));

  return entity;
}

/**
 *
 * @param {Phaser.Game} game
 * @param {Phaser.Group} group
 * @param {Object} props
 * @returns {Entity}
 */
function createFlag(game, group, props) {
  const entity = new Entity(props);

  const flagSprite = createSprite(game, group, props.type, props.x, props.y, 'flag');
  const onSpriteUpdate = function(nextProps) {

  };
  entity.addComponent(new Sprite(entity, {flag: flagSprite}, onSpriteUpdate));

  return entity;
}

/**
 * @param {Phaser.Game} game
 * @param {Phaser.Group} group
 * @param {Object} props
 * @returns {Entity}
 */
export function createEntity(game, group, props) {
  switch (props.type) {
    case 'player':
      return createRemotePlayer(game, group, props);

    case 'flag':
      return createFlag(game, group, props);

    default:
      console.warn(`trying to create unknown entity ${key}`);
      return null;
  }
}
