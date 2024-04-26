const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
    entry: {
        main: "./src/index.ts",
    },
    plugins: [
        new CleanWebpackPlugin({
            cleanStaleWebpackAssets: false,
        }),
        new HtmlWebpackPlugin({
            filename: "index.html",
            template: "./src/index.html",
            chunks: ["main"],
        }),
    ],
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, "dist"),
        assetModuleFilename: "[name]-[hash][ext][query]",
    },
    resolve: {
        extensions: ["*", ".js", ".ts", ".tsx"],
        alias: {
            "pixi.js": path.resolve("./node_modules/pixi.js"),
            "pixi.js-legacy": path.resolve("./node_modules/pixi.js-legacy"),
            "@remvst/game-navigation-core": path.resolve(
                "./node_modules/@remvst/game-navigation-core",
            ),
            "@remvst/game-navigation-html": path.resolve(
                "./node_modules/@remvst/game-navigation-html",
            ),
            "@remvst/game-navigation-react": path.resolve(
                "./node_modules/@remvst/game-navigation-react",
            ),
            "@remvst/game-navigation-pixi": path.resolve(
                "./node_modules/@remvst/game-navigation-pixi",
            ),
        },
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
};
