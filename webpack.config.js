const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const { DefinePlugin } = require('webpack')

require('dotenv').config()
// Инициализация .ENV файла
const mode = process.env.NODE_ENV
const isDev = mode === 'development'

const plugins = [
	/*
	
	DefinePlugin является одним из плагинов, предоставляемых Webpack'ом, и используется для определения глобальных констант во время сборки. Он позволяет вам задать глобальные переменные, которые будут доступны во всем вашем коде, как если бы они были определены вручную.
	
	*/
	new DefinePlugin({
		'process.env':JSON.stringify(process.env)
	}),
	new CleanWebpackPlugin(),
	new HtmlWebpackPlugin({
		template: 'index.html',
		minify: {
			collapseWhitespace: !isDev,
			removeComments: !isDev
		}
	}),
	new MiniCssExtractPlugin({
		filename: isDev ? '[name].css' : '[name].[contenthash].css',
		chunkFilename: isDev ? '[id].css' : '[id].[contenthash].css'
	})
]

module.exports = {
	context: path.resolve(__dirname, 'src'),
	mode, 
	entry: './index.js',
	output: {
		filename: isDev ? '[name].js' : '[name].[contenthash].js',
		path: path.resolve(__dirname, 'dist'),
		assetModuleFilename: 'public/[name].[contenthash].[ext][query]'
	},
	resolve: {
		extensions: ['.js'],
		alias: {
			'@': path.resolve(__dirname, 'src/')
		}
	},
	devtool: isDev ? 'source.map' : false,
	devServer: {
		port: 7777,
		hot: true,
		static: {
			directory: path.join(__dirname, 'public')
		},
		historyApiFallback: true
	},
	optimization:{
		minimize: !isDev,
		minimizer: [
			new CssMinimizerPlugin(),
			new TerserPlugin({
				parallel: true,
				terserOptions: {
					format: {
						comments: false
					}
				}
			})
		]
	},
	plugins,
	module: {
		rules: [
			{
				test: /\.html$/i,
				loader: 'html-loader'
			}
		]
	}
}

