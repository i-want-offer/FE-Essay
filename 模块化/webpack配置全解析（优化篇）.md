# Webpack 配置全解析（优化篇）

## 前言

在上一篇文章《Webpack 配置全解析》介绍了 webpack 中的 loader 和 plugins 的一些基本用法，当 loader 和 plugins 使用较多后项目也会变得越来越卡，因此我们继续来学习如何优化 webpack 的配置让我们的项目运行得更快，耗时更短。

本文将从缩小搜索范围、减少打包文件、缓存和多进程四个方面来了解 Webpack 的优化配置。

## 缩小文件搜索范围

Webpack 会从 Entry 入口出发，解析文件中的导入模块语句，再递归解析；每次遇到导入语法时会做两件事情：

1.  查找导入模块的位置
2.  通过相应的 loader 来解析导入的模块

当项目只有几个文件时，解析文件流程只有几百毫秒，然而随着项目规模的增大，解析文件会越来越耗时，因此我们通过 webpack 的配置来缩小我们搜索模块的范围。

### 优化 loader 配置

上文中我们介绍了 include / exclude 将 node_modules 中的文件进行包括 / 排除。

```js
{
  rules: [{
    test: /\.js$/,
    use: ['babel-loader'],
    // exclude: /node_modules/,
    include: path.resolve(__dirname, 'src')
  }]
}
```

include 表示哪些目录中的文件需要进行 babel-loader，exclude 表示哪些目录中的文件不要进行 babel-loader。很多第三方依赖都已经进行过转换，其实无需再次转换，否则会耗费很多时间。

### 优化 module.noParse 配置

如果一些第三方模块没有使用 AMD/CommonJS规范，可以使用 noParse 来标记这个模块，这样 Webpack 在导入模块时，就不进行解析和转换，提升 Webpack 的构建速度；noParse 可以接受一个正则表达式或者是一个函数：

```js
{
  module: {
    // noParse: /jquery|lodash|chartjs/
    noParse(content) {
      return /jquery|lodash|chartjs/.test(content)
    }
  }
}
```

>   驻：不被解析的文件中不应该包含 require、import 等模块语句

### 优化 resolve.modules 配置

modules 用于告诉 webpack 去哪些目录下查找引用模块，默认值是 `["node_modules"]` ，意思是在 `./node_modules` 查找模块，找不到再去 `../node_modules` ，以此类推。

我们代码中也会有大量的模块被其他模块依赖引入，由于这些模块位置分布不固定，路径有时候会很长，这是我们可以利用 modules 进行优化。

### 优化 resolve.alias 配置

alias 通过创建 import 或者 require 的别名，把原来导入模块的路径映射成一个新的导入路径；它和 `resolve.modules` 不同的是，它的作用是用别名代替前面的路径，不是省略；这样的好处就是 webpack 直接回去对应别名的目录查找模块，减少搜索时间。

我们不光可以给自己写的模块设置别名，还可以给第三方模块设置别名。

### 优化 resolve.mainFields 配置

mainFields 用来告诉 webpack 使用第三方模块中的哪个字段来导入模块；第三方模块中都会有一个 package.json 文件用来描述这个模块的一些属性，比如模块名（name）、版本号（version）、作者（auth）等等；其中最重要的就是有多个特殊的字段用来告诉 webpack 导入文件的位置，有多个字段的原因是因为有些模块可以同时用于多个环境，而每个环境可以使用不同的文件。

mainFields 的默认值和当前 webpack 配置的 target 属性有关：

*   如果 target 为 webworker 或 web（默认），mainFields 默认值为 ["browser", "module", "main"]
*   如果 target 为其他（包括node），mainFields 默认值为 ["module", "main"]

这就是说当我们 `require('vue')` 的时候，webpack 先去 vue 下面搜索 browser 字段，没有找到再去搜索 module 字段，最后搜索main字段。

为了减少搜索的步骤，在明确第三方模块入口文件描述字段时，我们可以将这个字段设置尽量少；一般第三方模块都采用 main 字段，因此我们可以这样配置：

```js
{
  resolve: {
    mainFields: ["main"],
  }
}
```

### 优化 resolve.extensions 配置

extensions 字段用来在导入模块时，自动带上后缀尝试去匹配对应的文件，它的默认值是 `['.js', '.json']` 。

因此，extensions 数组越长，或者正确后缀的文件越靠后，匹配的次数越多就越耗时，因此我们可以从以下几点来优化：

*   extensions 数组尽量少，项目中不存在的文件后缀不要列进去；
*   出现频率比较高的文件后缀名优先放到最前面；
*   在代码导入时，要尽量把后缀名带上，避免查找。

## 减少打包文件

项目中不可避免会引入第三方模块，webpack 打包时也会将第三方模块作为依赖打包进 bundle 中，这样就会增加打包文件尺寸和增加耗时，如果能合理处理这些模块就能提升不少 webpack 的性能。

### 提取公共代码

我们项目通常有多个页面或者多个模块，多个页面之间通常会有公共函数，每个页面都打包这些模块会造成以下问题：

