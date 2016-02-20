var path = require('path');
var webpack = require('webpack');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var LiveReloadPlugin = require('webpack-livereload-plugin');

module.exports = {
  entry: './src/client/index.js',
  output: {
    path: './public',
    filename: 'bundle.js',
    publicPath: 'static/'
  },
  resolve: {
    alias: {
      'pixi': path.join(__dirname, 'src/client/vendor/pixi'),
      'phaser': path.join(__dirname, 'src/client/vendor/phaser'),
      'resources': path.join(__dirname, 'resources'),
      'shared': path.join(__dirname, 'src/shared')
    },
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [
      {
        test: /\.jsx$/,
        loaders: ['react-hot', 'babel']
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|src\/client\/vendor)/,
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
    new CleanWebpackPlugin(['public']),
    new ExtractTextPlugin('bundle.css'),
    new HtmlWebpackPlugin({
      hash: true,
      inject: 'body',
      template: 'src/client/index.html',
      title: 'CTF'
    }),
    new LiveReloadPlugin({appendScriptTag: true})
  ]
};
