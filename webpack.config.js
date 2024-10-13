// webpack.config.js
const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/content.js', // エントリーポイントとなるファイル
  output: {
    filename: 'bundle.js', // 出力されるファイル名
    path: path.resolve(__dirname, 'dist'), // 出力先ディレクトリ
  },
};
