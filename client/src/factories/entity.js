import { Keyboard } from 'phaser';
import Entity from '../game/entity';
import Input from '../game/components/input';
import Sprite from '../game/components/sprite';
import Text from '../game/components/text';
import Sound from '../game/components/sound';
import { createSprite } from './sprite';
import { createName } from './text';
import { moveLeft, moveRight, moveUp, moveDown } from '../actions/game';

// TODO: Move this to the server completely to prevent cheating.
const MOVE_STEP = 5;

/**
 *
 * @param {Phaser.Game} game
 * @param {Phaser.Group} group
 * @param {Object} props
 * @returns {Entity}
 */
function createPlayer(game, group, props) {
  const entity = new Entity(props);

  const knight = createSprite(game, group, props.type, props.x, props.y, `knight-${props.color}`);
  const spriteComponent = new Sprite(entity, {knight}, function(newProps) {
    const knight = this.getSprite('knight');
    knight.x = newProps.x;
    knight.y = newProps.y;
  });
  entity.addComponent(spriteComponent);

  const hit = game.add.audio('knight-hit', 0.1);
  const die = game.add.audio('knight-die', 0.1);
  const soundComponent = new Sound(entity, {hit, die});
  entity.addComponent(soundComponent);

  const name = createName(game, props);
  const textComponent = new Text(entity, {name}, function(newProps) {
    const name = this.getText('name');
    name.x = newProps.x + (newProps.width / 2);
    name.y = newProps.y;
  });
  entity.addComponent(textComponent);

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
  const inputComponent = new Input(entity, {cursors, attack}, function(newProps, elapsed, dispatch) {
    const cursors = this.getKey('cursors');
    const attack = this.getKey('attack');
    const knight = this.getComponent('sprite').getSprite('knight');
    const hit = this.getComponent('sound').getSound('hit');

    if (cursors.left.isDown) {
      dispatch(moveLeft(props.id, MOVE_STEP));
      knight.animations.play(attack.isDown ? 'attackLeft' : 'runLeft');
    } else if (cursors.right.isDown) {
      dispatch(moveRight(props.id, MOVE_STEP));
      knight.animations.play(attack.isDown ? 'attackRight' : 'runRight');
    } else if (cursors.up.isDown) {
      dispatch(moveUp(props.id, MOVE_STEP));
      knight.animations.play(attack.isDown ? 'attackUp' : 'runUp');
    } else if (cursors.down.isDown) {
      dispatch(moveDown(props.id, MOVE_STEP));
      knight.animations.play(attack.isDown ? 'attackDown' : 'runDown');
    } else {
      knight.animations.play('idle');
    }
  });
  entity.addComponent(inputComponent);

  game.camera.follow(entity.getComponent('sprite').getSprite('knight'));

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
  const spriteComponent = new Sprite(entity, {flag: flagSprite}, function(newProps) {

  });
  entity.addComponent(spriteComponent);

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
