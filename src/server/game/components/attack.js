import Component from 'shared/game/component';

class Attack extends Component {
  constructor(onUpdate) {
    super('attack', 0, onUpdate);
  }
}

export default Attack;
