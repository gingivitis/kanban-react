const commonConfig = require('./webpack.config.common')

const devLoaders = [{
    test: /\.jsx?$/,
    loaders: [
        'react-hot',
        'babel?presets[]=react,presets[]=es2015,presets[]=stage-0&plugins[]=transform-runtime,plugins[]=transform-decorators-legacy'
    ],
    // query: {
    //     plugins: ['transform-runtime', 'transform-decorators-legacy'],
    //     presets: ['es2015', 'stage-0', 'react'],
    // },
    exclude: [/node_modules/]
}]

module.exports = {
    devtool: 'eval',
    entry: [
        'webpack-dev-server/client?http://localhost:8080',
        'webpack/hot/only-dev-server',
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
        // new webpack.NoErrorsPlugin()
        commonConfig.indexPagePlugin
    ],
    module: {
        loaders: commonConfig.loaders.concat(devLoaders)
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    }

}
