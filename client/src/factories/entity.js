import Entity from '../entity';
import createSprite from './sprite';

/**
 *
 * @param {Phaser.Game} game
 * @param {Object} props
 * @returns {Entity}
 */
function createPlayer(game, props) {
  const sprite = createSprite(game, props.type, props.x, props.y, `knight-${props.color}`);

  const text = game.add.text(
    props.x + (sprite.width / 2),
    props.y,
    props.name,
    {font: "14px Courier", stroke: "#000", strokeThickness: 5, fill: '#FFF'}
  );

  text.anchor.set(0.5, 0.5);

  return new Entity(props.id, sprite, text);
}

/**
 * @param {Phaser.Game} game
 * @param {Object} props
 * @returns {Entity}
 */
export default function createEntity(game, props) {
  switch (props.type) {
    case 'player':
      return createPlayer(game, props);

    default:
      return null;
  }
}
