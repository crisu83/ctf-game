import State from '../state';
import { EntityTypes } from 'shared/constants';

class Castle extends State {
  /**
   * Called when the game is created to set up the initial state of the game.
   */
  create() {
    super.create();

    // Disable auto-pause on losing focus.
    this.game.stage.disableVisibilityChange = true;
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
   * Updates the player texts for the game.
   */
  updatePlayerTexts() {
    if (this.playerEntity) {
      this.updateText(
        'playerName',
        { name: this.playerEntity.getProp('name') },
        { fill: this.playerEntity.getProp('hexColor') }
      );
      this.updateText('playerPoints', { amount: this.playerEntity.getProp('points') || 0 });
      this.updateText('playerKills', { amount: this.playerEntity.getProp('numKills') || 0 });
      this.updateText('playerDeaths', { amount: this.playerEntity.getProp('numDeaths') || 0 });
    }
  }

  /**
   * Updates the flags text for the game.
   */
  updateFlagsText() {
    const numFlags = this._entities.filterEntities(entity =>
      entity.getProp('type') === EntityTypes.FLAG && entity.getProp('color') === this.playerEntity.getProp('color'));
    this.updateText('teamFlags', { amount: numFlags.length || 0 });
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
        this.updateText(key, {
          place: index + 1,
          player: players[index].getProp('name'),
          points: players[index].getProp('points') || 0
        });
      } else {
        this.hideText(key);
      }
    }
  }
}

export default Castle;
