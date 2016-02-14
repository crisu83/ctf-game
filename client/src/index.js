import io from 'socket.io-client';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { GameContainer } from './components/game';
import createStore from './store';

import './index.scss';

const socket = io('http://localhost:3000');
const store = createStore(socket);

render(
  <Provider store={store}>
    <GameContainer socket={socket} store={store}/>
  </Provider>,
  document.getElementById('root')
);
