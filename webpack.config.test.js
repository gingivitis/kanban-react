const path = require('path')
const webpack = require('webpack')

module.exports = {
    devtool: 'source-map',
    module: {
        preLoaders: [{
            test: /\.(js|jsx)$/,
            include: /src/,
            exclude: /node_modules/,
            loader: 'isparta'
        }],
        loaders: [{
            test: /\.jsx?$/,
            loader: 'babel',
            query: {
                plugins: ['transform-runtime', 'transform-decorators-legacy'],
                presets: ['es2015', 'react', 'stage-0'],
            },
            exclude: /node_modules/
        }, {
            test: /sinon\.js$/,
            loader: 'imports?define=>false,require=>false'
        }, {
            test: /\.json$/,
            loader: 'json'
        }],
        // postLoaders: [{
        //     //delays coverage til after tests are run,
        //     //fixing transpiled source coverage error
        //     test: /\.js$/,
        //     exclude: /(test|node_modules)\//,
        //     loader: 'istanbul-instrumenter'
        // }]
    },
    resolve: {
        extensions: ['', '.js', '.jsx'],
        alias: {
            app: path.resolve(__dirname, 'src'),
            sinon: 'sinon/pkg/sinon'
        }
    },
    isparta: {
        embedSource: true,
        noAutoWrap: true,
        // these babel options will be passed only to isparta and not to babel-loader
        babel: {
            plugins: ['transform-runtime', 'transform-decorators-legacy'],
            presets: ['es2015', 'react', 'stage-0']
        }
    },
    externals: {
        'jsdom': 'window',
        'cheerio': 'window',
        'react/lib/ExecutionEnvironment': true,
        'react/lib/ReactContext': 'window',
        'text-encoding': 'window'
    }
}
