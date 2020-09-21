const path = require('path');

module.exports = {
    mode: 'development',
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: 'feature-helper.js',
    library: 'FH',
    libraryTarget: 'var'
  },
};