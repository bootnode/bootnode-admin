const withBabelMinify  = require('next-babel-minify')

const withStylus   = require('@zeit/next-stylus')
const withCSS      = require('@zeit/next-css')
const postcss      = require('poststylus')
const autoprefixer = require('autoprefixer')
const comments     = require('postcss-discard-comments')
const rupture      = require('rupture')
const path         = require('path')

module.exports = withCSS(withStylus({
  stylusLoaderOptions: {
    use: [
      rupture(),
      postcss([
        autoprefixer({ browsers :'> 1%' }),
        'rucksack-css',
        'css-mqpacker',
        comments({ removeAll: true })
      ])
    ]
  },
  webpack: (config, options) => {
    let wbf = withBabelMinify({
      comments: false
    })

    config.plugins.push(
      wbf
    )

    if (!config.module.rules) {
      config.module.rules = []
    }

    config.module.rules.push({
      test: /\.mjs$/,
      type: 'javascript/auto',
    })

    return config
  }
}))

