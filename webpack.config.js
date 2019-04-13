'use strict';

const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const config = require('./package');

module.exports = (env, argv) => {

    const devMode = argv.mode !== 'production';

    let webpackConfig = {

        entry: './src/index.js',

        output: {
            path: path.resolve(__dirname, 'pub'),
            publicPath: '',
            filename: 'project.bundle.js'
        },

        module: {
            rules: [{
                test: [ /\.vert$/, /\.frag$/ ],
                use: 'raw-loader'
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            }]
        },

        plugins: [
            new HtmlWebpackPlugin({
                ...config,
                template: 'src/index.html'
            }),
            new webpack.DefinePlugin({
                'CANVAS_RENDERER': JSON.stringify(true),
                'WEBGL_RENDERER': JSON.stringify(true)
            })
        ],

        devServer: {
            contentBase: "./pub",
            host: "0.0.0.0",
            port: 8020
        }
    }

    if (!devMode) {
        // some more production stuff
        // ...
    }

    return webpackConfig;

};
