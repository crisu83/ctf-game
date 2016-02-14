import shortid from 'shortid';
import { toJS } from 'immutable';
import { now } from 'lodash';
import { logger } from './helpers';
import { advanceTime } from './actions/game';

const GAME_TICK_RATE = 30;

class GameInstance {
  /**
   * @param store
   */
  constructor(store) {
    this._store = store;
    this._id = shortid.generate();
    this._isRunning = true;
    this._lastTickAt = null;

    logger.info(`session.start (session_id: ${this._id})`);

    // TODO: Set up the game

    setInterval(this.update.bind(this), 1000 / GAME_TICK_RATE);
  }

  /**
   *
   */
  update() {
    let timeNow, timeElapsed;

    if (this._isRunning) {
      timeNow = now();
      timeElapsed = this._lastTickAt ? timeNow - this._lastTickAt : 0;

      this._store.dispatch(advanceTime(timeElapsed));

      this._lastTickAt = timeNow;
    }
  }
}

export default GameInstance;
