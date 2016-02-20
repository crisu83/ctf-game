import express from 'express';
import path from 'path';
import socketIo from 'socket.io';
import GameServer from './game/server';

const webRoot = path.join(__dirname, '../../public');
const app = express();

app.use('/static', express.static(webRoot));

app.get('/', (req, res) => {
  res.sendFile('index.html', {root: webRoot});
});

const server = app.listen(process.env.PORT || 3000);
const io = socketIo(server);
const gameServer = new GameServer(io);

gameServer.boot();
