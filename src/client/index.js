import io from 'socket.io-client';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import App from './components/app';
import { GameContainer } from './components/game';
import { buildStore } from './helpers/store';

import './index.scss';

const socket = io();
const store = buildStore(socket);

render(
  <Provider store={store}>
    <App>
      <GameContainer socket={socket} store={store}/>
    </App>
  </Provider>,
  document.getElementById('root')
);

