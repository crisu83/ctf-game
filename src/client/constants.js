export const MUSIC_VOLUME = 0.01;
export const SOUND_VOLUME = 0.03;

export const CLIENT_MIN_LAG = 100;
export const CLIENT_MAX_LAG = 200;

export const FRAME_RATE = 15;

export const TILE_LAYER = 'tilelayer';

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
