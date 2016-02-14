const FRAME_RATE = 10;
const PLAYER = 'player';

/**
 *
 * @param {Phaser.Game} game
 * @param {number} x
 * @param {number} y
 * @param {string} key
 * @returns {Phaser.Sprite}
 */
function createPlayer(game, x, y, key) {
  const sprite = game.add.sprite(x, y, key);

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
 * @param {Phaser.Game} game
 * @param {string} type
 * @param {number} x
 * @param {number} y
 * @param {string} key
 * @returns {Phaser.Sprite}
 */
export function createSprite(game, type, x, y, key) {
  switch (type) {
    case PLAYER:
      return createPlayer(game, x, y, key);

    default:
      console.warn(`unrecognized sprite ${key}`);
      return null;
  }
}
