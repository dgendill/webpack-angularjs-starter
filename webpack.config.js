const webpack = require('webpack');
const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');


module.exports = {
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
      { test: /\.html$/, loader: 'raw-loader' }
      // {
      //   test: require.resolve("./js-src/ps.js"),
      //   use: 'exports-loader?PS'
      // },
      // {
      //   test: require.resolve("./js-src/ps.js"),
      //   use: 'imports-loader?jsmediatags'
      // }
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from : 'src/index.html',
        to : '../dist/index.html'
      }
    ])
    // new webpack.DefinePlugin({
    //   'process.env': {
    //     NODE_ENV: '"production"'
    //   }
    // })
    // ,
    // new UglifyJSPlugin({
    //   compress: true
    // })
  ],
  resolve: {
    alias: {
      Models: path.resolve(__dirname, './src/js/models/'),
      Modules: path.resolve(__dirname, './src/js/modules/'),
      Templates: path.resolve(__dirname, './src/templates/')
    }
  },
  devtool : "#source-map"
};
