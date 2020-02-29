/* eslint-disable no-undef */
const path = require('path')
var fs = require('fs')
var nodeModules = {}
fs.readdirSync('node_modules')
    .filter((x) => {
        return ['.bin'].indexOf(x) === -1
    })
    .forEach((mod) => {
        nodeModules[mod] = 'commonjs ' + mod
    })

const FilterWarningsPlugin = require('webpack-filter-warnings-plugin')

module.exports = {
    entry: './src/server.ts',
    plugins: [
        //ignore the drivers you don't want. This is the complete list of all drivers -- remove the suppressions for drivers you want to use.
        new FilterWarningsPlugin({
            exclude: [
                /mongodb/,
                /mssql/,
                /mysql/,
                /mysql2/,
                /oracledb/,
                /pg/,
                /pg-native/,
                /pg-query-stream/,
                /react-native-sqlite-storage/,
                /redis/,
                /sql.js/,
                /typeorm-aurora-data-api-driver/,
            ],
        }),
    ],
    output: {
        filename: 'server.js',
        path: path.resolve(__dirname, 'dist'),
    },
    resolve: {
        // Add '.ts' and '.tsx' as a resolvable extension.
        extensions: [
            '.webpack.js',
            '.web.js',
            '.ts',
            '.tsx',
            '.js',
            '.json',
        ],
    },
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: 'ts-loader',
            },
            {
                test: /\.js?$/,
                use: 'remove-hashtag-loader',
            },
        ],
    },
    resolveLoader: {
        alias: {
            'remove-hashtag-loader': path.join(__dirname, './loaders/remove-hashtag-loader'),
        },
    },
    target: 'node',
    mode: 'development',
    externals: {
        express: 'commonjs express',
        sqlite3: 'commonjs sqlite3',
        typeorm: 'commonjs typeorm',
    },
}
