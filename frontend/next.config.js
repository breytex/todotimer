const withSass = require('@zeit/next-sass')
const withPlugins = require('next-compose-plugins')
const withCSS = require('@zeit/next-css')
const withFonts = require('next-fonts')

const sassConfig = {
  cssLoaderOptions: {
    importLoaders: 1,
    localIdentName: '[local]___[name]___[hash:base64:5]',
  },
}

const cssConfig = {}
module.exports = withPlugins([[withSass, sassConfig], [withCSS, cssConfig], [withFonts]])
