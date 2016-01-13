const path = require('path')
const webpack = require('webpack')

module.exports = {
    devtool: 'source-map',
    module: {
        loaders: [{
            test: /\.jsx?$/,
            loader: 'babel',
            query: {
                plugins: ['transform-runtime', 'transform-decorators-legacy'],
                presets: ['es2015', 'stage-0', 'react'],
            },
            exclude: /node_modules/
        }],
        postLoaders: [{
            //delays coverage til after tests are run,
            //fixing transpiled source coverage error
            test: /\.js$/,
            exclude: /(test|node_modules)\//,
            loader: 'istanbul-instrumenter'
        }]
    },
    resolve: {
        extensions: ['', '.js', '.jsx'],
        alias: {
            app: '../src'
        }
    }

}
