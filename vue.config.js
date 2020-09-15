module.exports = {
  outputDir: 'dist/public',
  publicPath: './',

  devServer: {
    port: 8000,
    proxy: {
      '/api': {
        target: 'https://server.bbogdanov.dev/torrent/',
      },
    },
  },

  chainWebpack(config) {
    config.plugin('define').tap(args => {
      let arg = args[0]
      arg = {
        ...arg,
        'process.env.COMMIT_ID': JSON.stringify(process.env.COMMIT_ID)
      }

      return [arg]
    })
  }
};
