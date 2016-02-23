/*eslint no-unused-vars: 0*/

import shortid from 'shortid';
import { forEach, get, now } from 'lodash';
import { logger } from '../helpers/vendor';
import createStore from '../store';
import { addEntity, removeEntity, advanceTime } from '../actions/game';
import { createEntity } from '../factories/entity';
import { createMap } from '../factories/map';
import { findEntityIndexById } from '../helpers/game';
import { DATA_PATH, GAME_TICK_RATE, GAME_SYNC_RATE } from '../constants';
import Entity from 'shared/game/entity';

// TODO: Separate game logic and generic game session logic into two different classes.

class Session {
  /**
   * Creates a new game session.
   * @param {string} name
   * @param io
   */
  constructor(name, io) {
    this._name = name;
    this._io = io;
    this._id = shortid.generate();
    this._store = createStore();
    this._gameData = this.loadGameData();
    this._isRunning = false;
    this._lastTickAt = null;
    this._entities = [];
    this._packetSequence = 0;
    this._lastSyncAt = null;

    // Notify each client every time the state is changed.
    this._unsubscribeFromStore = this._store.subscribe(this.handleStateChange.bind(this));

    this.create();
  }

  /**
   * Loads the game data for this game session.
   * @returns {Object}
   */
  loadGameData() {
    return {
      assets: require(`${DATA_PATH}/assets.json`),
      config: require(`${DATA_PATH}/config.json`),
      entities: require(`${DATA_PATH}/entities.json`),
      ui: require(`${DATA_PATH}/ui.json`),
      map: createMap(this._name, this._store.dispatch)
    };
  }

  /**
   * Creates this session.
   */
  create() {
  }

  /**
   * Starts this session.
   */
  start() {
    this._isRunning = true;

    setInterval(this.tick.bind(this), 1000 / GAME_TICK_RATE);

    logger.info(`session.start (session_id: ${this._id})`);
  }

  /**
   * Called each time this session is updated.
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
   * Called each time this sessions should be updated.
   */
  update() {
    this.updateEntities();
  }

  /**
   * Updates the state for each entity in the session,
   * as well as creates new entities and destroys expired entities.
   */
  updateEntities() {
    const gameState = this.gameState;
    const updatedEntityIds = [];

    forEach(gameState.entities, props => {
      let entity = this.getEntity(props);

      if (entity) {
        entity.update(props, this.dispatch.bind(this));
      }

      updatedEntityIds.push(props.id);
    });

    this._entities = this._entities.filter(entity => {
      const found = updatedEntityIds.indexOf(entity.id) !== -1;

      if (!found) {
        entity.destroy();
      }

      return found;
    });
  }

  /**
   * Adds an entity to the game's entity pool.
   * @param {Entity} entity
   */
  addEntity(entity) {
    if (!entity instanceof Entity) {
      throw new Error('State entities must be instances of Entity.');
    }

    this._entities.push(entity);
  }

  /**
   * Returns an entity from the game's entity pool (creating it if it doesn't exist).
   * @param {Object} props
   * @returns {Entity}
   */
  getEntity(props) {
    const index = findEntityIndexById(this._entities, props.id);

    if (index !== -1) {
      return this._entities[index];
    }

    const entity = createEntity(this, props);

    if (entity) {
      this.addEntity(entity);
    }

    return entity;
  }

  /**
   * Ends this session.
   */
  end() {
    this._unsubscribeFromStore();
  }

  /**
   * Adds a player to this session.
   * @param {Object} props
   */
  addPlayer(props) {
    this.dispatch(addEntity(props));
  }

  /**
   * Removes a player from this session.
   * @param {string} id
   */
  removePlayer(id) {
    this.dispatch(removeEntity(id));
  }

  /**
   * Called by clients to dispatch actions received from the browser.
   * @param {Object} action
   */
  handleClientAction(action) {
    this._store.dispatch(action);
  }

  /**
   * Called each time the state of this session changes.
   */
  handleStateChange() {
    if (this._isRunning && this.shouldSendState()) {
      this._io.to(this.channel).emit('set_state', this.gameState, this._packetSequence++);
      this._lastSyncAt = now();
    }
  }

  /**
   *
   * @returns {boolean}
   */
  shouldSendState() {
    return !this._lastSyncAt || (now() - this._lastSyncAt) > (1000 / GAME_SYNC_RATE);
  }

  /**
   * Dispatches an action to the sessions store.
   * @param {Object} action
   */
  dispatch(action) {
    this._store.dispatch(action);
  }

  /**
   * Returns data for this game.
   * @param {string} key
   * @returns {*}
   */
  getGameData(key) {
    return get(this._gameData, key);
  }

  /**
   * Returns the id of this session.
   * @returns {string}
   */
  get id() {
    return this._id;
  }

  /**
   * Returns the socket room for this session.
   * @returns {string}
   */
  get channel() {
    return `session/${this._id}`;
  }

  /**
   * Returns the game data for this session.
   * @returns {Object}
   */
  get gameData() {
    return this._gameData;
  }

  /**
   * Returns the current state of this session.
   * @returns {Object}
   */
  get gameState() {
    return this._store.getState().game.toJS();
  }
}

export default Session;
