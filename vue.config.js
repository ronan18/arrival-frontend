const PurgecssPlugin = require('purgecss-webpack-plugin')
const glob = require('glob-all')
const path = require('path')
module.exports = {
  pwa: {
    // configure the workbox plugin
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      // swSrc is required in InjectManifest mode.
      swSrc: 'public/sw.js',
      // ...other Workbox options...
    }
  },
  configureWebpack: {

    // Merged into the final Webpack config
    plugins: [
      new PurgecssPlugin({
        paths: glob.sync([
          path.join(__dirname, './src/index.html'),
          path.join(__dirname, './src/**/*.vue'),
          path.join(__dirname, './src/**/*.js')
        ]),
        whitelist: ['GREEN', 'ORANGE', 'RED', 'YELLOW', 'BLUE'],
        extractors: [
          {
            extractor: class TailwindExtractor {
              static extract(content) {
                return content.match(/[A-z0-9-_:\/]+/g) || [];
              }
            },
            extensions: ['html', 'vue', 'js'],
          },
        ],
      })
    ]
  }
}