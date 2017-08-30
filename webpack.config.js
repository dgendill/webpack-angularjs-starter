const webpack = require('webpack');
const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const frontend = {
  entry: './src/js/main.js',
  target: 'web',
  output: {
    filename: '../dist/main.js',
    path: path.resolve(__dirname, 'src'),
    sourceMapFilename: '../dist/main.js.map',
    library: "MyApp",
    libraryTarget: "var"
  },
  module : {
    rules: [
      {
        test: /\.html$/,
        loader: 'raw-loader'
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from : 'src/index.html',
        to : '../dist/index.html'
      }
    ])
  ],
  resolve: {
    alias: {
      Models: path.resolve(__dirname, './src/js/models/'),
      Modules: path.resolve(__dirname, './src/js/modules/'),
      Templates: path.resolve(__dirname, './src/templates/')
    }
  },
  devtool : "#source-map"
}

const backend = {
  entry: {
    dbsetup : './api/dbsetup.js'
  },
  target: 'node',
  output: {
    filename: 'dist/[name].js',
    path: path.resolve(__dirname, 'api'),
    sourceMapFilename: 'dist/[name].js.map',
  },
  module : {
    // noParse : [],
    // loaders : [
    //   { test: /node_modules\/rc\/index.js$/, use: ['shebang-loader'] }
    // ]
  },
  plugins: [
    new webpack.BannerPlugin({
      banner:'require("source-map-support").install();',
      raw: true,
      entryOnly: false
    })
  ],
  resolve: {
    alias: {}
  },
  resolveLoader: {
    modules: ['node_modules', 'loaders'],
  },
  devtool : "#source-map"
};

module.exports = [backend];