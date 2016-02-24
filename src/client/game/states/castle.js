import State from '../state';

class Castle extends State {
  /**
   * Called when the game is created to set up the initial state of the game.
   */
  create() {
    super.create();
  }

  /**
   * Called when the game is updated.
   */
  update() {
    super.update();

    this.updateTexts();
  }

  /**
   * Updates the user interface texts for the game.
   */
  updateTexts() {
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

    const numFlags = this._entities.filter(entity => entity.getProp('type') === 'flag' && entity.getProp('color') === this._playerEntity.getProp('color'));
    this.updateText('teamFlags', { amount: numFlags.length || 0 });

    const players = this._entities.filter(entity => entity.getProp('type') === 'player')
      .sort((a, b) => b.getProp('points') - a.getProp('points'));

    for (let i = 0; i < 5; i++) {
      let key = `top5_${i + 1}`;
      if (players[i]) {
        this.updateText(key, { player: players[i].getProp('name'), points: players[i].getProp('points') || 0 });
      } else {
        this.hideText(key);
      }
    }

    if (this.shouldUpdatePing()) {
      this.updateText('ping', { amount: `${this._ping} ms` });
    }

    if (this.shouldUpdatePacketLoss()) {
      const packetLoss = this.calculatePacketLoss();
      this.updateText('packetLoss', { amount: `${packetLoss.toFixed(2)}%` });
    }

    this.updateText('playersOnline', { amount: this._numPlayers });
  }
}

export default Castle;
