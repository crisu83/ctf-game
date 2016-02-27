import State from '../state';
import { EntityTypes } from 'shared/constants';

class Castle extends State {
  /**
   * Called when the game is created to set up the initial state of the game.
   */
  create() {
    super.create();
  }

  /**
   * Updates the user interface texts for the game.
   */
  updateTexts() {
    super.updateTexts();
    
    this.updatePlayerTexts();
    this.updateFlagsText();
    this.updateTop5Text();
  }

  /**
   *
   */
  updatePlayerTexts() {
    if (this._playerEntity) {
      this.updateText(
        'playerName',
        { name: this._playerEntity.getProp('name') },
        { fill: this._playerEntity.getProp('hexColor') }
      );
      this.updateText('playerPoints', { amount: this._playerEntity.getProp('points') || 0 });
      this.updateText('playerKills', { amount: this._playerEntity.getProp('numKills') || 0 });
      this.updateText('playerDeaths', { amount: this._playerEntity.getProp('numDeaths') || 0 });
    }
  }

  /**
   *
   */
  updateFlagsText() {
    const numFlags = this._entities.filterByType(entity =>
      entity.getProp('type') === EntityTypes.FLAG && entity.getProp('color') === this._playerEntity.getProp('color'));
    this.updateText('teamFlags', { amount: numFlags.length || 0 });
  }

  /**
   *
   */
  updateTop5Text() {
    const players = this._entities.filterByType(EntityTypes.PLAYER)
      .sort((a, b) => b.getProp('points') - a.getProp('points'));

    for (let i = 0; i < 5; i++) {
      let key = `top5_${i + 1}`;
      if (players[i]) {
        this.updateText(key, { player: players[i].getProp('name'), points: players[i].getProp('points') || 0 });
      } else {
        this.hideText(key);
      }
    }
  }
}

export default Castle;
