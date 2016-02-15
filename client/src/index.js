import io from 'socket.io-client';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { App } from './components/app';
import { GameContainer } from './components/game';
import createStore from './store';

import './index.scss';

const socket = io('http://localhost:3000');
const store = createStore(socket);

render(
  <Provider store={store}>
    <App>
      <GameContainer socket={socket} store={store}/>
    </App>
  </Provider>,
  document.getElementById('root')
);

