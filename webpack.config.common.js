const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')

module.exports = {
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
    }],

    // https://www.npmjs.com/package/html-webpack-plugin - generate our html
    // file from a template - makes it easier to include custom stuff
    indexPagePlugin: new HtmlWebpackPlugin({
        inject: true,
        title: 'KanBan',
        filename: 'index.html',
        template: './src/index.html'
    })

}
