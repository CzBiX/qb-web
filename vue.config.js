module.exports = {
  outputDir: 'dist/public',
  publicPath: './',

  devServer: {
    port: 8000,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8080', // TODO: return previous target
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
