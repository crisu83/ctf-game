import io from 'socket.io-client';
import createStore from './store';
import createGame from './factories/game';
import { setState } from './actions/game';

const socket = io('http://localhost:3000');
const store = createStore(socket);

const READY = 'ready';
const SET_STATE = 'set_state';

socket.on(READY, (clientId, playerProps, state) => {
  console.log('CONNECTED (client_id: %s, player_id)', clientId, playerProps, state);

  store.dispatch(setState(state));

  createGame(socket, store, playerProps, {width: 800, height: 600});
});

socket.on(SET_STATE, (state) => {
  store.dispatch(setState(state));
});
