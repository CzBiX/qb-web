module.exports = {
  outputDir: 'dist/public',

  pwa: {
    name: 'qBittorrent Web UI',
  },

  devServer: {
    proxy: {
      '/api': {
        target: 'http://192.168.1.2:8080',
      }
    }
  }
}
