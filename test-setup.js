const browserEnv = require('browser-env');
const babel = require('@babel/register');
const { addAlias } = require('module-alias');
const { resolve } = require('path');

browserEnv();
babel({
  extensions: [ '.js', '.ts', '.tsx' ],
  plugins: [
    [ '@jpex/babel-plugin', {
      publicPath: true,
      // identifier: [ 'jpex', 'jpex3', 'jpex4' ],
    }],
  ],
  presets: [
    '@babel/preset-typescript',
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
        modules: 'commonjs',
        useBuiltIns: false,
        loose: true,
      },
    ],
  ],
});

addAlias('react-jpex', resolve('./src'));
