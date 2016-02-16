import { forEach, find } from 'lodash';
import { Game, State, Physics, Keyboard, Tilemap, Group } from 'phaser';
import { createLocalPlayer, createEntity } from '../../factories/entity';

const MUSIC_VOLUME = 0.01;
const req = require.context('assets', true, /\.(png|jpg|mp3|ogg|wav)$/);

const TILE_LAYER = 'tilelayer';

class GameState extends State {
  /**
   *
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
    this._entities = [];
    this._group = null;
    this._music = null;
    this._walls = null;
  }

  /**
   *
   * @param {Phaser.Game} game
   */
  preload(game) {
    this.loadSpritesheets(game);
    this.loadImages(game);
    this.loadAudio(game);
    this.loadMap(game);
  }

  /**
   *
   * @param {Phaser.Game} game
   */
  loadSpritesheets(game) {
    const { spritesheets } = this._gameData.assets;

    forEach(spritesheets, (data, key) => {
      if (data.url && data.frameWidth && data.frameHeight) {
        game.load.spritesheet(
          key,
          req(`./${data.url}`),
          data.frameWidth,
          data.frameHeight,
          data.numFrames || -1,
          data.margin || 0,
          data.spacing || 0
        );
      } else {
        console.warn(`Failed not load sprite ${key}.`);
      }
    });
  }

  /**
   *
   * @param {Phaser.Game} game
   */
  loadImages(game) {
    const { images } = this._gameData.assets;

    forEach(images, (data, key) => {
      if (data.url) {
        game.load.image(key, req(`./${data.url}`));
      } else {
        console.warn(`Failed not load image ${key}.`);
      }
    });
  }

  /**
   *
   * @param {Phaser.Game} game
   */
  loadAudio(game) {
    const { audio } = this._gameData.assets;

    forEach(audio, (data, key) => {
      const files = [];

      forEach(data.files, url => {
        files.push(req(`./${url}`));
      });

      game.load.audio(key, files);
    });
  }

  /**
   *
   * @param {Phaser.Game} game
   */
  loadMap(game) {
    const { map } = this._gameData;
    game.load.tilemap(map.key, null, map.data, Tilemap.TILED_JSON);
  }

  /**
   *
   * @param {Phaser.Game} game
   */
  create(game) {
    game.physics.startSystem(Physics.ARCADE);

    this._group = game.add.group();

    this.createMusic(game);
    this.createMap(game);
    this.createPlayer(game);
  }

  /**
   *
   * @param {Phaser.Game} game
   */
  createMusic(game) {
    const { music } = this._gameData.map;

    this._music = game.add.audio(music, MUSIC_VOLUME, true/* loop */);
    this._music.mute = true; // for development purposes
    this._music.play();

    const muteKey = game.input.keyboard.addKey(Keyboard.M);
    muteKey.onDown.add(this.onMutePressed.bind(this));
  }

  /**
   *
   * @param {Phaser.Game} game
   */
  createMap(game) {
    const { map } = this._gameData;
    const tilemap = game.add.tilemap(map.key, map.image);

    tilemap.addTilesetImage(map.key, map.image);

    forEach(map.layers, data => {
      if (data.type === TILE_LAYER) {
        let layer = tilemap.createLayer(data.name);

        if (layer) {
          layer.resizeWorld();
          layer.debug = true;
        }

        if (data.name === map.collision.layer) {
          tilemap.setCollision(map.collision.indices, true, layer);
          layer.debug = true;
          this._walls = layer;
        }
      }
    });
  }

  /**
   *
   * @param {Phaser.Game} game
   */
  createPlayer(game) {
    this._playerEntity = createLocalPlayer(game, this._group, this._walls, this._playerProps);
    this.addEntity(this._playerEntity);
  }

  /**
   *
   */
  onMutePressed() {
    this._music.mute = !this._music.mute;
  }

  /**
   *
   * @param {Phaser.Game} game
   */
  update(game) {
    this.updateEntities(game, this.gameState);
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
        entity = createEntity(game, this._group, nextProps);
        this.addEntity(entity);
      }

      entity.update(nextProps, this._store.dispatch);

      // Remove updated entities from the list of entities to be removed.
      removedEntityIds = removedEntityIds.filter(id => id !== nextProps.id);
    });

    // Destroy entities that have been removed.
    this.destroyEntities(removedEntityIds);

    // Sort sprites according to their y-value.
    this._group.sort('y', Group.SORT_ASCENDING);
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