*   资源重复加载，浪费用户流量；
*   每个页面加载资源多，首屏展示慢。

webpack4 引入了 SplitChunksPlugin 插件进行公共模块的抽取，开箱即用，通过 `optimization.splitChunks` 进行配置即可，默认配置如下：

```js
module.exports = {
  optimization: {
    splitChunks: {
      // 代码分割时默认对异步代码生效，all：所有代码有效，inital：同步代码有效
      chunks: 'async',
      // 代码分割最小的模块大小，引入的模块大于 20000B 才做代码分割
      minSize: 20000,
      // 代码分割最大的模块大小，大于这个值要进行代码分割，一般使用默认值
      maxSize: 0, 
      // 引入的次数大于等于1时才进行代码分割
      minChunks: 1,
      // 最大的异步请求数量,也就是同时加载的模块最大模块数量
      maxAsyncRequests: 30,
      // 入口文件做代码分割最多分成 30 个 js 文件
      maxInitialRequests: 30, 
      // 文件生成时的连接符
      automaticNameDelimiter: '~', 
      enforceSizeThreshold: 5000,
      cacheGroups: {
        vendors: {
          // 位于node_modules中的模块做代码分割
          test: /[\\/]node_modules[\\/]/, 
          // 根据优先级决定打包到哪个组里，例如一个 node_modules 中的模块进行代码
          priority: -10 
        }, 
        // 既满足 vendors，又满足 default，那么根据优先级会打包到 vendors 组中。
        default: { 
          // 没有 test 表明所有的模块都能进入 default 组，但是注意它的优先级较低。
          //  根据优先级决定打包到哪个组里,打包到优先级高的组里。
          priority: -20, 
           //如果一个模块已经被打包过了,那么再打包时就忽略这个上模块
          reuseExistingChunk: true 
        }
      }
    }
  }
};
```

### externals

我们在项目打包时，项目中引用的一些第三方依赖通常都是不会发生变动的，因此放到 CDN 更加合适，因此就需要排除掉这些使用 CDN 的依赖。

```js
{
  externals: {
    'jquery': 'jQuery',
    'react': 'React',
    'react-dom': 'ReactDOM',
    'vue': 'Vue'  
  }
}
```

这就表示当我们遇到 `require('jquery')` 时，会从全局变量去引用 jQuery，其他也同理。这样打包就会把这些依赖从 bundle 中剔除。

### Tree Shaking

具体实现原理不介绍

## 缓存

我们知道 webpack 会对不同的文件调用不同的 loader 进行解析处理，解析的过程也是最耗性能的过程；我们每次改代码也只是修改项目中的少数文件，项目中的大部分文件改动的次数不是那么频繁；那么如果我们将解析文件的结果缓存下来，下次发现同样的文件只需要读取缓存就能极大的提升解析的性能。

### cache-loader

使用方式很简单，只需要在需要 cache 的 loader 前面添加 cache-loader 即可。

但是 cache-loader 本身也会耗费性能，因此只适合对性能消耗较大的 loader。

### HardSourceWebpackPlugin

这个插件也可以提供缓存功能，也是安装在磁盘中。

一般HardSourceWebpackPlugin默认缓存是在 ` /node_modules/.cache/hard-source/[hash] ` 目录下，我们可以设置它的缓存目录和何时创建新的缓存哈希值。

```js
module.exports = {
  plugins: [
    new HardSourceWebpackPlugin({
      //设置缓存目录的路径
      //相对路径或者绝对路径
      cacheDirectory: 'node_modules/.cache/hard-source/[confighash]',
      //构建不同的缓存目录名称
      //也就是cacheDirectory中的[confighash]值
      configHash: function(webpackConfig) {
        return require('node-object-hash')({sort: false}).hash(webpackConfig);
      },
      //环境hash
      //当loader、plugin或者其他npm依赖改变时进行替换缓存
      environmentHash: {
        root: process.cwd(),
        directories: [],
        files: ['package-lock.json', 'yarn.lock'],
      },
      //自动清除缓存
      cachePrune: {
        //缓存最长时间（默认2天）
        maxAge: 2 * 24 * 60 * 60 * 1000,
        //所有的缓存大小超过size值将会被清除
        //默认50MB
        sizeThreshold: 50 * 1024 * 1024
      },
    })
  ]
}
```

## 多进程

由于 js 是一门单线程语言，同时时间只能处理一个任务，因此 webpack 解析对应的文件类型时需要一个个依次去解析。我们可以通过将任务分发给多个子线程并发执行任务，从而提高解析时间。

### happypack

作者已经不维护了。

### thread-loader

把thread-loader放置在其他loader之前，在它之后的loader就会在一个单独的进程池中运行，但是在进程池中运行的loader有以下限制：

*   这些 loader 不能产生新的文件
*   这些 loader 不能使用定制的 loader API（也就是说，通过插件）
*   这些 loader 无法获取 webpack 的选项设置

因此，也就是说像 MiniCssExtractPlugin.loader 等一些提取 css 的 loader 是不能使用 thread-loader 的。

