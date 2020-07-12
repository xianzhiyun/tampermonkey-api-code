const path = require('path') //path是Nodejs中的基本包,用来处理路径
const htmlWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
    cache: false,
    mode: 'none', // no defaults
    entry: path.resolve(__dirname, './src/main.js'),
    output: {
        path: path.resolve(__dirname, './dist'),
        // publicPath: '/dist/',
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, "src"),
        }
    },
    module: {
        rules: [
            //针对不同类型的文件,我们定义不同的识别规则,最终目的都是打包成js文件
            {
                test: /\.vue$/,
                exclude: /node_modules/,
                use: [
                    'vue-loader', //处理.vue文件
                ],
            },
            {// 添加这个json，解决如上的报错问题
                test: /\.(scss|css)$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.js?$/, //处理js
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env', '@babel/react'],
                            plugins: [
                                [
                                    require('@babel/plugin-proposal-decorators'),
                                    {legacy: true},
                                ],
                            ],
                        },
                    },
                ],
                include: path.resolve(__dirname, 'src'),
                exclude: /node_modules/,
            },
            {
                test: /\.(png|gif|jpg|jpeg|svg)$/, //处理图片
                exclude: /node_modules/,
                use: ['url-loader'],
            },
        ],
    },
    plugins: [
        new htmlWebpackPlugin({
            template: './index.html',
        }),
        new VueLoaderPlugin(), // vueLoader插件 允许你以一种名为单文件组件的格式撰写 Vue 组件
    ],
    devServer: {
        contentBase: path.join(__dirname, './dist'),
        host: 'localhost', //  可以设置0.0.0.0 ,这样设置你可以通过127.0.0.1或则localhost去访问
        open: true, //  项目启动时,会默认帮你打开浏览器
        port: 8088,
        // hot: true         //在单页面应用开发中,我们修改了代码后是整个页面都刷新,开启hot后,将只刷新对应的组件
    },
}
