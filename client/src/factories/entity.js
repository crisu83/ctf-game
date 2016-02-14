import Entity from '../entity';
import createSprite from './sprite';

/**
 * @param {Phaser.Game} game
 * @param {Object} props
 * @returns {Entity}
 */
export default function createEntity(game, props) {
  return new Entity(props.id, createSprite(game,props.type,props.x,props.y,props.sprite));
}
