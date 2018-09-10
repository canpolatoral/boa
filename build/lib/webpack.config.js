import _ from 'lodash-compat';
import baseConfig from '../webpack/base.config';
var nodeExternals = require('webpack-node-externals');

module.exports = function(env) {

  let entryFile = `${env.componententry}`;
  let dispath = `${env.distpath}`;
  let componentname = `${env.componentname}`;

  return _.extend({}, baseConfig, {
    entry: {
      index: entryFile
    },
    output: {
      path: dispath,
      filename: '[name].js',
      library: componentname,
      libraryTarget: 'commonjs2'
    },
    externals: [nodeExternals()]
  });
};