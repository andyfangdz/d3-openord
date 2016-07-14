var webpack = require('webpack')
var path = require('path')

var TARGET = process.env.npm_lifecycle_event
process.env.BABEL_ENV = TARGET

var APP_PATH = path.resolve(__dirname, 'src/index.ts')
var BUILD_PATH = path.resolve(__dirname, 'lib')

module.exports = {
  entry: APP_PATH,
  output: {
    library: 'OpenOrd',
    path: BUILD_PATH,
    filename: 'index.js',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },

  devtool: 'source-map',

  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js']
  },

  module: {
    preLoaders: [ { test: /\.tsx?$/, loader: "tslint", exclude: [/typings/, /node_modules/] } ],
    loaders: [ { test: /\.tsx?$/, loader: 'babel-loader!ts-loader' } ]
  },

  tslint: {
    emitErrors: true,
    failOnHint: true
  },

  plugins: [
    // new webpack.optimize.UglifyJsPlugin({
    //   compress: { warnings: false }
    // })
  ]
}