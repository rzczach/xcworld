const path = require('path');

 const config= {
    entry: path.resolve(__dirname, 'src/index.js'),
    output: {
        path: path.resolve(__dirname, 'output'),
        filename: '[name].js',
        publicPath: '/',
		chunkFilename: '[name].[chunkhash:5].chunk.js',
    },
    devtool: 'eval-source-map', 
    mode: "development", // 开发模式
    devServer: {
        disableHostCheck: true, // 新版的webpack-dev-server出于安全考虑，默认检查hostname，如果hostname不是配置内的，将中断访问
        port: 7070,
        hot: true,
        inline: true, // 实时刷新
        open: true // 打开浏览器
    }
};

module.exports = config;