const set = require("lodash.set")
const { resolve } = require('path')

function rendererConfig (config) {
  const htmlPath = resolve(__dirname, 'src', 'index.ejs')
  const isProduction = config.mode!== 'development'
  const htmlWebpackPlugin = config.plugins.filter(plugin => plugin.constructor.name === 'HtmlWebpackPlugin')[0]
  const viewport = 'width=device-width, initial-scale=1.0, shrink-to-fit=no user-scalable=no'
  const cspContent = "default-src 'self'; script-src 'self' 'unsafe-inline'; img-src 'self' data:; style-src 'self' 'unsafe-inline'"
  const cspMeta = { 'http-equiv': 'Content-Security-Policy', content: cspContent }
  const xCspMeta = { 'http-equiv': 'X-Content-Security-Policy', content: cspContent }
  const htmlMeta = { charset: 'UTF-8', viewport, 'X-Content-Security-Policy': xCspMeta, 'Content-Security-Policy': cspMeta }
  const lodashModules = ['omit', 'defaultsdeep', 'get', 'sortby'].map(method => `lodash.${method}`)
  const whitelistedModules = ['react', 'react-color', 'html2canvas'].concat(lodashModules)
  const externals = config.externals.filter(externalModule => !whitelistedModules.includes(externalModule))

  set(config, 'devtool', 'nosources-source-map')
  set(config, 'node.__dirname', false)
  set(config, 'output.libraryTarget', 'var')
  set(config, 'target', 'web')
  // set(config, 'externals', externals)
  set(htmlWebpackPlugin, 'options.inject', 'body')
  set(htmlWebpackPlugin, 'options.nodeModulePath', undefined)
  set(htmlWebpackPlugin, 'options.template', 'auto')
  set(htmlWebpackPlugin, 'options.title', 'C-Alpacas')
  set(htmlWebpackPlugin, 'options.filename', 'index.html')
  set(htmlWebpackPlugin, 'options.meta', { ...htmlMeta, 'theme-color': '#fe9200' })
  set(htmlWebpackPlugin, 'options.scriptLoading', 'defer')
  set(htmlWebpackPlugin, 'options.base', '/')
  set(htmlWebpackPlugin, 'options.minify', isProduction)
  set(config, 'plugins', config.plugins.filter(plugin => plugin.constructor.name !== 'HtmlWebpackPlugin').concat([htmlWebpackPlugin]))

  return config
}

module.exports = rendererConfig
