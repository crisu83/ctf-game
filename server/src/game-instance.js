import shortid from 'shortid';
import { forEach, find } from 'lodash';
import { toJS } from 'immutable';
import { now } from 'lodash';
import { logger } from './helpers';
import { advanceTime } from './actions/game';
import { createEntity } from './factories/entity';

const GAME_TICK_RATE = 30;

class GameInstance {
  /**
   * @param store
   * @param {Object} gameData
   */
  constructor(store, gameData) {
    this._store = store;
    this._id = shortid.generate();
    this._isRunning = true;
    this._lastTickAt = null;
    this._gameData = gameData;
    this._world = null;
    this._entities = [];

    logger.info(`session.start (session_id: ${this._id})`);

    setInterval(this.tick.bind(this), 1000 / GAME_TICK_RATE);
  }

  /**
   *
   */
  tick() {
    let timeNow, timeElapsed;

    if (this._isRunning) {
      timeNow = now();
      timeElapsed = this._lastTickAt ? timeNow - this._lastTickAt : 0;

      this._store.dispatch(advanceTime(timeElapsed));

      this.update();

      this._lastTickAt = timeNow;
    }
  }

  /**
   *
   */
  update() {
    const gameState = this.gameState;

    this.updateEntities(gameState);
  }

  /**
   *
   */
  updateEntities(gameState) {
    let removedEntityIds = this.getEntityIds();

    forEach(gameState.entities, nextProps => {
      let entity = find(this._entities, entity => entity.id == nextProps.id);

      // Create the entity if it does not exist.
      if (!entity) {
        entity = createEntity(this._world, nextProps);
        this.addEntity(entity);
      }

      entity.update(nextProps, this._store.dispatch);

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

export default GameInstance;
