/*eslint no-unused-vars: 0*/

const FRAME_RATE = 15;

/**
 *
 * @param {Phaser.State} state
 * @param {Phaser.Group} group
 * @param {Object} props
 * @returns {Phaser.Sprite}
 */
function createKnight(state, group, props) {
  const sprite = group
    ? group.create(props.x, props.y, `knight-${props.color}`)
    : state.add.sprite(props.x, props.y, `knight-${props.color}`);

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
  const sprite = group.create(props.x, props.y, 'flag');

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
 * @param {Phaser.Game} state
 * @param {Phaser.Group} group
 * @param {Object} props
 * @returns {Phaser.Sprite}
 */
function createAttack(state, group, props) {
  const sprite = group.create(0, 0, 'attack');

  sprite.exists = false;
  sprite.visibile = false;

  sprite.animations.add('idle', [6], FRAME_RATE);
  sprite.animations.add('hit', [0, 1, 2, 3, 4, 5, 6], FRAME_RATE);
  sprite.animations.play('idle', FRAME_RATE);

  return sprite;
}

/**
 *
 * @param {Phaser.Game} state
 * @param {Phaser.Group} group
 * @param {Object} props
 * @returns {Phaser.Sprite}
 */
function createGrave(state, group, props) {
  const sprite = group.create(0, 0, 'grave');

  sprite.exists = false;
  sprite.visibile = false;

  return sprite;
}

/**
 *
 * @param {Phaser.State} state
 * @param {Phaser.Group} group
 * @param {Object} props
 * @returns {Phaser.Sprite}
 */
export function createSprite(state, group, props) {
  let sprite = null;

  switch (props.type) {
    case 'player':
      sprite = createKnight(state, group, props);
      break;

    case 'flag':
      sprite = createFlag(state, group, props);
      break;

    case 'attack':
      sprite = createAttack(state, group, props);
      break;

    case 'grave':
      sprite = createGrave(state, group, props);
      break;

    default:
      console.warn(`trying to create unknown sprite ${props.type}`);
  }

  if (sprite && props.id) {
    sprite.name = props.id;
  }

  return sprite;
}
