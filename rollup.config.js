import babel from 'rollup-plugin-babel';
import localResolve from 'rollup-plugin-node-resolve';
import { peerDependencies } from './package.json';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/es/jpex.js',
      format: 'es',
      exports: 'named',
    },
    {
      file: 'dist/cjs/jpex.js',
      format: 'cjs',
      exports: 'named',
    },
  ],
  plugins: [
    localResolve({
      extensions: [ '.js', '.ts', '.tsx' ],
    }),
    babel({
      exclude: 'node_modules/**',
      extensions: [ '.js', '.ts', '.tsx' ],
    }),
  ],
  external: Object.keys(peerDependencies),
};
