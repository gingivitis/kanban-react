var webpackConfig = require('./webpack.config.test')
webpackConfig.devtool = 'inline-source-map'

module.exports = function(config) {
    config.set({
        browsers: ['PhantomJS'],
        singleRun: true,
        frameworks: ['mocha', 'chai', 'sinon', 'sinon-chai'],
        files: [
            'tests.webpack.js'
        ],
        plugins: [
            'karma-phantomjs-launcher',
            'karma-chai',
            'karma-coverage',
            'karma-mocha',
            'karma-sourcemap-loader',
            'karma-webpack',
            'karma-mocha-reporter',
            'karma-sinon',
            'karma-sinon-chai'
        ],
        preprocessors: {
            'tests.webpack.js': ['webpack', 'sourcemap']
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
