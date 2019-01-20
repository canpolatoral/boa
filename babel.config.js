const config = {
  presets: ['@babel/preset-env', '@babel/preset-react'],
  plugins: [
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    [
      '@babel/plugin-proposal-object-rest-spread',
      {
        loose: true,
      },
    ],
    '@babel/plugin-transform-object-assign',
    '@babel/plugin-transform-runtime',
    ['@babel/plugin-proposal-decorators', { legacy: true }],
  ],
};

/* istanbul ignore else */
if (process.env.NODE_ENV !== 'production') {
  config.plugins.push(
    [
      'babel-plugin-module-resolver',
      {
        root: ['./'],
        alias: {
          '@boa/base': './packages/base/src',
          '@boa/components': './packages/components/src',
          '@boa/utils': './packages/utils/src',
          '@boa/test': './test',
        },
      },
    ],
  );
}

module.exports = config;
