/*eslint no-unused-vars: 0*/

import shortid from 'shortid';
import { find, forEach, get, now } from 'lodash';
import { logger } from '../helpers/vendor';
import { buildStore } from '../helpers/store';
import { addEntity, removeEntity } from '../actions/entity';
import { advanceElapsed } from '../actions/time';
import { createEntity } from '../factories/entity';
import { createMap } from '../factories/map';
import { DATA_PATH, GAME_TICK_RATE, GAME_SYNC_RATE } from '../constants';
import EntityManager from 'shared/managers/entity';

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
    this._store = buildStore();
    this._gameData = this.loadGameData();
    this._isRunning = false;
    this._lastTickAt = null;
    this._entities = new EntityManager(props => createEntity(this, props));
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

      this._store.dispatch(advanceElapsed(timeElapsed));

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

    this._entities.updateFromProps(gameState.entities, this.dispatch.bind(this));
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
    const state = this._store.getState();

    return {
      entities: state.entities.toJS(),
      time: state.time.toJS()
    };
  }
}

export default Session;
