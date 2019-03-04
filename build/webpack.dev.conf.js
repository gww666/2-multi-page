const Webpack = require("webpack");
const merge = require("webpack-merge");
const baseConfig = require("./webpack.base.conf.js");
module.exports = merge(baseConfig, {
    devServer: {
        port: 8086,
        host: "0.0.0.0",
        hot: true
    },
    plugins: [
        new Webpack.NamedModulesPlugin(),
        new Webpack.HotModuleReplacementPlugin()
    ]
});
