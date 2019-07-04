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
      hash：true, // 防止缓存
      minfy： {
        removeAttributeQuates: true // 压缩并且去掉引号
      }
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

react: [react-hot-loader]("https://www.npmjs.com/package/react-hot-loader")

## 6. 生产环境构建

开发环境(development)和生产环境(production)的构建目标差异很大。在开发环境中，我们需要具有强大的、具有实时重新加载(live reloading)或热模块替换(hot module replacement)能力的 source map 和 localhost server。而在生产环境中，我们的目标则转向于关注更小的 bundle，更轻量的 source map，以及更优化的资源，以改善加载时间。由于要遵循逻辑分离，我们通常建议为每个环境编写彼此独立的 webpack 配置。

### js tree shaking

tree shaking 是一个术语，通常用于描述移除 JavaScript 上下文中的未引用代码(dead-code)。它依赖于 ES2015 模块系统中的静态结构特性，例如 import 和 export。这个术语和概念实际上是兴起于 ES2015 模块打包工具 rollup。

新的 webpack 4 正式版本，扩展了这个检测能力，通过 package.json 的 "sideEffects" 属性作为标记，向 compiler 提供提示，表明项目中的哪些文件是 "pure(纯的 ES2015 模块)"，由此可以安全地删除文件中未使用的部分。

> 支持es6的import模块，不支持commonjs 模块，因为commonjs 是动态引入，而es6是静态引入

```
// webpack.dev.js
  optimization: {   // 开发环境时使用
        usedExports: true
    },
        
// package.json
  "sideEffects": [
    "*.css"
  ],

// 如果在项目中使用类似 css-loader 并 import 一个 CSS 文件，则需要将其添加到 side effect 列表中，以免在生产模式中无意中将它删除
```
***注意：mode 选项设置为 production，可以自动启用 minification(代码压缩) 和 tree shaking***


### css tree shaking

`npm i glob-all purify-css purifycss-webpack --save-dev`

```
const PurifyCSS = require('purifycss-webpack')
const glob = require('glob-all')
plugins:[
    // 清除无用 css
    new PurifyCSS({
      paths: glob.sync([
        // 要做 CSS Tree Shaking 的路径文件
        path.resolve(__dirname, './src/*.html'), // 请注意，我们同样需要对 html 文件进行 tree shaking
        path.resolve(__dirname, './src/*.js')
      ])
    })
]

参考至链接：https://juejin.im/post/5cfe4b13f265da1bb13f26a8

```

### 代码压缩

默认 mode：production 自动可以代码压缩，也可以配合uglifyjs-webpack-plugin 使用

`npm i uglifyjs-webpack-plugin --save-dev`

```
// webpack.prod.js

const UglifyJSPlugin = require('uglifyjs-webpack-plugin ')

plugins: [
  new UglifyJSPlugin()
]

```

### 制定生产环境

许多 library 将通过与 process.env.NODE_ENV 环境变量关联，以决定 library 中应该引用哪些内容。例如，当不处于生产环境中时，某些 library 为了使调试变得容易，可能会添加额外的日志记录(log)和测试(test)。其实，当使用 process.env.NODE_ENV === 'production' 时，一些 library 可能针对具体用户的环境进行代码优化，从而删除或添加一些重要代码。我们可以使用 webpack 内置的 DefinePlugin 为所有的依赖定义这个变量：

```
// 通常指定 mode：production 就可以，对于旧版本的webpack 可以通过指定

  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('production')
  })

```

### js css 代码分离

把代码分离到不同的 bundle 中，然后可以按需加载或并行加载这些文件。代码分离可以用于获取更小的 bundle，以及控制资源加载优先级，如果使用合理，会极大影响加载时间。

#### js代码分离

```
optimization: {
  splitChunks: {
      chunks: "all",    // 只对异步引入代码起作用，设置all时并同时配置vendors才对两者起作用
      minSize: 30000,   // 引入的库大于30kb时才会做代码分割
      minChunks: 1,     // 一个模块至少被用了1次才会被分割
      maxAsyncRequests: 5,     // 同时异步加载的模块数最多是5个，如果超过5个则不做代码分割
      maxInitialRequests: 3,   // 入口文件进行加载时，引入的库最多分割出3个js文件
      automaticNameDelimiter: '~',  // 生成文件名的文件链接符
      name: true,   // 开启自定义名称效果
      cacheGroups: {  // 判断分割出的代码放到那里去
          vendors: {   // 配合chunks：‘all’使用，表示如果引入的库是在node-modules中，那就会把这个库分割出来并起名为vendors.js
              test: /[\/]node_modules[\/]/,
              priority: -10,
              filename: 'vendors.js'
          },
          default: {  // 为非node-modules库中分割出的代码设置默认存放名称
              priority: -20,
              reuseExistingChunk: true, // 避免被重复打包分割
              filename: 'common.js'
          }
      }
  }
}

```

