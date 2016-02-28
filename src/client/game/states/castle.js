import State from '../state';
import { EntityTypes, LayerTypes } from 'shared/constants';
import { MINI_MAP_SCALE } from '../../constants';

class Castle extends State {
  /**
   *
   */
  constructor(...props) {
    super(...props);

    this._miniMapOverlay = null;
  }

  /**
   * Called when the game is created to set up the initial state of the game.
   */
  create() {
    super.create();

    this.createMiniMap();

    // Disable auto-pause on losing focus.
    // this.game.stage.disableVisibilityChange = true;
  }

  /**
   * Creates the mini-map.
   */
  createMiniMap() {
    const miniMapWidth = this.map.width * MINI_MAP_SCALE;
    const miniMapHeight = this.map.height * MINI_MAP_SCALE;
    const miniMapBitmap = this.add.bitmapData(miniMapWidth, miniMapHeight);

    for (let l = 0; l < this.map.layers.length; l++) {
      for (let y = 0; y < this.map.height; y++) {
        for (let x = 0; x < this.map.width; x++) {
          const layerName = this.map.layers[l].name;
          const tile = this.map.getTile(x, y, l);
          if (layerName === LayerTypes.GROUND && tile) {
            miniMapBitmap.ctx.fillStyle = '#222';
            miniMapBitmap.ctx.fillRect(x * MINI_MAP_SCALE, y * MINI_MAP_SCALE, MINI_MAP_SCALE, MINI_MAP_SCALE);
          } else if (layerName === LayerTypes.WALLS && tile && tile.index === 41) {
            miniMapBitmap.ctx.fillStyle = '#444';
            miniMapBitmap.ctx.fillRect(x * MINI_MAP_SCALE, y * MINI_MAP_SCALE, MINI_MAP_SCALE, MINI_MAP_SCALE);
          }
        }
      }
    }

    const gameWidth = this.getGameData('config.gameWidth');

    this._miniMap = this.add.sprite(gameWidth - miniMapWidth - 10, 10, miniMapBitmap);
    this._miniMap.fixedToCamera = true;

    this._miniMapOverlay = this.add.bitmapData(miniMapWidth, miniMapHeight);

    const miniMapOverlay = this.add.sprite(this._miniMap.x, this._miniMap.y, this._miniMapOverlay);
    miniMapOverlay.fixedToCamera = true;
  }

  /**
   * Called when the game is updated.
   */
  update() {
    super.update();

    this.updateMiniMap();
  }

  /**
   * Updates the mini-map.
   */
  updateMiniMap() {
    this._miniMapOverlay.context.clearRect(0, 0, this._miniMapOverlay.width, this._miniMapOverlay.height);

    const flags = this._entities.filterByType(EntityTypes.FLAG);

    for (let i = 0; i < flags.length; i++) {
      this.drawEntityOnMiniMap(flags[i], flags[i].getProp('hexColor'));
    }

    this.drawEntityOnMiniMap(this.player, '#f00');

    this._miniMapOverlay.dirty = true;
  }

  /**
   * Draws an entity on the mini-map.
   * @param {Entity} entity
   * @param {string} color
   */
  drawEntityOnMiniMap(entity, color) {
    const { tileWidth, tileHeight } = this.getGameData('map');

    this._miniMapOverlay.ctx.fillStyle = color;
    this._miniMapOverlay.ctx.fillRect(
      (entity.getProp('x') / tileWidth) * MINI_MAP_SCALE,
      (entity.getProp('y') / tileHeight) * MINI_MAP_SCALE,
      MINI_MAP_SCALE,
      MINI_MAP_SCALE
    );
  }

  /**
   * Updates the user interface texts for the game.
   */
  updateTexts() {
    super.updateTexts();

    this.updatePlayerTexts();
    this.updateTop5Text();
  }

  /**
   * Updates the player texts for the game.
   */
  updatePlayerTexts() {
    if (this.player) {
      this.updateText(
        'playerName',
        { name: this.player.getProp('name') },
        { fill: this.player.getProp('hexColor') }
      );
      this.updateText('playerPoints', { amount: this.player.getProp('points') || 0 });
      this.updateText('playerKills', { amount: this.player.getProp('numKills') || 0 });
      this.updateText('playerDeaths', { amount: this.player.getProp('numDeaths') || 0 });
    }
  }

  /**
   * Updates the top 5 players texts for the game.
   */
  updateTop5Text() {
    const numSlots = 5;
    const players = this._entities.filterByType(EntityTypes.PLAYER);

    players.sort((a, b) => (b.getProp('points') || 0) - (a.getProp('points') || 0));

    for (let i = 0; i < numSlots; i++) {
      const key = `top5_${i + 1}`;
      const index = i - (numSlots - players.length);
      if (index >= 0 && players[index]) {
        this.updateText(
          key,
          { place: index + 1, player: players[index].getProp('name'), points: players[index].getProp('points') || 0 },
          { fill: players[index].getProp('hexColor') }
        );
      } else {
        this.hideText(key);
      }
    }
  }
}

export default Castle;
