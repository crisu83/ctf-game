export const MUSIC_VOLUME = 0.05;
export const SOUND_VOLUME = 0.1;

export const CLIENT_MIN_LAG = 50;
export const CLIENT_MAX_LAG = 200;

export const FRAME_RATE = 15;

export const TILE_LAYER = 'tilelayer';

export const MINI_MAP_SCALE = 2;

export const ClientActions = {
  BEGIN_CONNECTION: 'client/BEGIN_CONNECTION',
  END_CONNECTION: 'client/END_CONNECTION',
  START_LOADING: 'client/START_LOADING',
  STOP_LOADING: 'client/STOP_LOADING'
};

export const ContextTypes = {
  CLIENT: 'client',
  SERVER: 'server'
};
