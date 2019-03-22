const path = require("path");
const webpack = require("webpack");
const autoprefixer = require('autoprefixer'); // css

const HtmlWebpackPlugin = require('html-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const HappyPack = require('happypack');
const os = require('os');
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });
const SRC_PATH = path.resolve(__dirname, 'src');
const babelExclude = []; // 不使用babel解析的文件
const devConfig = {
    mode: 'development',
    // entry: ['@babel/polyfill', path.resolve(__dirname, 'src', 'index.js')],
    entry: path.resolve(__dirname, 'src', 'index.js'),
    output: {
        publicPath: '/'
    },
    devtool: 'eval-source-map',
    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.js?$/,
                exclude: /(node_modules)/,
                use: 'happypack/loader?id=eslint',
            },
            {
                react: {
                    test: /\.js?$/,
                    exclude: [/node_modules\/(react|react-dom|react-router|history|antd|antd-mobile)\//].concat(babelExclude),
                    use: 'happypack/loader?id=js'
                }
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            ident: 'postcss',
                            sourceMap: true,
                            plugins: (loader) => [
                                autoprefixer({
                                    browsers: ['last 100 versions']
                                })
                            ]
                        }
                    }
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            ident: 'postcss',
                            sourceMap: true,
                            plugins: (loader) => [
                                autoprefixer({
                                    browsers: ['last 100 versions']
                                })
                            ]
                        }
                    },
                    'sass-loader'
                ]
            },
            {
                test: /\.(png|jpg|gif|svg|jpeg)$/,
                use: [
                    'url-loader'
                ]
            },
            {
                test: /\.(woff|woff2|svg|eot|ttf|otf)$/,
                use: [
                    'file-loader'
                ]
            }
        ]
    },
    resolve: {
        alias: {
            Styles: path.resolve(SRC_PATH, 'styles'), // src/styles
            Medias: path.resolve(SRC_PATH, 'medias'), // src/medias
            Components: path.resolve(SRC_PATH, 'components'), // src/components
            Utils: path.resolve(SRC_PATH, 'utils'), // src/utils
            Modules: path.resolve(SRC_PATH, 'modules'), // src/modules
            Libs: path.resolve(SRC_PATH, 'libs') // src/libs
        },
        extensions: ['.js', '.scss', '.sass', '.css', '.json'],
    },
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        // 全局定义插件，定义了 __DEV__ 变量
        new webpack.DefinePlugin({
            __DEV__: JSON.stringify(process.env.KS_ENV || '')
        }),
        // html插件, 将打包文件注入html中并生成新的html文件
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.resolve(__dirname, src, 'index.html'),
            inject: 'body',
            hash: false,
            minify: {
                removeComments: true,
                collapseWhitespace: false
            },
            projectPath,
            env: true
        }),
        // stylelint 插件，开启stylelint检查
        new StyleLintPlugin({
            context: path.resolve(__dirname),
            files: styleFiles,
            syntax: 'scss'
        }),
        new HappyPack({
            id: 'js',
            threadPool: happyThreadPool,
            loaders: getJsLoaders(__dirname, babelrc).react
        }),
        new HappyPack({
            id: 'eslint',
            threadPool: happyThreadPool,
            loaders: getEslintLoaders(process.env.KS_ENV === 'debug' ? '' : 'prod')
        }),
    ],
    // devServer: {
    //     disableHostCheck: true,
    //     historyApiFallback: true,
    //     port: 8889,
    //     proxy: {
    //         '/dapi/**': {
    //             target: `http://weixin.kaishustory.com/dapi`,
    //             secure: false,
    //             changeOrigin: true,
    //             pathRewrite: {
    //                 '^/dapi': ''
    //             }
    //         },
    //         '/sapi/**': {
    //             target: 'http://weixin.kaishustory.com',
    //             secure: false,
    //             changeOrigin: true,
    //             pathRewrite: {
    //                 '^/sapi': ''
    //             }
    //         }
    //     },
    //     // stats: verbose ? {} : 'errors-only'
    // }
}
module.exports = devConfig;
