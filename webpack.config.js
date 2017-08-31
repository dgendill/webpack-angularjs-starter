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
    dbsetup : './src-api/dbsetup.js',
    api : './src-api/api.js'
  },
  target: 'node',
  output: {
    filename: '../dist-api/[name].js',
    path: path.resolve(__dirname, 'src-api'),
    sourceMapFilename: '../dist-api/[name].js.map',
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
    alias: {
      Models : path.resolve(__dirname, './src-api/models/'),
      DB : path.resolve(__dirname, './src-api/'),
      Util : path.resolve(__dirname, './src-api/util/')
    }
  },
  resolveLoader: {
    modules: ['node_modules', 'loaders'],
  },
  devtool : "#source-map"
};

module.exports = [backend, frontend];