module.exports = {
  outputDir: 'dist/public',
  publicPath: './',

  devServer: {
    port: 8000,
    proxy: {
      '/api': {
        target: 'http://qb.test:8080',
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
