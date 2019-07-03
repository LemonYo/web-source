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

`npm i autoprefixer --save-dev`

```javascript
// postcss.config.js

module.exports = {
  plugins: [
    require('autoprefixer')()
  ]
}
```
配置 sass 文件

`npm i sass-loader node-sass --save-dev`

```javascript
module.exports = {
  mudule： {
    rules: [
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
      }
    ]
  }
}
```
配置 less 文件

`npm i less-loader less --save-dev`

```javascript
module.exports = {
  mudule： {
    rules: [
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'less-loader']
      }
    ]
  }
}
```
### 编译es6, react

转化es6 通常用babel

`npm i babel-loader @babel/core @babel/preset-env --save-dev`

> babel-loader webpack处理的js的加载器，@babel/core 是 babel 的 核心库，@babel/preset-env 允许我们用 es6 更高标准的的语法

通用配置

```javascript
// wepack.js
moule.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: babel-loader
      }
    ]
  }
}
// .babelrc
{
  "presets": ['@babel/preset-env']
}
```
解析 react jsx 语法
`npm i react react-router-dom react-dom --save`
`npm i @babel/preset-react --save-dev`
```javascript
moule.exports = {
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: babel-loader
      }
    ]
  }
}
// .babelrc
{
  "presets": ['@babel/preset-env', '@babel/preset-react']
}
```
添加polyfill，解决低版本浏览器对某些语法的不支持 map，set，generator，async await promise

`npm i @babel/polyfill --save`

> 因为会被编译到我们的代码中，所以是一个dependency not devDependency
```javascript
// 项目的入口文件 比如main.js
require("@babel/polyfill"); or import "@babel/polyfill";
// 或者在webpack里配置入口的时候加上去
module.exports = {
  entry： ['@babel/polyfill', './main.js']
}
```
但是这会使我们的bundle 的体积增大，所以我们按需引入我们的ployfill
```javascript
// .babelrc
{
  "presets": [["@babel/preset-env", {
    "useBuiltIns": "usage",
    "corejs": 2
  }]],
}
```
> 扩展：如果是开发工具库，想要实现按需替换，可以使用下面下面两个工具来实现 @babel/plugin-transform-runtime避免 polyfill 污染全局变量，减小打包体积，因此更适合作为开发工具库。corejs 更适合生成bundle

`npm i @babel/plugin-transform-runtime @babel/runtime --save-dev`
```javascript
{
  "presets": ["@babel/preset-env"],
  "plugins": ["@babel/plugin-transform-runtime"]
}
```

### 处理图片,字体文件

url-loader 和 file-loader来处理静态资源，它允许我们可以支持我们使用require/import 引入资源。file-loader可以为资源生成对应的文件夹,url-loader 的作用是可以返回一个dataurl图片，当定义最小的图片字节，这样图片就可以无需从服务器请求获取，直接加载渲染。同时当大于限制的最小值，就使用file-loader打包到我们的项目中去。

`npm i url-loader file-loader --save-dev`

```javascript
module: {
  rules: [
    {
      test: /\.(png|jpg|jpeg|gif)$/,
      use: [
        {
          loader: 'url-loader',
          options: {
            name: '[name]_[hash].[ext]', // 文件名
            outputPath：'imgs/'
            limit: 8192 // 当小于8Kb时生成dataurl
          }
        }
      ]
    },
    {
      test: /\.(eot|woff2?|ttf|svg)$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: '[name]_[hash].[ext]', // 文件名
            outputPath：'fonts/'
            limit: 5000 
          }
        }
      ]
    }
  ]
}
```






