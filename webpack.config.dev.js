const path = require('path')
const webpack = require('webpack')

module.exports = {
    devtool: 'cheap-module-eval-source-map',
    entry: [
        'webpack-hot-middleware/client',
        './src/index'
    ],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: '/static/'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    ],
    module: {
        loaders: [{
            test: /\.jsx?$/,
            loader: 'babel',
            query: {
                plugins: ['transform-runtime', 'transform-decorators-legacy'],
                presets: ['es2015', 'stage-0', 'react'],
            },
            exclude: [/node_modules/]
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
