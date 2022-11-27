const { babelInclude, override } = require('customize-cra');
const path = require('path');

module.exports = {
  webpack: override(
    babelInclude([
      path.resolve('src'),
    ])
    // and configure other stuff here like csp-html-webpack-plugin
  ),
};