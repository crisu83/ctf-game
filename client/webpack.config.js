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
    publicPath: 'static/'
  },
  resolve: {
    root: path.join(__dirname, 'node_modules'),
    alias: {
      'pixi': path.join(__dirname, 'lib/pixi'),
      'phaser': path.join(__dirname, 'lib/phaser'),
      'assets': path.join(__dirname, 'assets')
    },
    extensions: ['', '.js', '.jsx']
  },
  resolveLoader: {
    root: path.join(__dirname, 'node_modules')
  },
  module: {
    loaders: [
      {
        test: /\.jsx$/,
        loaders: ['react-hot', 'babel']
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel'
      },
      {
        test: /phaser\.js$/,
        loader: 'imports?PIXI=pixi'
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style', 'css!sass')
      },
      {
        test: /\.(png|jpg|mp3|ogg|wav)$/,
        loader: 'url?limit=8192'
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url?limit=10000&mimetype=application/font-woff'
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file'
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
