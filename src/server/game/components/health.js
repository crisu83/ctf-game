import Component from 'shared/game/component';

class HealthComponent extends Component {
  constructor(onUpdate) {
    super('health', 0, onUpdate);
  }
}

export default HealthComponent;
