'use strict';

const NODE_ENV = process.env.NODE_ENV;
const path = require('path');

const config = {
  mode: NODE_ENV === 'development' ? 'development' : 'production',

  entry: {
    main: './src/assets/js/index.js'
  },
  // 出力ファイル
  output: {
    path: path.join(__dirname, NODE_ENV === 'development' ? 'src' : 'dist'),
    filename: "./assets/js/[name].js"
  },
  // optimization: {
  //   minimize: false
  // },
  resolve: {
    extensions: ['.js'],
    modules: [
      "node_modules"
    ]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            cacheDirectory: true
          }
        }
      }
    ]
  }
}

module.exports = config;