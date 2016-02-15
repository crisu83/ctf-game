import { Keyboard } from 'phaser';
import Entity from '../game/entity';
import Player from '../game/components/player';
import Input from '../game/components/input';
import Sprite from '../game/components/sprite';
import Text from '../game/components/text';
import { createSprite } from './sprite';
import { createName } from './text';

/**
 *
 * @param {Phaser.Game} game
 * @param {Phaser.Group} group
 * @param {Object} props
 * @returns {Entity}
 */
function createPlayer(game, group, props) {
  const entity = new Entity(props);

  entity.addComponent(new Player(entity));

  const knightSprite = createSprite(game, group, props.type, props.x, props.y, `knight-${props.color}`);
  entity.addComponent(new Sprite(entity, {knight: knightSprite}));

  const nameText = createName(game, props);
  entity.addComponent(new Text(entity, {name: nameText}));

  return entity;
}

/**
 *
 * @param {Phaser.Game} game
 * @param {Phaser.Group} group
 * @param {Object} props
 * @returns {Entity}
 */
export function createControllablePlayer(game, group, props) {
  const entity = createPlayer(game, group, props);

  const cursors = game.input.keyboard.createCursorKeys();
  const attack = game.input.keyboard.addKey(Keyboard.SPACEBAR);
  entity.addComponent(new Input(entity, cursors, attack));

  game.camera.follow(entity.getComponent('sprite').get('knight'));

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
  entity.addComponent(new Sprite(entity, {flag: flagSprite}));

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
      return createPlayer(game, group, props);

    case 'flag':
      return createFlag(game, group, props);

    default:
      console.warn(`trying to create unknown entity ${key}`);
      return null;
  }
}
