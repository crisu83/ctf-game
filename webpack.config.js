var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

function getEntrySources(sources) {
  if (process.env.NODE_ENV !== 'production') {
    sources.push('webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000');
  }

  return sources;
}

const basePlugins = [
  new webpack.DefinePlugin({
    __DEV__: process.env.NODE_ENV !== 'production',
    __PRODUCTION__: process.env.NODE_ENV === 'production',
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  }),
  new HtmlWebpackPlugin({
    inject: 'body',
    template: 'src/client/index.html'
  })
];

const devPlugins = [
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoErrorsPlugin()
];

const prodPlugins = [
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.optimize.UglifyJsPlugin({
    compressor: {
      warnings: false
    }
  })
];

const plugins = basePlugins
  .concat(process.env.NODE_ENV === 'production' ? prodPlugins : [])
  .concat(process.env.NODE_ENV === 'development' ? devPlugins : []);

module.exports = {
  entry: {
    game: getEntrySources(['./src/client/index.js'])
  },
  output: {
    path: path.join(__dirname, 'dist/client'),
    filename: '[name].[hash].js',
    publicPath: '/',
    sourceMapFilename: '[name].[hash].js.map',
    chunkFilename: '[id].chunk.js'
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
  devtool: 'source-map',
  plugins: plugins,
  module: {
    preLoaders: [
      {
        test: /\.jsx?$/,
        loader: 'source-map'
      }
    ],
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel?cacheDirectory=true!eslint',
        exclude: /(node_modules|src\/client\/vendor)/
      },
      {
        test: /phaser\.js$/,
        loader: 'imports?PIXI=pixi'
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.scss$/,
        loader: 'style!css!sass?sourceMap'
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        loader: 'url?prefix=img/&limit=5000'
      },
      {
        test: /\.(mp3|ogg|wav)$/,
        loader: 'url?prefix=audio/&limit=8192'
      },
      {
        test: /\.(woff|woff2|ttf|eot)?$/,
        loader: 'url?prefix=font/&limit=5000&mimetype=application/font-woff'
      }
    ]
  }
};
