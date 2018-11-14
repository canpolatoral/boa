import _ from 'lodash-compat';
import baseConfig, { options } from './base.config';
import nodeExternals from 'webpack-node-externals';

module.exports = env => {
  const entryFile = `${env.componententry}`;
  const dispath = `${env.distpath}`;
  const componentname = `${env.componentname}`;

  return _.extend({}, baseConfig, {
    entry: {
      bundle: entryFile,
    },
    output: {
      path: dispath,
      filename: options.optimizeMinimize ? 'index.min.js' : 'index.js',
      library: componentname,
      libraryTarget: 'umd',
    },
    externals: [nodeExternals()],
  });
};
