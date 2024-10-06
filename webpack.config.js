// webpack.config.js
const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/content.js', // エントリーポイントとなるファイル
  devtool: 'source-map', // ソースマップを出力
  output: {
    filename: 'bundle.js', // 出力されるファイル名
    path: path.resolve(__dirname, 'dist'), // 出力先ディレクトリ
  },
};
