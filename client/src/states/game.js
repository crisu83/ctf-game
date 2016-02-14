import { forEach, find } from 'lodash';
import { Game, State, Keyboard } from 'phaser';
import { createControllablePlayer, createEntity } from '../factories/entity';

const SPRITE_SIZE = 96;

class GameState extends State {
  /**
   *
   * @param store
   * @param {Object} playerProps
   */
  constructor(store, playerProps) {
    super();

    this._store = store;
    this._playerProps = playerProps;
    this._playerEntity = null;
    this._entities = [];

    this.updateEntities = this.updateEntities.bind(this);
  }

  /**
   *
   * @param {Phaser.Game} game
   */
  preload(game) {
    // TODO: Receive this data from the server instead of hard-coding it

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
    this._playerEntity = createControllablePlayer(game, this._playerProps);
    this.addEntity(this._playerEntity);
  }

  /**
   *
   * @param {Phaser.Game} game
   */
  update(game) {
    const gameState = this.gameState;

    this.updateEntities(game, gameState);
  }

  /**
   *
   * @param {Phaser.Game} game
   * @param {Object} gameState
   */
  updateEntities(game, gameState) {
    let removedEntityIds = this.getEntityIds();

    forEach(gameState.entities, nextProps => {
      let entity = find(this._entities, entity => entity.id == nextProps.id);

      // Create the entity if it does not exist.
      if (!entity) {
        entity = createEntity(game, nextProps);
        this.addEntity(entity);
      }

      entity.update(nextProps, game.time.elapsed, this._store.dispatch);

      // Remove updated entities from the list of entities to be removed.
      removedEntityIds = removedEntityIds.filter(id => id !== nextProps.id);
    });

    // Destroy entities that have been removed.
    this.destroyEntities(removedEntityIds);
  }

  /**
   *
   * @param {Entity} entity
   */
  addEntity(entity) {
    this._entities.push(entity);
  }

  /**
   *
   * @returns {Array}
   */
  getEntityIds() {
    let ids = [];

    // Assume that entities have been removed.
    forEach(this._entities, entity => {
      ids.push(entity.id);
    });

    return ids;
  }

  /**
   *
   * @param {Array} ids
   */
  destroyEntities(ids) {
    this._entities = this._entities.filter(entity => {
      let isRemoved = ids.indexOf(entity.id) !== -1;

      if (isRemoved) {
        entity.destroy();
      }

      return !isRemoved;
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
