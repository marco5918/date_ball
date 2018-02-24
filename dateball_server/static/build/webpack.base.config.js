const path = require('path')
const webpack = require('webpack')
const pxtorem = require('postcss-pxtorem')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const sourcePath = path.join(__dirname, './static/src')
const outputPath = path.join(__dirname, './../output/dist/')

module.exports = {
  entry: {
    'admin' : './static/src/pages/admin.js',
    'work' : './static/src/pages/work.js',
    'index' : './static/src/pages/index.js',
    'error' : './static/src/pages/error.js',
    vendor:['react','react-dom','whatwg-fetch'],
  },
  output: {
    filename: 'js/[name].js',
    path: outputPath,
    publicPath: '/static/output/dist/',
  },
  module: {
    rules:[
      {
        test: /\.(js|jsx)$/,
        options: {
          plugins: [
            ['import', { libraryName: 'antd-mobile', style: true }],
          ],
          cacheDirectory: true,
        },
        exclude:/node_modules/,
        use:[
          {
            loader:'babel-loader',
            query:{
              cacheDirectory: true
            }
          }
        ]
      },
      {
        test:/\.css$/,
        use:ExtractTextPlugin.extract({
          fallback:"style-loader",
          use:['css-loader']
        }),
      },
      {
        test:/\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback:"style-loader",
          use:['css-loader','sass-loader']
        })
      },
      {
        test:/\.less$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: ['css-loader', 'less-loader']
        })
      },
    ]
  },
  resolve: {
    extensions: ['.js','.jsx','.web.js','.json','.web.jsx'],
    modules: [
      sourcePath,
      'node_modules'
    ]
  },
  plugins:[
    new ExtractTextPlugin('css/[name].css'),
    new webpack.optimize.CommonsChunkPlugin({
      names:['vendor'],
      minChunks: Infinity,
      filename: 'js/[name].js'
    }),
  ]
};
