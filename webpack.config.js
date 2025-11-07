// webpack.config.js
const path = require('path');

const isDevelopment = process.env.NODE_ENV === 'development';

module.exports = {
  mode: isDevelopment ? 'development' : 'production',
  entry: {
    content: './src/content.ts',
    popup: './src/popup.ts',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  devtool: isDevelopment ? 'inline-source-map' : 'source-map',
};
