const path = require("path");
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const root = path.join(__dirname);
const src = path.join(root, "src");

const postCssLoaderConf = {
	loader: "postcss-loader",
	options: {
		plugins: [
			require("postcss-preset-env")({
				autoprefixer: {
					grid: true
				}
			})
		]
	}
}

const miniCssExtractPluginLoaderConf = {
	loader: MiniCssExtractPlugin.loader
}

module.exports = (env, options) => {

	const productionMode = options.mode === "production";

	return {
		entry: {
			app: path.join(src, "main.js")
		},
		output: {
			path: path.resolve(root, "dist"),
			filename: "[name].js"
		},
		stats: {

		},
		module: {
			rules: [
				{
					test: /\.pug$/,
					use: [
						"raw-loader",
						"pug-html-loader"
					]
				},
				{
					test: /\.css$/,
					use: [
						productionMode ? miniCssExtractPluginLoaderConf : "style-loader",
						{
							loader: "css-loader",
							options: {
								importLoaders: 1
							}
						},
						postCssLoaderConf
					]
				},
				{
					test: /\.(sa|sc|c)ss$/,
					use: [
						productionMode ? miniCssExtractPluginLoaderConf : "style-loader",
						{
							loader: "css-loader",
							options: {
								importLoaders: 2
							}
						},
						postCssLoaderConf,
						"sass-loader"
					]
				},
				{
					test: /\.js$/,
					exclude: /(node_modules)/,
					use: {
						loader: "babel-loader",
						options: {
							presets: ["env", "es2015", "stage-0"]
						}
					}
				}
			]
		},
		plugins: [
			new webpack.HotModuleReplacementPlugin(),
			new CleanWebpackPlugin("dist"),
			new CopyWebpackPlugin([
				{from: "public", to: ""}
			]),
			new HtmlWebpackPlugin({
				title: "index.html",
				template: path.join(src, "index.pug")
			}),
			new MiniCssExtractPlugin({
				filename: productionMode ? "[name].css" : "[name].[hash].css",
				chunkFilename: productionMode ? "[id].css" : "[id].[hash].css",
			})
		],
		devServer: {
			contentBase: path.join(root, "public"),
			compress: true,
			port: process.env.DEV_PORT,
			host: "0.0.0.0",
			disableHostCheck: true,
			historyApiFallback: true,
			hot: true,
			inline: true,
			publicPath: "/"
		},
		resolve: {
			extensions: [".js", ".css"],
			alias: {
				"@": src,
				"@@": root
			}
		}
	}
};