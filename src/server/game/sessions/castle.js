import shortid from 'shortid';
import { forEach, pick } from 'lodash';
import Session from '../session';
import { addEntity, joinTeam, leaveTeam } from '../../actions/game';
import { findWeakestTeamId } from '../../helpers/game';
import { TEAM, FLAG } from '../../factories/entity';

class Castle extends Session {
  /**
   * Creates a new game session.
   * @param io
   */
  constructor(io) {
    super('castle', io);
  }
  
  /**
   * Creates this session.
   */
  create() {
    this.createTeams();
    this.createFlags();
  }

  /**
   * Creates the teams for this session.
   */
  createTeams() {
    const teamColorProps = [
      { color: 'blue', hexColor: '#46bce3' },
      { color: 'green', hexColor: '#86d93d' },
      { color: 'orange', hexColor: '#fda551' },
      { color: 'purple', hexColor: '#9c44b5' }
    ];

    const baseObjects = this.getGameData('map.objects').filter(object => object.type === 'base');

    forEach(teamColorProps, (props, index) => {
      this.dispatch(addEntity({
        ...props,
        type: TEAM,
        id: shortid.generate(),
        base: pick(baseObjects[index], ['x', 'y', 'width', 'height'])
      }));
    });
  }

  /**
   * Creates the flags for this session.
   */
  createFlags() {
    const flagObjects = this.getGameData('map.objects').filter(object => object.type === 'flag');
    
    forEach(flagObjects, props => {
      this.dispatch(addEntity({
        ...props,
        id: shortid.generate(),
        type: FLAG
      }));
    });
  }

  /**
   * Adds a player to this session.
   * @param {Object} props
   */
  addPlayer(props) {
    super.addPlayer(props);

    const teamId = findWeakestTeamId(this.gameState.entities);

    this.dispatch(joinTeam(props.id, teamId));
  }

  /**
   * Removes a player from this session.
   * @param {string} id
   */
  removePlayer(id) {
    super.removePlayer(id);
    
    this.dispatch(leaveTeam(id));
  }
}

export default Castle;
