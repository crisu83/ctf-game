import shortid from 'shortid';
import { forEach, find, now } from 'lodash';
import { toJS } from 'immutable';
import { logger } from '../helpers';
import createStore from '../store';
import { addEntity, removeEntity, assignTeam, leaveTeam, advanceTime } from '../actions/game';
import { createEntity } from '../factories/entity';
import { createMap } from '../factories/map';

const GAME_TICK_RATE = 30;
const GAME_SYNC_RATE = 30;

// TODO: Separate game logic and generic game session logic into two different classes.

class Session {
  /**
   * Creates a new game session.
   * @param io
   */
  constructor(io) {
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

    logger.info(`session.create (session_id: ${this._id})`);
  }

  /**
   * Loads the game data for this game session.
   * @returns {Object}
   */
  loadGameData() {
    return {
      assets: require('../../data/assets.json'),
      config: require('../../data/config.json'),
      map: createMap('castle', this._store.dispatch),
      ui: require('../../data/ui.json')
    };
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
    const gameState = this.gameState;

    this.updateEntities(gameState);
  }

  /**
   * Ends this session.
   */
  end() {
    this._unsubscribeFromStore();
  }

  /**
   * Updates each entity in this session.
   */
  updateEntities(gameState) {
    let removedEntityIds = this.getEntityIds();

    forEach(gameState.entities, props => {
      let entity = find(this._entities, entity => entity.id == props.id);

      // Create the entity if it does not exist.
      if (!entity) {
        entity = createEntity(this, props);
        this.addEntity(entity);
      }

      entity.update(props, this._store.dispatch);

      // Remove updated entities from the list of entities to be removed.
      removedEntityIds = removedEntityIds.filter(id => id !== props.id);
    });

    // Destroy entities that have been removed.
    this.destroyEntities(removedEntityIds);
  }

  /**
   * Adds an entity to this session's entity pool.
   * @param {Entity} entity
   */
  addEntity(entity) {
    this._entities.push(entity);
  }

  /**
   * Returns a list containing the id of every entity in this session.
   * @returns {Array}
   */
  getEntityIds() {
    let ids = [];

    forEach(this._entities, entity => {
      ids.push(entity.id);
    });

    return ids;
  }

  /**
   * Destroys a set of entities from this session's entity pool.
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
   * Adds a player to this session.
   * @param {Object} props
   */
  addPlayer(props) {
    this._store.dispatch(addEntity(props));
    this._store.dispatch(assignTeam(props.id));
  }

  /**
   * Removes a player from this session.
   * @param {string} id
   */
  removePlayer(id) {
    this._store.dispatch(leaveTeam(id));
    this._store.dispatch(removeEntity(id));
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
   * Called by clients to dispatch actions received from the browser.
   * @param {Object} action
   */
  handleClientAction(action) {
    this._store.dispatch(action);
  }

  /**
   *
   * @returns {boolean}
   */
  shouldSendState() {
    return !this._lastSyncAt || now() - this._lastSyncAt > 1000 / GAME_SYNC_RATE;
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