#### css 代码分割

`npm i extract-text-webpack-plugin --save-dev`

它会将所有的入口 chunk(entry chunks)中引用的 *.css，移动到独立分离的 CSS 文件。因此，你的样式将不再内嵌到 JS bundle 中，而是会放到一个单独的 CSS 文件（即 styles.css）当中。 如果你的样式文件大小较大，这会做更快提前加载，因为 CSS bundle 会跟 JS bundle 并行加载。

```
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          //如果需要，可以在 sass-loader 之前将 resolve-url-loader 链接进来
          use: ['css-loader', 'sass-loader']
        })
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('style.css')
    //如果想要传入选项，你可以这样做：
    //new ExtractTextPlugin({
    //  filename: 'style.css'
    //})
  ]
}
```

_网上的另一种解决方案_

想要分开打包我们的css文件，需要使用mini-css-extract-plugin这个插件，但是这个插件目前还不支持HMR,为了不影响开发效率，因此就在生成环境下使用该插件。
optimize-css-assets-webpack-plugin 这个插件可以帮助我们把相同的样式合并。
css-split-webpack-plugin插件可以帮我们把过大的css文件拆分

`npm install mini-css-extract-plugin optimize-css-assets-webpack-plugin css-split-webpack-plugin --save-dev`

```
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const CSSSplitWebpackPlugin = require('css-split-webpack-plugin').default;
...
    module: {
        rules: [{
            test: /.less$/,
            exclude: /node_modules/,
            use: [MiniCssExtractPlugin.loader,
                {
                    loader: 'css-loader',
                    options: {
                        importLoaders: 2
                    }
                }, 'less-loader', 'postcss-loader']
        },
        {
            test: /.css$/,
            use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']
        }]
    },
    optimization: {
minimizer: [new OptimizeCSSAssetsPlugin({})]
},
plugins: [
new MiniCssExtractPlugin({
filename: '[name].css',
chunkFilename: '[name].chunk.css'
}),
      new CSSSplitWebpackPlugin({
            size: 4000,
            filename: '[name]-[part].[ext]'
      })
   ]
```

## alias对文件路径优化

extension: 指定extension之后可以不用在require或是import的时候加文件扩展名,会依次尝试添加扩展名进行匹配

alias: 配置别名可以加快webpack查找模块的速度

```
resolve: {
  extension: ["", ".js", ".jsx"],
  alias: {
    "@": path.join(__dirname, "src"),
    pages: path.join(__dirname, "src/pages"),
    router: path.join(__dirname, "src/router")
  }
}
  
```


## 使用静态资源路径publicPath（CDN）

CDN通过将资源部署到世界各地，使得用户可以就近访问资源，加快访问速度。要接入CDN，需要把网页的静态资源上传到CDN服务上，在访问这些资源时，使用CDN服务提供的URL。

```
output: {
  filename: '[name].js',
  path: path.resolve(__dirname, '../dist'),
  publicPath: '//Cdn'
}
```

## 懒加载

懒加载或者按需加载，是一种很好的优化网页或应用的方式。这种方式实际上是先把你的代码在一些逻辑断点处分离开，然后在一些代码块中完成某些操作后，立即引用或即将引用另外一些新的代码块。这样加快了应用的初始加载速度，减轻了它的总体体积，因为某些代码块可能永远不会被加载。

```
  import _ from 'lodash';

- async function getComponent() {
    const _ = await import(/* webpackChunkName: "lodash" */ 'lodash');
  }

- getComponent().then(component => {
-   document.body.appendChild(component);
- });
+ document.body.appendChild(component());

```
许多框架和类库对于如何用它们自己的方式来实现（懒加载）都有自己的建议。这里有一些例子：

React: [Code Splitting and Lazy Loading]("https://reacttraining.com/react-router/web/guides/code-splitting")

vue: [Lazy Load in Vue using Webpack's code splitting]("https://alexjover.com/blog/lazy-load-in-vue-using-webpack-s-code-splitting/")















