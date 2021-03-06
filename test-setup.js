const browserEnv = require('browser-env');
const babel = require('@babel/register');
const { addAlias } = require('module-alias');
const { resolve } = require('path');

browserEnv();
babel({
  extensions: [ '.js', '.ts', '.tsx' ],
  plugins: [
    [ '@jpex-js/babel-plugin', {
      publicPath: true,
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
