var webpack = require('webpack')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.config')

module.exports = merge(baseWebpackConfig,{
  plugins:[
    new webpack.DefinePlugin({
      'process.env':{
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      compress:{
        warnings: false,
      }
    })
  ]
})
