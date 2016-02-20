import Component from 'shared/game/component';

class Health extends Component {
  constructor(onUpdate) {
    super('health', 0, onUpdate);
  }
}

export default Health;
