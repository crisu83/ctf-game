import shortid from 'shortid';
import { forEach, pick } from 'lodash';
import Session from '../session';
import { setPosition } from 'shared/actions/entity';
import { addEntity, joinTeam, leaveTeam } from '../../actions/entity';
import { findWeakestTeamId, calculateTeamSpawnPosition } from '../../helpers/game';
import { EntityTypes } from 'shared/constants';

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

    const baseObjects = this.getGameData('map.objects').filter(object => object.type === EntityTypes.BASE);

    forEach(teamColorProps, (props, index) => {
      this.dispatch(addEntity({
        ...props,
        type: EntityTypes.TEAM,
        id: shortid.generate(),
        base: pick(baseObjects[index], ['x', 'y', 'width', 'height'])
      }));
    });
  }

  /**
   * Creates the flags for this session.
   */
  createFlags() {
    const flagProps = this.getGameData('entities.flag');
    const flagObjects = this.getGameData('map.objects').filter(object => object.type === EntityTypes.FLAG);
    
    forEach(flagObjects, props => {
      this.dispatch(addEntity({
        ...props,
        ...flagProps,
        type: EntityTypes.FLAG,
        id: shortid.generate()
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
    this.dispatch(joinTeam(teamId, props.id));

    const team = this.getEntity(teamId);
    const { x, y } = calculateTeamSpawnPosition(team.props, props);
    this.dispatch(setPosition(props.id, x, y));
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
