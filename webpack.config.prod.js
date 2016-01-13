const path = require('path')
const webpack = require('webpack')

module.exports = {
    devtool: 'source-map',
    entry: [
        './src/index'
    ],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: '/static/'
    },
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compressor: {
                warnings: false
            }
        })
    ],
    module: {
        loaders: [{
            test: /\.jsx?$/,
            loader: 'babel',
            query: {
                plugins: ['transform-runtime', 'transform-decorators-legacy'],
                presets: ['es2015', 'stage-0', 'react'],
            },
            include: path.join(__dirname, 'src')
        }, {
            test: /\.css$/,
            loader: 'style!css',
            include: path.join(__dirname, 'src')
        }, {
            test: /\.less$/,
            loader: 'style!css!less'
        }, {
            test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
            loader: 'url?limit=10000'
        }]
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    }
}
