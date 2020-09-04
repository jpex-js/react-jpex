export default {
  files: [ 'src/**/*.test.ts', 'src/**/*.test.tsx' ],
  extensions: [ 'ts', 'tsx' ],
  require: [ './test-setup.js' ],
  verbose: true,
  babel: {
    compileEnhancements: false,
  },
};
