const FRAME_RATE = 15;

/**
 *
 * @param {Phaser.State} state
 * @param {Phaser.Group} group
 * @param {Object} props
 * @returns {Phaser.Sprite}
 */
function createKnight(state, group, props) {
  const sprite = group.create(props.x, props.y, `knight-${props.color}`);

  state.physics.enable(sprite);

  sprite.body.collideWorldBounds = true;

  sprite.animations.add('idle', [0], FRAME_RATE);
  sprite.animations.add('runDown', [0, 1, 2, 3], FRAME_RATE);
  sprite.animations.add('runLeft', [4, 5, 6, 7], FRAME_RATE);
  sprite.animations.add('runUp', [8, 9, 10, 11], FRAME_RATE);
  sprite.animations.add('runRight', [12, 13, 14, 15], FRAME_RATE);
  sprite.animations.add('attackDown', [16, 17, 18, 19], FRAME_RATE);
  sprite.animations.add('attackLeft', [20, 21, 22, 23], FRAME_RATE);
  sprite.animations.add('attackUp', [24, 25, 26, 27], FRAME_RATE);
  sprite.animations.add('attackRight', [28, 29, 30, 31], FRAME_RATE);
  sprite.animations.play('idle', FRAME_RATE, true);

  return sprite;
}

/**
 *
 * @param {Phaser.Game} state
 * @param {Phaser.Group} group
 * @param {Object} props
 * @returns {Phaser.Sprite}
 */
function createFlag(state, group, props) {
  const sprite = group.create(props.x, props.y, props.type);

  state.physics.enable(sprite);

  sprite.animations.add('neutral', [0], FRAME_RATE);
  sprite.animations.add('green', [1], FRAME_RATE);
  sprite.animations.add('blue', [2], FRAME_RATE);
  sprite.animations.add('orange', [3], FRAME_RATE);
  sprite.animations.add('purple', [4], FRAME_RATE);
  sprite.animations.play('neutral', FRAME_RATE, true);

  return sprite;
}

/**
 *
 * @param {Phaser.Game} game
 * @param {Phaser.Group} group
 * @param {Object} props
 * @returns {Phaser.Sprite}
 */
export function createSprite(game, group, props) {
  let sprite = null;

  switch (props.type) {
    case 'player':
      sprite = createKnight(game, group, props);
      break;

    case 'flag':
      sprite = createFlag(game, group, props);
      break;

    default:
      console.warn(`trying to create unknown sprite ${props.type}`);
  }

  if (sprite) {
    sprite.name = props.id;
  }

  return sprite;
}
