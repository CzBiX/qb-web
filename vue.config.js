module.exports = {
  outputDir: 'dist/public',

  pwa: {
    name: 'qBittorrent Web UI',
  },

  devServer: {
    port: 8000,
    proxy: {
      '/api': {
        target: 'http://qb.test:8080',
      },
    },
  },
};
