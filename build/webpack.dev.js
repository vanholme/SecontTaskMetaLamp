const webpack = require('webpack')
const { merge } = require('webpack-merge')

const common = require('./webpack.common')
const paths = require('./paths')

module.exports = merge(common, {
    mode: 'development',
    target: 'web',
    devServer: {
        contentBase: paths.dist,
        open: true,
        hot: true,
        port: 8080,
        writeToDisk: true,
        serveIndex: true,
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
})