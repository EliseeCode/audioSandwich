const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
module.exports = {
    entry: ['babel-polyfill', path.join(__dirname, "src", "index.js")],
    output: {
        path: path.resolve(__dirname, "build"),
        // publicPath: path.resolve(__dirname, "build"),
        publicPath: '',
        globalObject: 'this',
    },

    module: {
        rules: [
            {
                test: /\.?js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ['@babel/preset-env',
                            ["@babel/preset-react", { "runtime": "automatic" }]
                        ]
                    }
                }
            },
            {
                test: /\.css$/i,
                //use: ["css-loader"],
                //use: ["style-loader", "css-loader"],
                use: [MiniCssExtractPlugin.loader, "css-loader"],
            },
            {
                test: /\.(png|jp(e*)g|svg|gif)$/,
                use: ['file-loader'],
            },
            {
                test: /\.svg$/,
                use: ['@svgr/webpack'],
            },
        ]
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: "public/css", to: "css" },
                { from: "public/js", to: "js" },
                { from: "public/audios", to: "audios" }
            ],
        }),
        new MiniCssExtractPlugin(),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "public", "index.html"),
        }),
    ],
}