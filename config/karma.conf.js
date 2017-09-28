// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html
'use strict';

module.exports = function(config) {
    config.set({
        // base path, that will be used to resolve files and exclude
        basePath: '../',

        // testing framework to use (jasmine/mocha/qunit/...)
        frameworks: ['jasmine'],

        // list of files / patterns to load in the browser
        files: [
            'config/test.js',
            'dist/bmoor-data.js',
            //------------
            'src/**/*.spec.js'
        ],

        // list of files / patterns to exclude
        exclude: [],

        preprocessors: {
            'src/**/*.spec.js': ['webpack']
        },

        webpack: {
            module: {
                loaders: [{
                    test: /\.js$/,
                    loader: "babel-loader",
                    query: {
                        presets: ['es2015']
                    }
                }]
            }
        },

        webpackMiddleware: {
            // webpack-dev-middleware configuration
            // i.e.
            noInfo: true,
            // and use stats to turn off verbose output
            stats: {
                // options i.e.
                chunks: false
            }
        },

        plugins: [
            require("karma-webpack"),
            'karma-jasmine',
            'karma-phantomjs-launcher'
        ],

        client: {
            captureConsole: true
        },

        reporters: ['progress'],

        // web server port
        browserNoActivityTimeout: 100000,
        port: 9999,
        browsers: ['PhantomJS'],

        // level of logging
        // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,

        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: true
    });
};
