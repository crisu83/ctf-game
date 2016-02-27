export const GameActions = {
  ADD_ENTITY: 'game/ADD_ENTITY',
  REMOVE_ENTITY: 'game/REMOVE_ENTITY',
  JOIN_TEAM: 'game/JOIN_TEAM',
  LEAVE_TEAM: 'game/LEAVE_TEAM',
  SET_STATE: 'game/SET_STATE',
  SET_POSITION: 'game/SET_POSITION',
  SET_VELOCITY: 'game/SET_VELOCITY',
  SET_ANIMATION: 'game/SET_ANIMATION',
  SET_FACING: 'game/SET_FACING',
  BEGIN_ATTACK: 'game/BEGIN_ATTACK',
  END_ATTACK: 'game/END_ATTACK',
  DAMAGE_ENTITY: 'game/DAMAGE_ENTITY',
  KILL_ENTITY: 'game/KILL_ENTITY',
  BEGIN_REVIVE: 'game/BEGIN_REVIVE',
  END_REVIVE: 'game/END_REVIVE',
  GIVE_POINTS: 'game/GIVE_POINTS',
  TAG_FLAG: 'game/TAG_FLAG',
  ADVANCE_TIME: 'game/ADVANCE_TIME'
};

export const EntityTypes = {
  PLAYER: 'player',
  FLAG: 'flag',
  TEAM: 'team'
};

export const FacingDirections = {
  LEFT: 'left',
  RIGHT: 'right',
  UP: 'up',
  DOWN: 'down',
  NONE: 'none'
};
