var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var LiveReloadPlugin = require('webpack-livereload-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: 'dist',
    filename: 'bundle.js',
    publicPath: 'static'
  },
  resolve: {
    alias: {
      'pixi': path.join(__dirname, 'lib/pixi.js'),
      'phaser': path.join(__dirname, 'lib/phaser.js')
    }
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel'
      },
      {
        test: /phaser\.js$/,
        include: path.join(__dirname, 'lib'),
        loader: 'imports?PIXI=pixi'
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style', 'css!sass'),
        include: path.join(__dirname, 'src')
      },
      {
        test: /\.(png|jpg)$/,
        loader: 'url?limit=8192',
        include: path.join(__dirname, 'src')
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url?limit=10000&mimetype=application/font-woff',
        include: path.join(__dirname, 'src')
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file',
        include: path.join(__dirname, 'src')
      },
      {
        test: /\.json$/,
        loader: 'json'
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('bundle.css'),
    new HtmlWebpackPlugin({
      title: 'CTF',
      template: './src/index.html',
      inject: 'body'
    }),
    new LiveReloadPlugin({
      appendScriptTag: true
    })
  ]
};
