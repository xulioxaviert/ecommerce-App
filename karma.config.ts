import { Config } from 'karma';

// karma.conf.js
module.exports = function (config: Config) {
  config.set({
    basePath: '',
    frameworks: [ 'jasmine' ],
    files: [
      'src/**/*.js',
      'test/**/*.spec.js'
    ],
    exclude: [],
    preprocessors: {},
    reporters: [ 'progress' ],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: [ 'Chrome' ],
    singleRun: false,
    concurrency: Infinity
  });
};
