# webpack 配置总结

## 1.安装webpack(4.x)

`npm install webpack webpack-cli webpack-dev-server --save-dev`

webpack-dev-server 是开发时的本地服务器，帮助我们实时编译代码，预览修改结果。

>Tips: 在安装一个要打包到生产环境的安装包时，你应该使用 npm install --save，如果你在安装一个用于开发环境的安装包（例如，linter, 测试库等），你应该使用 npm install --save-dev。

## 2. webpack 资源管理

webpack对html 图片，css，js，文件，字体进行如何管理

### 动态生成html（HTML Webpack Plugin）

`npm i html-webpack-plugin --save-dev`

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin')
 
module.exports = {
  entry: 'index.js',
  output: {
    path: __dirname + '/dist',
    filename: 'index_bundle.js'
  },
  plugins: [
    new HtmlWebpackPlugin()
  ]
}
```
### 处理css（scss，less）

`npm i style-loader css-loader postcss-loader --save-dev`

> style-loader 将生成的css 添加style标签插入 html head 中，css-loader 将css文件转化成commonjs 模块 允许我们 可以 import到我们的项目中，postcss-loader 允许我们使用最新的css语法。通常用于为我们的css样式添加浏览器前缀，提高兼容性。但是需要配合postcss.config.js 以及 autoprefixer package 实现

```javascript
module.exports = {
  mudule： {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader']
      }
    ]
  }
}
```
实现css 添加前缀，添加 autoprefixer , 新建postcss.config.js

`npm i autoprefixer --save`

```javascript
// postcss.config.js

module.exports = {
  plugins: [
    require('autoprefixer')()
  ]
}
```




