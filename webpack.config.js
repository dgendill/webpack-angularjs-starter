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
      // { test: /\.html$/, loader: 'raw-loader' }
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
      // chartjs: '../node_modules/chartjs/dist/Chart.js',
      // jsmediatags : './jsmediatags.js',
      // ps : './ps.js',
    }
  },
  devtool : "#source-map"
};
