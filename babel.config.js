module.exports = {
  presets: [
    '@babel/preset-react',
    '@babel/preset-typescript',
    [
      '@babel/preset-env',
      {
        targets: {
          browsers: [
            '> 2%',
          ],
        },
        modules: false,
        useBuiltIns: false,
        loose: true,
      },
    ],
  ],
};
