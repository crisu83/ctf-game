import { forEach, find } from 'lodash';
import { Game, State, Keyboard } from 'phaser';
import { moveLeft, moveRight, moveUp, moveDown } from '../actions/game';
import { findEntityById } from '../helpers/game';
import createEntity from '../factories/entity';

const MOVE_STEP = 5;
const SPRITE_SIZE = 96;

class GameState extends State {
  /**
   *
   * @param socket
   * @param store
   * @param playerProps
   */
  constructor(socket, store, playerProps) {
    super();

    this._socket = socket;
    this._store = store;
    this._playerProps = playerProps;
    this._playerEntity = null;
    this._entities = [];

    this.handleInput = this.handleInput.bind(this);
    this.updateEntities = this.updateEntities.bind(this);
  }

  /**
   *
   * @param {Phaser.Game} game
   */
  preload(game) {
    const knightColors = ['blue', 'green', 'orange', 'purple'];

    forEach(knightColors, color => {
      game.load.spritesheet(
        `knight-${color}`,
        require(`../../assets/images/sprites/knight-${color}.png`),
        SPRITE_SIZE,
        SPRITE_SIZE
      );
    });
  }

  /**
   *
   * @param {Phaser.Game} game
   */
  create(game) {
    this._cursorKeys = game.input.keyboard.createCursorKeys();
    this._attackKey = game.input.keyboard.addKey(Keyboard.SPACEBAR);
    this._playerEntity = createEntity(game, this._playerProps);
    this._entities.push(this._playerEntity);
  }

  /**
   *
   * @param {Phaser.Game} game
   */
  update(game) {
    const gameState = this.gameState;

    this.handleInput();
    this.updateEntities(game, gameState);
  }

  /**
   *
   */
  handleInput() {
    if (this._cursorKeys.left.isDown) {
      this._store.dispatch(moveLeft(this._playerEntity.id, MOVE_STEP));
      this._playerEntity.sprite.animations.play(this._attackKey.isDown ? 'attackLeft' : 'runLeft');
    } else if (this._cursorKeys.right.isDown) {
      this._store.dispatch(moveRight(this._playerEntity.id, MOVE_STEP));
      this._playerEntity.sprite.animations.play(this._attackKey.isDown ? 'attackRight' : 'runRight');
    } else if (this._cursorKeys.up.isDown) {
      this._store.dispatch(moveUp(this._playerEntity.id, MOVE_STEP));
      this._playerEntity.sprite.animations.play(this._attackKey.isDown ? 'attackUp' : 'runUp');
    } else if (this._cursorKeys.down.isDown) {
      this._store.dispatch(moveDown(this._playerEntity.id, MOVE_STEP));
      this._playerEntity.sprite.animations.play(this._attackKey.isDown ? 'attackDown' : 'runDown');
    } else {
      this._playerEntity.sprite.animations.play('idle');
    }
  }

  /**
   *
   * @param {Phaser.Game} game
   * @param {Object} gameState
   */
  updateEntities(game, gameState) {
    let removedEntityIds = [];

    // Assume that entities have been removed.
    forEach(this._entities, entity => {
      removedEntityIds.push(entity.id);
    });

    let currentEntityState, entity, shouldBeDestroyed;

    forEach(gameState.entities, entityProps => {
      currentEntityState = findEntityById(gameState.entities, entityProps.id);
      entity = find(this._entities, entity => entity.id == entityProps.id);

      // Create the entity if it does not exist.
      if (!entity) {
        entity = createEntity(game, entityProps);
        this._entities.push(entity);
      }

      entity.sprite.x = entityProps.x;
      entity.sprite.y = entityProps.y;

      // Remove updated entities from the list of entities to be removed.
      removedEntityIds = removedEntityIds.filter(id => id !== entityProps.id);
    });

    // Destroy entities that have been removed.
    this._entities = this._entities.filter(entity => {
      shouldBeDestroyed = removedEntityIds.indexOf(entity.id) !== -1;

      if (shouldBeDestroyed) {
        entity.destroy();
      }

      return !shouldBeDestroyed;
    });
  }

  /**
   *
   * @returns {Object}
   */
  get gameState() {
    return this._store.getState().game.toJS();
  }
}

export default GameState;
