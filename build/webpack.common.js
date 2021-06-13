const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCSSExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const fs = require('fs')
const paths = require('./paths')
const path = require('path')

const pages_dir = `${paths.src}/pages`
const pages_dirs = fs.readdirSync(pages_dir).filter(filename => filename.endsWith(''))

const component_dir = `${paths.src}/components`
const component_dirs = fs.readdirSync(component_dir).filter(filename => filename.endsWith(''))

module.exports = {
    entry: {
        headersAndFooters: paths.src + '\\headersAndFooters.js',
        somePage: paths.src + '\\somePage.js'
    },
    output: {
        filename: `${paths.assets}js/[name].js`,
        path: paths.dist
    },
    optimization: {
        splitChunks: {
            chunks: "all",
            minSize: 1,
            minChunks: 2
        }
    },
    module: {
        rules: [
            {
                test: /\.(scss|css)$/,
                use: [MiniCSSExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'],
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader'],
            },
            {
                test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
                type: 'asset/inline',
            },
            {
                test: /\.pug$/,
                loader: 'pug-loader'
            }
        ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        ...component_dirs.map(dir => new CopyWebpackPlugin({ 
            patterns: [
                { from: `${paths.src}/components/${dir}/img`, to: `${paths.dist}/assets/img`},
                { from: `${paths.src}/components/${dir}/fonts`, to: `${paths.dist}/assets/fonts`}
            ]}
        )),
        ...pages_dirs.map(dir => new CopyWebpackPlugin({
            patterns: [
                { from: `${paths.src}/pages/${dir}/img`, to: `${paths.dist}/assets/img`},
                { from: `${paths.src}/pages/${dir}/fonts`, to: `${paths.dist}/assets/fonts`},
            ]}
        )),
        ...pages_dirs.map(dir => new HtmlWebpackPlugin({
            template: `${pages_dir}/${dir}/${dir}.pug`,
            filename: `${dir}.html`,
            chunks: [`${dir}`],
            inject: 'body'
        })),
        new MiniCSSExtractPlugin({
            filename: `${paths.assets}css/[name].css`
        }),
    ],
}