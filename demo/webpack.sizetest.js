const { merge } = require("webpack-merge");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

const common = require("./webpack.common.js");

module.exports = merge(common, {
    mode: "production",
    plugins: [
        new BundleAnalyzerPlugin({
            analyzerMode: "static",
        }),
    ],
});
