const { merge } = require('webpack-merge')
const path = require('path')

const config = require('./webpack.config.js')

module.exports = merge(config, {
    mode: 'development',

    devtool: 'inline-source-map',

    //refer to migration guide regarding changes on writeToDisk option for the devServer
    devServer: {
        devMiddleware: {
            writeToDisk: true,
        }
    },

    output: {
        path: path.resolve(__dirname, 'public')
    }
})