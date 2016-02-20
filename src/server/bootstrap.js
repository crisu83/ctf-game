import path from 'path';
import express from 'express';
import serveWebpackClient from 'serve-webpack-client';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import socketIo from 'socket.io';
import GameServer from './game/server';
import webpack from 'webpack';

const app = express();
const webpackConfig = require('../../webpack.config');
const compiler = webpack(webpackConfig);

app.use(serveWebpackClient({
  distPath: path.resolve(__dirname, '../../dist/client'),
  indexFileName: 'index.html',
  webpackConfig: webpackConfig
}));

app.use(webpackDevMiddleware(compiler, {
  noInfo: true, publicPath: webpackConfig.output.publicPath
}));

app.use(webpackHotMiddleware(compiler, {
  log: console.log, path: '/__webpack_hmr', heartbeat: 10 * 1000
}));

const server = app.listen(process.env.PORT || 3000);
const io = socketIo(server);
const gameServer = new GameServer(io);

gameServer.boot();
