require('babel-core/register');
import _ from 'lodash-compat';
import baseConfig, { options } from './base.config';
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
      filename: options.optimizeMinimize ? '[name].min.js' : '[name].js',
      library: componentname,
      libraryTarget: 'umd'
    },
    externals: [nodeExternals()]
  });
};