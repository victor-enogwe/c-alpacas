const set = require("lodash.set")
const { resolve } = require('path')

function rendererConfig (config) {
  const htmlPath = resolve(__dirname, 'src', 'index.ejs')
  const isProduction = config.mode!== 'development'
  const htmlWebpackPlugin = config.plugins.filter(plugin => plugin.constructor.name === 'HtmlWebpackPlugin')[0]
  const defineWebpackPlugin = config.plugins.filter(plugin => plugin.constructor.name === 'DefinePlugin')[0]
  const viewport = 'width=device-width, initial-scale=1.0, shrink-to-fit=no user-scalable=no'
  const cspContent = "default-src 'self'; script-src 'self' 'unsafe-inline'; img-src 'self' data:; style-src 'self' 'unsafe-inline'"
  const cspMeta = { 'http-equiv': 'Content-Security-Policy', content: cspContent }
  const xCspMeta = { 'http-equiv': 'X-Content-Security-Policy', content: cspContent }
  const htmlMeta = { charset: 'UTF-8', viewport, 'X-Content-Security-Policy': xCspMeta, 'Content-Security-Policy': cspMeta }
  const lodashModules = ['omit', 'defaultsdeep', 'get', 'set', 'sortby'].map(method => `lodash.${method}`)
  const whitelistedModules = ['react', 'react-dom', 'react-color', 'html2canvas', 'three'].concat(lodashModules)
  const externals = config.externals.filter(externalModule => !whitelistedModules.includes(externalModule))
  const replacedPlugins = ['HtmlWebpackPlugin', 'DefinePlugin']
  const NODE_VERSION = `"${process.versions.node}"`
  const CHROME_VERSION = `"${process.versions.chrome}"`
  const ELECTRON_VERSION = `"${process.versions.electron ?? process.env.npm_package_devDependencies_electron}"`
  const versions = {
    'window.electron.versions.NODE_VERSION': NODE_VERSION,
    'window.electron.versions.CHROME_VERSION': CHROME_VERSION,
    'window.electron.versions.ELECTRON_VERSION': ELECTRON_VERSION,
    'window.electron.versions.GIT_URL': `"${process.env.npm_package_repository_url.replace('git+', '')}"`
  }
  const definitions = { ...defineWebpackPlugin.definitions, ...versions }
  const chunks = {
    cacheGroups: {
      vendor: {
        test: /[\\\/]node_modules[\\\/]/,
        name: 'vendors',
        chunks: 'all'
      },
      styles: {
        name: 'styles',
        test: /\.css$/,
        chunks: 'all',
        enforce: true
      }
    }
  }

  set(config, 'devtool', 'nosources-source-map')
  set(config, 'node', undefined)
  set(config, 'output.libraryTarget', 'var')
  set(config, 'target', 'web')
  set(config, 'externals', externals)
  set(config, 'optimization.splitChunks', chunks)
  set(htmlWebpackPlugin, 'options.inject', 'body')
  set(htmlWebpackPlugin, 'options.nodeModulePath', undefined)
  set(htmlWebpackPlugin, 'options.template', resolve(__dirname, 'src', 'index.ejs'))
  set(htmlWebpackPlugin, 'options.title', 'C-Alpacas')
  set(htmlWebpackPlugin, 'options.filename', 'index.html')
  set(htmlWebpackPlugin, 'options.meta', { ...htmlMeta, 'theme-color': '#fe9200' })
  set(htmlWebpackPlugin, 'options.scriptLoading', 'defer')
  set(htmlWebpackPlugin, 'options.base', '/')
  set(htmlWebpackPlugin, 'options.minify', isProduction)
  set(defineWebpackPlugin, 'definitions', definitions)
  set(config, 'plugins', config.plugins.filter(plugin => !replacedPlugins.includes(plugin.constructor.name))
    .concat([defineWebpackPlugin, htmlWebpackPlugin]))

  return config
}

function mainConfig (config) {
  set(config, 'output.libraryTarget', 'umd')

  return config
}

function webpackConfig (config) {
  return config.target === 'electron-main' ? mainConfig(config) : rendererConfig(config)
}

module.exports = webpackConfig
