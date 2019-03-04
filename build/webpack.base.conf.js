const fs = require("fs");
const path = require("path");
const VueLoader = require("vue-loader/lib/plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");


const mode = process.env.NODE_ENV;
const devMode = process.env.NODE_ENV === "development";
console.log("devMode", devMode);

const pagesDirPath = path.resolve(__dirname, "../src/pages");
/**
 * 通过约定，降低编码复杂度
 * 每新增一个入口，即在src/pages目录下新增一个文件夹，以页面名称命名，内置一个index.js作为入口文件
 * 通过node的文件api扫描pages目录
 * 这样可以得到一个形如{page1: "入口文件地址", page2: "入口文件地址", ...}的对象
 */
const getEntries = () => {
    let result = fs.readdirSync(pagesDirPath);
    let entry = {};
    result.forEach(item => {
        entry[item] = path.resolve(__dirname, `../src/pages/${item}/index.js`);
    });
    return entry;
}
// getEntries();
/**
 * 扫描pages文件夹，为每个页面生成一个插件实例对象
 */
const generatorHtmlWebpackPlugins = () => {
    const arr = [];
    let result = fs.readdirSync(pagesDirPath);
    result.forEach(item => {
        //判断页面目录下有无自己的index.html
        let templatePath;
        let selfTemplatePath = pagesDirPath + `/${item}/index.html`;
        let publicTemplatePath = path.resolve(__dirname, "../src/public/index.html");
        try {
            fs.accessSync(selfTemplatePath);
            templatePath = selfTemplatePath;
        } catch(err) {
            templatePath = publicTemplatePath;
        }
        arr.push(new HtmlWebpackPlugin({
            template: templatePath,
            filename: `${item}.html`,
            chunks: ["manifest", "vendor", item]
        }));
    });
    return arr;
}

module.exports = {
    mode,
    entry: getEntries(),
    // entry: path.resolve(__dirname, "../src/pages/P1/index.js"),
    // entry: "./src/index.js",
    output: {
        publicPath: devMode ? "" : "/",
        filename: devMode ? "[name].js" : "static/js/[name].[chunkhash].js",
        path: path.resolve(__dirname, "../dist")
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: "babel-loader"
            },
            {
                test: /\.vue$/,
                use: "vue-loader"
            },
            // {
            //     test: /\.css$/,
            //     use: ["style-loader", "css-loader"]
            // },
            {
                test: /\.(sc|sa|c)ss$/,
                use: [
                    devMode ? "style-loader" : MiniCssExtractPlugin.loader,
                    "css-loader", 
                    "sass-loader"
                ]
            },
            {
                test: /\.(png|jpg|gif)$/i,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            limit: 8192,
                            name: devMode ? "[name].[hash:8].[ext]" : "static/images/[name].[hash:8].[ext]",
                            // publicPath: "/static/"
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new VueLoader(),
        new MiniCssExtractPlugin({
            filename: devMode ? "[name].css" : "static/css/[name].[hash].css",
            chunkFilename: devMode ? "[id].css" : "static/css/[id].[hash].css"
        }),
        // new CleanWebpackPlugin(path.resolve(__dirname, "../dist")),
        ...generatorHtmlWebpackPlugins(),
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, "../src/public/static"),
            to: path.resolve(__dirname, "../dist/static")
        }])
        // new HtmlWebpackPlugin()
    ],
    resolve: {
        extensions: [".js", ".vue"]
    }
}