// webpack2 需要引入path 使用绝对路径
const path = require("path");

module.exports = {
    //mode: "production",
    mode: "development",
    //  入口文件
    entry: "./src/Plumb.js",

    //  输出文件
    output: {
        //  输出的文件名字
        filename: "bulid.js",

        // 输出的文件地址  path对应一个绝对路径，此路径是你希望一次性打包的目录。
        path: path.resolve(__dirname, "dist"),

        libraryTarget: "umd"
    },

    //模块
    module: {
        // 加载器
        rules: [
            {
                test: /\.js$/, //匹配.js文件
                //排除也就是不转换node_modules下面的.js文件
                exclude: /(node_modules|bower_components)/,
                //加载器  webpack2需要loader写完整 不能写babel 要写 bable-loader
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            presets: ["es2015"] //转码规则
                        }
                    }
                ]
            }
        ]
    }
};
