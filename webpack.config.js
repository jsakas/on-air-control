const path = require('path');
const webpack = require('webpack');
const HtmlPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const pkg = require('./package.json');

const buildManifest = (buffer) => {
  var manifest = JSON.parse(buffer.toString());

  manifest.version = pkg.version;

  return JSON.stringify(manifest, null, 2);
};

const { WEBPACK_ENV } = process.env;

const MODE = WEBPACK_ENV || 'none';
const DEVTOOL = WEBPACK_ENV === 'production' ? 'source-map' : 'inline-cheap-source-map';
const SENTRY_ENABLED = WEBPACK_ENV === 'production' ? true : false;

module.exports = {
  mode: MODE,
  devtool: DEVTOOL,
  target: 'web',
  entry: {
    background: './src/background',
    content: './src/content',
  },
  output: {
    path: path.resolve(__dirname, 'build/chrome'),
    filename: '[name].js'
  },
  resolveLoader: {
    modules: [
      path.resolve(__dirname),
      'node_modules'
    ]
  },
  resolve: {
    alias: {
      process: 'process/ browser',
    },
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
        }
      },
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(WEBPACK_ENV),
    }),
    new HtmlPlugin({
      template: './src/interface.html',
      filename: 'interface.html',
      chunks: ['background'],
    }),
    new CopyPlugin({
      patterns: [
        {
          from: './src/manifest.json',
          to: 'manifest.json',
          transform: buildManifest,
        },
        {
          from: './INSTALL.md',
          to: '../INSTALL.md',
        },
        {
          from: './src/icons',
          to: './icons',
        }
      ]
    })
  ]
};
