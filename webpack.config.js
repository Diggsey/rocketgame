const path = require('path');
const FlowWebpackPlugin = require('flow-webpack-plugin')

module.exports = {
    entry: './src/index.js',
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist'
    },
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                include: [path.resolve(__dirname, './src')],
                use: {
                    loader: 'babel-loader',
                    options: {}
                }
            }
        ]
    },
    plugins: [new FlowWebpackPlugin()]
}
