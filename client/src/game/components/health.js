import Component from '../component';

class Health extends Component {
  constructor(onUpdate) {
    super('health', 0, onUpdate);
  }
}

export default Health;
