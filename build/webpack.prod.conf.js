const merge = require("webpack-merge");
const baseConfig = require("./webpack.base.conf.js");
module.exports = merge(baseConfig, {
    optimization: {
        runtimeChunk: {
            name: "manifest"
        },
        splitChunks: {
            cacheGroups: {
                vendors: {
                    name: "vendor",
                    filename: "static/js/vendor.[chunkhash].js",
                    test: /(vue|vuex)/,
                    chunks: "initial"
                }
            }
        }
    }
});