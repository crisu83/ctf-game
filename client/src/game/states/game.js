import { forEach, find, get } from 'lodash';
import { Game, State, Physics, Keyboard, Tilemap, Group } from 'phaser';
import { createLocalPlayer, createEntity } from '../../factories/entity';
import Render from '../groups/render';

const MUSIC_VOLUME = 0.01;
const TILE_LAYER = 'tilelayer';

// Require for dynamic loading of assets provided by the server.
const req = require.context('assets', true, /\.(png|jpg|mp3|ogg|wav)$/);

class GameState extends State {
  /**
   * Creates the actual game state.
   * @param store
   * @param {Object} gameData
   * @param {Object} playerProps
   */
  constructor(store, gameData, playerProps) {
    super();

    this._store = store;
    this._playerProps = playerProps;
    this._gameData = gameData;
    this._playerEntity = null;
    this._music = null;
    this._entities = [];
    this._root = null;
    this._groups = {};
    this._layers = {};
  }

  /**
   * Loads game data such as spritesheets, images, audio and the map.
   */
  preload() {
    this.loadSpritesheets();
    this.loadImages();
    this.loadAudio();
    this.loadMap();
  }

  /**
   * Loads spritesheets from the game data.
   */
  loadSpritesheets() {
    const spritesheets = this.getGameData('assets.spritesheets');

    forEach(spritesheets, (data, key) => {
      if (data.url && data.frameWidth && data.frameHeight) {
        this.load.spritesheet(
          key,
          req(`./${data.url}`),
          data.frameWidth,
          data.frameHeight,
          data.numFrames || -1,
          data.margin || 0,
          data.spacing || 0
        );
      } else {
        console.warn(`Failed to load sprite ${key}.`);
      }
    });
  }

  /**
   * Loads images assets from the game data.
   */
  loadImages() {
    const images = this.getGameData('assets.images');

    forEach(images, (data, key) => {
      if (data.url) {
        this.load.image(key, req(`./${data.url}`));
      } else {
        console.warn(`Failed to load image ${key}.`);
      }
    });
  }

  /**
   * Loads audio assets from the game data.
   */
  loadAudio() {
    const audio = this.getGameData('assets.audio');

    forEach(audio, (data, key) => {
      const files = [];

      forEach(data.files, url => {
        files.push(req(`./${url}`));
      });

      this.load.audio(key, files);
    });
  }

  /**
   * Loads the tilemap from the game data.
   */
  loadMap() {
    const map = this.getGameData('map');
    this.load.tilemap(map.key, null, map.data, Tilemap.TILED_JSON);
  }

  /**
   * Called when the game is created to set up the initial state of the game.
   */
  create() {
    this.physics.startSystem(Physics.ARCADE);

    // Note: the order of these are IMPORTANT as it will determine the order that objects are rendered in.
    this.createMusic();
    this.createMap();
    this.createGroups();
    this.createPlayer();
  }

  /**
   * Creates the background music for the game.
   */
  createMusic() {
    const music = this.getGameData('map.music');

    this._music = this.add.audio(music, MUSIC_VOLUME, true/* loop */);
    this._music.mute = true; // for development purposes
    this._music.play();

    const muteKey = this.input.keyboard.addKey(Keyboard.M);
    muteKey.onDown.add(this.handleMutePressed.bind(this));
  }

  /**
   * Creates the map for the game.
   */
  createMap() {
    const mapData = this.getGameData('map');
    const map = this.add.tilemap(mapData.key, mapData.image);

    map.addTilesetImage(mapData.key, mapData.image);

    forEach(mapData.layers, data => {
      if (data.type === TILE_LAYER) {
        let layer = map.createLayer(data.name);

        layer.resizeWorld();

        // TODO: Check that the collision data actually exists.

        if (data.name === mapData.collision.layer) {
          map.setCollision(mapData.collision.indices, true, layer);
        }

        this.addLayer(data.name, layer);
      }
    });
  }

  /**
   * Creates the groups for the game.
   */
  createGroups() {
    this._root = new Render(this);

    this.addGroup('knights', this.add.group(this._root));
    this.addGroup('flags', this.add.group(this._root));
  }

  /**
   * Creates the local player entity.
   */
  createPlayer() {
    this._playerEntity = createLocalPlayer(this, this._playerProps);
    this.addEntity(this._playerEntity);
  }

  /**
   * Called when the mute button (M) is pressed.
   */
  handleMutePressed() {
    this._music.mute = !this._music.mute;
  }

  /**
   * Called when the game is updated to update the logic for the game.
   */
  update() {
    const gameState = this.gameState;

    this.updateEntities(gameState);
  }

  /**
   * Updates the state for each entity in the game, as well as creates new entities and destroys expired entities.
   * @param {Object} gameState
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

    // Sort all the entities according to their y position so that those with a higher y position is rendered on top.
    this._root.sort('y', Group.SORT_ASCENDING);
  }

  /**
   * Adds an entity to the game's entity pool.
   * @param {Entity} entity
   */
  addEntity(entity) {
    this._entities.push(entity);
  }

  /**
   * Returns a list containing the id of every entity in this game.
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
   * Destroys a set of entities from the games entity pool.
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
   * Returns data for this game.
   * @param {string} key
   * @returns {Object}
   */
  getGameData(key) {
    return get(this._gameData, key);
  }

  /**
   * Adds a layer to this game's layer pool.
   * @param {string} key
   * @param {Phaser.TilemapLayer} layer
   */
  addLayer(key, layer) {
    this._layers[key] = layer;
  }

  /**
   * Returns a layer from this game's layer pool.
   * @param {string} key
   * @returns {Phaser.TilemapLayer}
   */
  getLayer(key) {
    return this._layers[key];
  }

  /**
   * Adds a group to this game's group pool.
   * @param {string} key
   * @param {Phaser.Group} group
   */
  addGroup(key, group) {
    this._groups[key] = group;
  }

  /**
   * Returns a group from this game's group pool.
   * @param {string} key
   * @returns {Phaser.Group} group
   */
  getGroup(key) {
    return this._groups[key];
  }

  /**
   * Returns the current state of this game.
   * @returns {Object}
   */
  get gameState() {
    return this._store.getState().game.toJS();
  }
}

export default GameState;
