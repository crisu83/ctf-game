import { List, fromJS } from 'immutable';
import { onSetPosition, onSetFacing, onSetAnimation } from 'shared/handlers/entity';
import { findEntityIndexById } from 'shared/helpers/game';
import { findTeamIndexByPlayerId, calculateBaseSpawnPosition } from '../helpers/game';
import { EntityActions } from 'shared/constants';

export function onAddEntity(state, action) {
  const { entity } = action;
  return state.push(fromJS(entity));
}

export function onRemoveEntity(state, action) {
  const { id } = action;
  return state.filter(entity => entity.get('id') !== id);
}

export function onDamageEntity(state, action) {
  const { id, victimId } = action;
  const entities = state.toJS();
  const attackerIndex = findEntityIndexById(entities, id);
  const victimIndex = findEntityIndexById(entities, victimId);
  const attackerColor = state.getIn([attackerIndex, 'color']);
  const victimColor = state.getIn([victimIndex, 'color']);
  if (attackerColor === victimColor) {
    return state;
  }
  const damage = state.getIn([attackerIndex, 'damage']);
  const health = state.getIn([victimIndex, 'health']);
  return state.updateIn([victimIndex, 'currentHealth'], health, value => value - damage)
    .setIn([victimIndex, 'lastAttackerId'], id);
}

export function onKillEntity(state, action) {
  const { id, lastAttackerId } = action;
  const entities = state.toJS();
  const entityIndex = findEntityIndexById(entities, id);
  const attackerIndex = findEntityIndexById(entities, lastAttackerId);
  return setIsDead(state, action, true)
    .setIn([entityIndex, 'currentHealth'], 0)
    .updateIn([attackerIndex, 'numKills'], 0, value => value + 1)
    .updateIn([entityIndex, 'numDeaths'], 0, value => value + 1);
}

export function onBeginRevive(state, action) {
  const { id } = action;
  const entities = state.toJS();
  const playerIndex = findEntityIndexById(entities, id);
  const playerProps = state.get(playerIndex).toJS();
  if (playerProps.team) {
    const teamIndex = findEntityIndexById(entities, playerProps.team);
    const teamProps = state.get(teamIndex).toJS();
    const { x, y } = calculateBaseSpawnPosition(playerProps, teamProps.base);
    state = onSetPosition(state, { ...action, x, y });
  }
  const health = state.getIn([playerIndex, 'health']);
  return setIsDead(setIsReviving(state, action, true), action, false)
    .setIn([playerIndex, 'currentHealth'], health)
    .removeIn([playerIndex, 'lastAttackerId']);
}

export function onEndRevive(state, action) {
  return setIsReviving(setIsDead(state, action, false), action, false);
}

export function onJoinTeam(state, action) {
  const { teamId, playerId } = action;
  const entities = state.toJS();
  const playerIndex = findEntityIndexById(entities, playerId);
  const teamIndex = findEntityIndexById(entities, teamId);
  const playerProps = state.get(playerIndex).toJS();
  const teamProps = state.get(teamIndex).toJS();
  if (teamProps.base) {
    const { x, y } = calculateBaseSpawnPosition(playerProps, teamProps.base);
    state = onSetPosition(state, { ...action, id: playerId, x, y });
  }
  return state.updateIn([teamIndex, 'players'], List(), players => players.push(playerId))
    .setIn([playerIndex, 'team'], teamProps.id)
    .setIn([playerIndex, 'color'], teamProps.color)
    .setIn([playerIndex, 'hexColor'], teamProps.hexColor);
}

export function onLeaveTeam(state, action) {
  const { playerId } = action;
  const entities = state.toJS();
  const teamIndex = findTeamIndexByPlayerId(entities, playerId);
  // TODO: Figure out a way to remove the color, etc. from the player as well.
  return state.updateIn([teamIndex, 'players'], players => players.filter(id => id !== playerId));
}

export function onGivePoints(state, action) {
  const { id, points } = action;
  const entityIndex = findEntityIndexById(state.toJS(), id);
  return state.updateIn([entityIndex, 'points'], 0, value => value + points);
}

export function onTagFlag(state, action) {
  const { flagId, playerId } = action;
  const entities = state.toJS();
  const playerIndex = findEntityIndexById(entities, playerId);
  const flagIndex = findEntityIndexById(entities, flagId);
  const oldTeamId = state.getIn([flagIndex, 'team']);
  const newTeamId = state.getIn([playerIndex, 'team']);
  const oldTeamIndex = findEntityIndexById(entities, oldTeamId);
  const newTeamIndex = findEntityIndexById(entities, newTeamId);
  const playerColor = state.getIn([playerIndex, 'color']);
  const flagColor = state.getIn([flagIndex, 'color']);
  if (playerColor === flagColor) {
    return state;
  }
  return state.setIn([flagIndex, 'color'], playerColor)
    .setIn([flagIndex, 'team'], newTeamId)
    .updateIn([oldTeamIndex, 'numFlags'], value => value - 1)
    .updateIn([newTeamIndex, 'numFlags'], value => (value || 0) + 1);
}

function setIsDead(state, action, value) {
  const { id } = action;
  const entityIndex = findEntityIndexById(state.toJS(), id);
  return state.setIn([entityIndex, 'isDead'], value);
}

function setIsReviving(state, action, value) {
  const { id } = action;
  const entityIndex = findEntityIndexById(state.toJS(), id);
  return state.setIn([entityIndex, 'isReviving'], value);
}

export const handlers = {
  [EntityActions.SET_POSITION]: onSetPosition,
  [EntityActions.SET_ANIMATION]: onSetAnimation,
  [EntityActions.SET_FACING]: onSetFacing,
  [EntityActions.ADD_ENTITY]: onAddEntity,
  [EntityActions.REMOVE_ENTITY]: onRemoveEntity,
  [EntityActions.DAMAGE_ENTITY]: onDamageEntity,
  [EntityActions.KILL_ENTITY]: onKillEntity,
  [EntityActions.BEGIN_REVIVE]: onBeginRevive,
  [EntityActions.END_REVIVE]: onEndRevive,
  [EntityActions.TAG_FLAG]: onTagFlag,
  [EntityActions.JOIN_TEAM]: onJoinTeam,
  [EntityActions.LEAVE_TEAM]: onLeaveTeam,
  [EntityActions.GIVE_POINTS]: onGivePoints
};
