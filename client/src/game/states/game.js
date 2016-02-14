import { forEach, find } from 'lodash';
import { Game, State, Keyboard } from 'phaser';
import { createControllablePlayer, createEntity } from '../../factories/entity';

const MUSIC_VOLUME = 0.01;
const req = require.context('assets', true, /\.(png|jpg|mp3|ogg|wav)$/);

class GameState extends State {
  /**
   *
   * @param store
   * @param {Object} assetData
   * @param {Object} playerProps
   */
  constructor(store, assetData, playerProps) {
    super();

    this._store = store;
    this._playerProps = playerProps;
    this._assetData = assetData;
    this._playerEntity = null;
    this._entities = [];
    this._music = null;
  }

  /**
   *
   * @param {Phaser.Game} game
   */
  preload(game) {
    this.loadSpritesheets(game, this._assetData.spritesheets);
    this.loadImages(game, this._assetData.images);
    this.loadAudio(game, this._assetData.audio);
  }

  /**
   *
   * @param {Phaser.Game} game
   * @param {Object} spritesheets
   */
  loadSpritesheets(game, spritesheets) {
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
   * @param {Object} images
   */
  loadImages(game, images) {
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
   * @param {Object} audio
   */
  loadAudio(game, audio) {
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
  create(game) {
    this.createMusic(game);
    this.createPlayer(game);
  }

  /**
   *
   * @param {Phaser.Game} game
   */
  createPlayer(game) {
    this._playerEntity = createControllablePlayer(game, this._playerProps);
    this.addEntity(this._playerEntity);
  }

  /**
   *
   * @param {Phaser.Game} game
   */
  createMusic(game) {
    this._music = game.add.audio('8-bit-rebel', MUSIC_VOLUME, true/* loop */);
    this._music.mute = true; // for development purposes
    this._music.play();

    const muteKey = game.input.keyboard.addKey(Keyboard.M);
    muteKey.onDown.add(this.onMutePressed.bind(this));
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
