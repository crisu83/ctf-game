import Phaser from 'phaser';
import io from 'socket.io-client';

let socket = io('http://localhost:3000');

socket.on('client.connected', id => {
  console.log('client.connected (client_id: %s)', id);

  socket.emit('client.ready');
});

socket.on('client.update', (id, gameState) => {
  // console.log('client.update (id: %s)', id, gameState);
});
