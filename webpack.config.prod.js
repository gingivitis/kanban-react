const commonConfig = require('./webpack.config.common')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// const path = require('path')
const webpack = require('webpack')

const prodLoaders = [{
    test: /\.jsx?$/,
    loader: 'babel',
    query: {
        plugins: ['transform-runtime', 'transform-decorators-legacy'],
        presets: ['es2015', 'stage-0', 'react'],
    },
    exclude: [/node_modules/]
}]

module.exports = {
    devtool: 'source-map',
    entry: [
        './src/index'
    ],
    output: {
        path: './build',
        filename: 'bundle.[hash].js'
    },
    devServer: {
        proxy: {
            '/api/*': 'http://localhost:5000/'
        }
    },
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            minimize: true,
            compressor: {
                warnings: false
            }
        }),
        commonConfig.indexPagePlugin
    ],
    module: {
        loaders: commonConfig.loaders.concat(prodLoaders)
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    }
}
