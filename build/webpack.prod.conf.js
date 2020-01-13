/* eslint-disable */
const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
// 清除目录等
const cleanWebpackPlugin = require('clean-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const HtmlBeautifyPlugin = require('html-beautify-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlReplaceWebpackPlugin = require('html-replace-webpack-plugin')

const CssEntryPlugin = require('./plugins/CssEntryPlugin')
const HtmlEntryInject = require('./plugins/HtmlEntryInject')
const webpackConfigBase = require('./webpack.base.conf')
const utils = require('./utils')
const config = require('./config')


const entries = utils.getEntries()
if (config.build.includeDir.length > 0) {
  console.log(`你选择编译的文件夹名为：${config.build.includeDir}`)
}

const webpackConfigProd = {
  mode: 'production', // 通过 mode 声明生产环境
  entry: entries.entries,
  optimization: {
    // 样式优化
    minimizer: []
      .concat(
        config.build.uglify
          ? [
              new UglifyJsPlugin({
                uglifyOptions: config.uglifyjs
              })
            ]
          : []
      )
      .concat(config.build.uglify ? [new OptimizeCSSAssetsPlugin({})] : [])
  },
  plugins: [
    // 删除dist目录
    new cleanWebpackPlugin(['dist'], {
      root: path.resolve(__dirname, '../'),
      // verbose Write logs to console.
      verbose: true, // 开启在控制台输出信息
      // dry Use boolean 'true' to test/emulate delete. (will not remove files).
      // Default: false - remove files
      dry: false
    }),
    // 根据模块的相对路径生成一个四位数的hash作为模块id
    new webpack.HashedModuleIdsPlugin(),
    new CssEntryPlugin(),
    // 压缩抽离样式
    new MiniCssExtractPlugin({
      filename: config.build.hash
        ? 'css/[name].[chunkhash:7].css'
        : 'css/[name].css',
      chunkFilename: config.build.hash
        ? 'css/[name].[chunkhash:7].css'
        : 'css/[name].css'
    }),
    // html输出
    ...entries.htmlPlugins,
    new HtmlEntryInject(),
    new HtmlReplaceWebpackPlugin(config.htmlReplace),
    ...utils.getSpritePlugins(),
    new HtmlBeautifyPlugin(config.htmlPlugin.beautify)
  ],
  module: {}
}
// 分析依赖图 npm run build --report
if (process.env.npm_config_report) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
    .BundleAnalyzerPlugin
  webpackConfigProd.plugins.push(new BundleAnalyzerPlugin())
}
//console.log(webpackConfigProd.entry)
module.exports = merge(webpackConfigBase, webpackConfigProd)
