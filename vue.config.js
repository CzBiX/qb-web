module.exports = {
  outputDir: 'dist/public',

  devServer: {
    port: 8000,
    proxy: {
      '/api': {
        target: 'http://qb.test:8080',
      },
    },
  },
};
