import { forEach } from 'lodash';
import Component from 'shared/game/component';

class Sound extends Component {
  /**
   *
   * @param {Array<Phaser.Sound>} sounds
   * @param {function} onUpdate
   */
  constructor(sounds, onUpdate) {
    super('sound', 0, onUpdate);

    this._sounds = sounds;
  }

  /**
   *
   */
  destroy() {
    forEach(this._sounds, sound => {
      sound.destroy();
    });
  }

  /**
   *
   * @param key
   * @returns {Phaser.Sound}
   */
  getSound(key) {
    return this._sounds[key];
  }
}

export default Sound;
