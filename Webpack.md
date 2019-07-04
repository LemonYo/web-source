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
> useBuiltIns、transform-runtime配到一起是错的，真是误人子弟。如果用useBuiltIns，就安装core-js@2到生产环境
，core-js@2相当于@babel/polyfill，可以按需加载。如果使用transform-runtime就不要配useBuiltInsor。所以开发一个项目可以这么配。
`npm install --save core-js@2`
```javascript
//.babelrc
{
    "presets":[
        ["@babel/preset-env",{
            "modules": false,
            "targets":{
                "browsers":[">1%","last 2 versions"]
            },
            "useBuiltIns":"usage"
        }]
    ],
    "plugins": [
        "syntax-dynamic-import",// 异步加载语法编译插件
        "lodash"
    ]
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
更多的文件处理翻阅对应的loader

## 3. 管理输出

利用html-webpack-plugin 生成对应的html模板，并将我们生成的js， css， img，font 引入到我们的html中，在生产环境下，我们频繁跟换我们的webpack配置，为了避免dist 文件夹下的文件混乱，在bulid 的时候 建议使用 clean-webpack-plugin 清除dist文件下的旧数据

`npm i html-webpack-plugin clean-webpack-plugin --save-dev`

```javascript
// webpack.prod.js
const cleanWebpackPlugin = require('clean-webpack-plugin')
const htmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  plugins: [
    new cleanWebpackPlugin(),
    new htmlWebpackPlugin({
      title：String,
      filename: String, // 默认是 index.html
      template：'', // 模板的路径
    })
  ]
}
```
## 4.source-map
sourceMap本质上是一种映射关系，打包出来的js文件中的代码可以映射到代码文件的具体位置,这种映射关系会帮助我们直接找到在源代码中的错误。可以直接在devtool中使用.合理的使用source-map可以帮助我们提高开发效率，更快的定位到错误位置。
生产环境和开发环境的devtool配置是不同的。我们可以在webpack.dev.js中添加devtoo

```javascript
devtool:"cheap-module-eval-source-map",// 开发环境配置最佳实践
devtool:"cheap-module-source-map",   // 生产配置最佳实践
```
## 5.模块热替换

`npm i webpack-dev-server --save-dev`

```
// webapack.dev.js

module.exports = {
  devServer: {
    hot: true, // 开启热更新模块
    open：true， // 项目启动自动打开系统默认浏览器
    compress: true, // 是否启用gzip压缩
    host： '192.168.0.8', // 指定主机的host，
    port：'8080',
    proxy: {
      "/api": {
        target: proxyIp,
        changeOrigin: true
      }
    }
  }
}
```







