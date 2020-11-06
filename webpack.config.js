/**
 * Webpack configuration
 *
 * @author Codex Team
 * @copyright Khaydarov Murod
 */
'use strict';

module.exports = (env, argv) => {
  const path = require('path');
  const pkg = require('./package.json');

  /**
   * Environment
   *
   * @type {any}
   */
  const NODE_ENV = argv.mode || 'development';
  const VERSION = process.env.VERSION || pkg.version;

  /**
   * Plugins for bundle
   *
   * @type {webpack}
   */
  const webpack = require('webpack');


    return  {
    entry: [ './src/index.js'],
    module: {
        rules: [
            {
            test: /\.js$/,
            exclude: /node_modules/,
            use: [
            {
                loader: 'babel-loader',
            },
            ]
        },
        ]
    },
     plugins: [
      /** Pass variables into modules */
      new webpack.DefinePlugin({
        NODE_ENV: JSON.stringify(NODE_ENV),
        VERSION: JSON.stringify(VERSION),
      }),

      new webpack.BannerPlugin({
        banner: `file plugin\n\n@version ${VERSION}\n\n@package https://github.com/sosie-js/file-plugin\n@licence MIT\n@author SoSIE <https://sosie.sos-productions.com> \nuses FileSaver.js By Eli Grey, http://eligrey.com\nuses downloadjs v4.21, by dandavis; 2008-2018. [MIT] 
  */`,
      }),
     ],
    output: {
        path: __dirname + '/dist',
        publicPath: '/',
        filename: 'bundle.js',
        library: 'FilePlugin',
        libraryTarget: 'umd'
    }
  };
};


