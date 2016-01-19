var webpackConfig = require('./webpack.config.test')
webpackConfig.devtool = 'inline-source-map'

module.exports = function(config) {
    config.set({
        browsers: ['Chrome'],
        singleRun: true,
        frameworks: ['mocha'],
        files: [
            'tests.loader.js'
        ],
        preprocessors: {
            'tests.loader.js': ['webpack', 'sourcemap']
        },
        reporters: ['mocha', 'coverage'],
        coverageReporter: {
            dir: 'build/coverage/',
            type: 'html'
        },

        webpack: webpackConfig,
        webpackServer: {
            noInfo: true
        },
        autoWatch: true
    })
}
