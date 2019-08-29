# 如何开源一个vue ui 框架

## 1.知识点

* 持续构建Travis CI 相关知识
* Makefile相关知识
* Webpack构建等相关知识
* Git规范化提交信息相关
* gh-pages相关
* PostCss相关
* Eslint相关
* Babel相关
* NPM包发布等相关知识

## 2. 项目基本结构

<blockquote>
  |-- UIFrameName<br>
  |-- .babelrc // babel配置文件<br>
  |-- .eslintignore // eslint校验忽略文件<br>
  |-- .eslintrc // eslint配置文件<br>
  |-- .gitignore // git忽略追踪管理的文件<br>
  |-- .travis.yml // 持续集成配置文件<br>
  |-- LICENSE	// 开源协议<br>
  |-- Makefile	// 自动化编译配置文件<br>
  |-- README.md	// 项目说明文件<br>
  |-- package.json	<br>
  |-- .postcssrc.js	// postcss配置文件<br>
  |-- yarn.lock	// yarn配置文件<br>
  |-- build	// webpack编译配置文件目录<br>
  |-- packages	// 组件源码目录<br>
  |-- src	// 项目使用到的公共指令、工具集等源码存放目录<br>
  |-- static  // 静态文件<br>
  |-- config  // 相关配置
</blockquote>

## 3. 构建项目

> 根据项目的依赖，比如vue 相关的框架 可以使用Vue脚手架来创建基本骨架，即vue init webpack 