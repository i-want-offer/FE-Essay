# Webpack 配置全解析（基础篇）

## 前言

Webpack 凭借强大的功能，成为最流行和最活跃的打包工具，也是面试时高级程序员必须掌握的技能；笔者结合在项目中的使用经验，介绍webpack的使用；本文是入门篇，主要介绍webpack的入口、输出和各种loader、plugins的使用。

## 概念

先看一下官网对 webpack 的定义：

>   本质上，webpack 是一个现代 JavaScript 应用程序的静态模块打包器（module bundler）。当 webpack 处理应用程序时，它会递归的构建一个依赖关系图（dependency graph），其中包含应用程序需要的每个模块，然后将所有这些模块打包成一个或多个 bundle。

首先 webpack 是一个静态模块打包器，所谓的静态模块，包括脚本、样式表和图片等等；webpack 打包时首先遍历所有的静态资源，根据资源的引用构建出一个依赖关系图，然后再将模块划分，打包出一个或多个 bundle。

![](https://raw.githubusercontent.com/LaamGinghong/pics/master/img/20201109111827.png)

提到 webpack，就不得不提 webpack 的四个核心概念：

*   入口（entry）：告诉 webpack 应该使用哪个模块来作为构建其内部依赖图的开始；
*   输出（output）：在哪里输出它所创建的 bundles；
*   loader：让 webpack 能够去处理那些非 JavaScript 文件；
*   插件（plugins）：用于执行范围更广的任务。

## 你的第一个打包器

我们首先在全局安装 webpack：

```shell
npm install webpack webpack-cli -g
```

webpack 可以不使用配置文件，直接通过命令行构建，用法如下：

```shell
webpack <entry> [<entry>] -o <output>
```

这里的 entry 和 output 就对应了上述概念中的入口和输出，我们来新建一个入口文件：

```js
// demo1/index.js
var a = 1
console.log(a)
document.write('hello webpack')
```

有了入口文件我们还需要通过命令行定义一下输入路径 dist/bundle.js

```shell
webpack index.js -o dist/bundle.js
```

![](https://raw.githubusercontent.com/LaamGinghong/pics/master/img/20201109112200.png)

我们也可以在项目中新建一个 html 引入打包后的 bundle.js 文件来查看效果。

## 配置文件

命令行的打包方式仅限于简单的项目，如果我们的项目较为复杂，我们不可能把所有配置都在命令行上输入，因此我们一般都会使用配置文件来进行打包，这种方式更有利于我们的配置复用化。

```shell
webpack [--config webpack.config.js]
```

配置文件的默认名称就是 webpack.config.js，一个项目中经常会有多套配置文件，我们可以针对不同环境配置不同的文件，通过 `--config` 来进行切换：

```shell
# 生产环境配置
webpack --config webpack.prod.config.js
# 开发环境配置
webpack --config webpack.dev.config.js
```

### 多种配置文件

config 配置文件通过 module.exports 导出一个配置对象：

```js
// webpack.config.js
var path = require('path');
module.exports = {
  mode: 'development',
  //入口文件
  entry: './index.js',
  //输出目录
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  }
};
```

除了导出为对象，还可以导出为一个函数，函数中带入命令行中传入的环境变量等参数，这样可以更方便地对环境变量进行配置；比如我们在打包线上正式环境和线上开发环境可以通过 env 进行区分：

```js
var path = require('path');
//env:环境对象
module.exports = function(env, argv){
  return {
    //其他配置
    entry: './index.js',
    output: {}
  }
};
```

另外还可以导出为一个 Promise，用于异步加载配置，比如动态加载入口文件：

```js
module.exports = () => {
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            resolve({
                entry: './index.js',
                output: {}
            })
        }, 5000)
    })
}
```

### 入口

正如在上面提到的，入口是整个依赖关系的起点入口；我们常用的单入口配置是一个页面的入口：

```js
module.exports = {
  entry: './index.js'
}
```

它是下面的简写：

```js
module.exports = {
  entry: {
    main: './index.js'
  }
}
```

但是我们一个页面可能不止一个模块，因此需要将多个依赖文件一起注入，这时就需要使用数组：

```js
module.exports = {
  entry: [
    //轮播图模块
    './src/banner.js',
    //主模块
    './src/index.js', 
    //底部模块
    './src/foot.js'
  ],
}
```

有时候我们一个项目可能有不止一个页面，需要将多个页面分开打包，entry 支持传入对象的形式：

```js
module.exports = {
  entry: {
    home: './src/home.js',
    list: './src/list.js',
    detail: ['./src/detail.js', './src/common.js']
  }
}
```

这样 webpack 就会构建三个不同的依赖关系。

### 输出

output 选项用来控制 webpack 如何输入编译后的文件模块；虽然可以有多个 entry，但是只能配置一个 output：

```js
module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    // CDN地址
    publicPath: '/'
  }
}
```

这里我们配置了一个单入口，输出也就是bundle.js；但是如果存在多入口的模式就行不通了，webpack会提示Conflict: Multiple chunks emit assets to the same filename，即多个文件资源有相同的文件名称；webpack提供了占位符来确保每一个输出的文件都有唯一的名称：

```js
module.exports = {
  entry: {
    home: './src/home.js',
    list: './src/list.js',
    detail: ['./src/detail.js', './src/common.js']
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js'
  }
}
```

这样 webpack 打包出来的文件就会按照入口文件的名称来进行分别打包生成桑格不同的 bundle 文件；还有以下不同的占位字符串：

| 占位符      | 描述                                   |
| ----------- | -------------------------------------- |
| [hash]      | 模块标识符（module identifier）的 hash |
| [chunkhash] | chunk 内容的 hash                      |
| [name]      | 模块名称                               |
| [id]        | 模块标识符                             |
| [query]     | 模块的 query                           |

在这里引入 Module、Chunk 和 Bundle 的概念，上面代码中也经常会看到有这两个名词出现，那么它们三者到底有什么区别呢？首先我们发现 module 时经常出现在我们的代码中，比如 `module.exports` ；而 chunk 经常和 entry 一起出现，bundle 总是和 output 一起出现。

*   module：我们写的源码，无论是 cjs 还是 esm，都可以理解为一个个 module；
*   chunk：当我们写的 module 源文件传到 webpack 进行打包时，webpack 会根据文件引用关系生成 chunk 文件，webpack 会对这些 chunk 文件进行一些操作；
*   bundle：webpack 处理好 chunk 文件后，最后会输出 bundle 文件，这个 bundle 文件包含了经过加载和编译的最终源文件，所以它可以直接在浏览器中运行。

我们通过下面一张图更深入的理解这三个概念：

![](https://raw.githubusercontent.com/LaamGinghong/pics/master/img/20201109114354.png)

总结：

module、chunk、bundle 其实就是同一个逻辑代码在不同转换场景下取了三个名字：我们直接写出来的是 module，webpack 处理时是 chunk，最后生成浏览器可以直接运行的 bundle。

### hash、chunkhash、contenthash

理解了 chunk 的概念，相信上面表中 chunkhash 和 hash 的区别也很容易理解了：

*   hash：是跟这个项目的构建相关，只要项目里有文件更改，整个项目构建的 hash 都会更改，并且全部文件共用相同的 hash 值；
*   chunkhash：跟入口文件的构建相关，根据入口文件构建对应的 chunk，生成每个 chunk 对应的 hash；入口文件更改，对应 chunk 的 hash 值会更改；
*   contenthash：跟文件内容本身相关，根据文件内容创建出唯一 hash，也就是说文件内容更改，hash 就更改。

### 模式

在 webpack2 和 webpack3 中我们需要手动加入插件来进行代码的压缩、环境变量的定义，还需要注意环境的判断，非常麻烦；webpack4 种直接提供了模式的选择配置，开箱即用，如果忽略了配置，webpack 还会报出警告。

```js
module.exports = {
  mode: 'development'
}
```

开发模式是告诉 webpack，我现在处于开发环境，也就是打包出来的内容要对开发者友好，便于代码调试，以及实现高速浏览器实时更新。

```js
module.exports = {
  mode: 'production'
}
```

生产模式不需要对开发者友好，只需要关注打包的性能以及更小体积的 bundle。

### 自动生成页面

在上面的代码中，我们都是手动生成 index.html，然后引入打包后的 bundle 文件，但是这样太过复杂繁琐，而且如果生成的 bundle 文件中带有 hash 值，每次生成的文件名都不同，每次都需要重新引入，因此我们需要一个自动引入 html 的插件：

```shell
npm install --save-dev html-webpack-plugin
```

多入口配置文件中，我们可以这样进行配置：

```js
module.exports = {
  // 省略其他代码
  plugins: [
    new HtmlWebpackPlugin({
      // 引用的模版文件
      template: './index.html',
      // 生成 html 名称
      filename: 'home.html',
      chunks: ['home']
    }),
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: 'list.html',
      chunks: ['list']
    }),
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: 'detail.html',
      chunks: ['detail']
    })
  ]
}
```

html-webpack-plugin 还支持以下字段：

```js
new HtmlWebpackPlugin({
    template: './index.html',
    filename: 'all.html',
    //页面注入title
    title: 'html webpack plugin title',
    //默认引入所有的chunks链接
    chunks: 'all',
    //注入页面位置
    inject: true,
    //启用hash
    hash: true,
    favicon: '',
    //插入meta标签
    meta: {
        'viewport': 'width=device-width, initial-scale=1.0'
    },
    minify: {
        //清除script标签引号
        removeAttributeQuotes: true,
        //清除html中的注释
        removeComments: true,
        //清除html中的空格、换行符
        //将html压缩成一行
        collapseWhitespace: false,
        //压缩html的行内样式成一行
        minifyCSS: true,
        //清除内容为空的元素（慎用）
        removeEmptyElements: false,
        //清除style和link标签的type属性
        removeStyleLinkTypeAttributes: false
    }
})
```

上面设置 title 后需要在模版文件中设置模版字符串：

```ejs
<title><%= htmlWebpackPlugin.options.title %></title>
```

## loader

loader 用于对模块 module 的源码进行转换，默认 webpack 只能识别 cjs 代码，但是我们在代码中通常还会引入比如 ts、less 等文件，webpack 默认是无法进行处理的；loader 拓展了 webpack 处理多种文件类型的能力，将这些文件转换成浏览器能够渲染的 js、css。

`module.rules` 允许我们配置多个 loader，能够很清晰的看出当前文件类型应用了哪些 loader。

```js
{
  module: {
    rules: [{
      test: /\.js$/,
      use: {
        loader: 'babel-loader',
        options: {}
      }
    }, {
      test: /\.css$/,
      use: [{
        loader: 'style-loader',
      }, {
        loader: 'css-loader'
      }]
    }]
  }
}
```

我们可以看到 rules 属性值是一个数组，每个数组对象表示了不同的匹配规则；test 属性是一个正则表达式，匹配不同的文件后缀；use 表示匹配了这个文件后调用什么 loader 来处理，当有多个 loader 时，use 需要用到数组。

多个 loader 支持 **链式调用** ，能够对资源进行流水线处理，上一个 loader 处理的返回值传递给下一个 loader；loader 处理有一个优先级， **从右到左，从下到上** ；在上面 demo 中就遵循了这个优先级，css-loader 先处理，处理好后把结果返回给 style-loader。

### css-loader 和 style-loader

这两者从名字上看可能功能比较相似，但其实完全不同，但是它们经常成对使用。

css-loader 用来解释 `@import` 和 `url()` ，style-loader 用来将 css-loader 生成的样式表通过 `<style>` 插入到页面中。

### sass-loader 和 less-loader

这两个 loader 从字面意思上就知道是用来处理 sass 和 less 文件的，同样的我们需要在 css-loader 处理文件之前使用这两者来进行转换。

```js
{
  module: {
    rules: [{
      test: /\.scss$/,
      use: ['style-loader', 'css-loader', 'sass-loader']
    }, {
      test: /\.css$/,
      use: ['style-loader', 'css-loader', 'less-loader']
    }]
  }
}
```

### postcss-loader

2020年了，大家肯定不希望手动一个个去添加各种浏览器的私有前缀，postcss 提供了很多对样式的扩展功能：

```js
{
  module: {
    rules: [{
      test: /\.scss$/,
      use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
    }, {
      test: /\.css$/,
      use: ['style-loader', 'css-loader', 'postcss-loader', 'less-loader']
    }]
  }
}
```

但是这样并不会有实际效果，因为 postcss 主要功能有两个：

1.  把 css 解析成 js 可以操作的抽象语法树 AST；
2.  调用插件来处理 AST 并得到结果。

所以 post 一般都是通过插件来处理 css，并不会直接处理，所以我们还需要安装一些插件：

```shell
npm i -D autoprefixer postcss-plugins-px2rem cssnano
```

在项目根目录中新建一个 `.browserslistrc` 文件：

```
> 0.25%
last 2 versions
```

我们将 postcss 的配置单独提取到项目根目录下的 postcss.config.js：

```js
module.exports = {
  plugins: [
    // 自动添加前缀
    require('autoprefixer'),
    // px 转成 rem，应用于移动端
    require('postcss-plugins-px2rem')({ remUnit: 75})
    // 优化合并 css
    require('cssnano')
  ]
}
```

这样，我们打包后的 css 就会自动添加上前缀。

### babel-loader

兼容低版本浏览器是非常痛苦的一件事情，好在现在有 babel 能够帮我们做这些事情：

```shell
npm i -D babel-loader @babel/core @babel/preset-env @babel/plugin-transform-runtime
npm i -S @babel/runtime
```

我们之前已经添加了 js 的 babel-loader 转换，现在我们需要一个配置文件来配置 babel，在项目根目录中新建一个 babel.config.js：

```js
module.exports = {
  presets: ['@babel/preset-env'],
  plugins: ['@babel/plugin-transform-runtime']
}
```

这样，我们在项目中写高级语法，就能通过 babel 转换成低级语法。同时，由于我们配置是，是全局转换，这样非常耗费时间。实际上，我们的第三方依赖是没有必要进行转化的（因为大多数都已经转换过了），因此我们添加转换范围约束：

```js
{
  // 省略其他配置
  rules: [{
    test: /\.js$/,
    use: ['babel-loader'],
    include: [path.resolve(__dirname, 'src')]
  }]
}
```

### file-loader 和 url-loader

filer-loader 和 url-loader 都是用来处理图片、字体等静态资源的；其中，url-loader 的工作分两种情况：当文件小于 limit 参数时，url-loader 会将文件转换成 base64 编码，用于减少 http 请求；当文件大于 limit 时，会调用 file-loader 进行处理。

```js
{
  // 省略其他配置
  rules: [{
    test: /\.(png|jpe?g|gif|webp|svg|eot|ttf|woff|woff2)$/,
    use: ['file-loader', {
      loader: 'url-loader',
      options: {
        limit: 10240, // 10k
        name: '[name].[hash:8].[ext]', // 生成资源名称
        outputPath: 'imgs/' // 生成资源位置
      },
      exclude: /node_modules/
    }]
  }]
}
```

## 搭建开发环境

在上面的 demo 中，我们都是通过命令打包到 dist 文件夹中，然后通过打开 html 或者静态服务来查看页面，但是这种方式严重影响开发效率，我们期望的是写完代码后能够立即看到页面的效果。这是我们就需要使用 webpack-dev-server，能够实时重新加载。

```js
module.exports = {
  devServer: {
    port: 8080, // 端口
    host: '0.0.0.0', // 默认是 localhost，只能本地访问
    open: false, // 自动打开浏览器
    hot: true, // 启用模块热替换
    compress: true // 启用 gzip 压缩
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin({})
  ]
}
```

通过命令行 `webpack-dev-server` 来启动服务器，启动后我们发现根目录并没有生成任何文件，因为 webpack 打包到了内存中，不生成文件的原因在于访问内存中的代码比访问文件中的代码更快。

我们在public/index.html的页面上有时候会引用一些本地的静态文件，直接打开页面的会发现这些静态文件的引用失效了，我们可以修改server的工作目录，同时指定多个静态资源的目录：

```js
contentBase: [
  path.join(__dirname, "public"),
  path.join(__dirname, "assets")
]
```

热更新（Hot Module Replacemen简称HMR）是在对代码进行修改并保存之后，webpack对代码重新打包，并且将新的模块发送到浏览器端，浏览器通过新的模块替换老的模块，这样就能在不刷新浏览器的前提下实现页面的更新。

![](https://raw.githubusercontent.com/LaamGinghong/pics/master/img/20201109160153.png)

可以看出浏览器和webpack-dev-server之间通过一个websock进行连接，初始化的时候client端保存了一个打包后的hash值；每次更新时server监听文件改动，生成一个最新的hash值再次通过websocket推送给client端，client端对比两次hash值后向服务器发起请求返回更新后的模块文件进行替换。

我们点击源码旁的行数看一下编译后的源码是什么样的：

![](https://raw.githubusercontent.com/LaamGinghong/pics/master/img/20201109160228.png)

发现跟我们的源码差距还是挺大的，本来是一个简单add函数，通过webpack的模块封装，已经很难理解原来代码的含义了，因此，我们需要将编译后的代码映射回源码；devtool中不同的配置有不同的效果和速度，综合性能和品质后，我们一般在开发环境使用cheap-module-eval-source-map，在生产环境使用source-map。

```js
module.exports = {
  devtool: 'cheap-module-eval-source-map'
}
```

各种 devtool 对比：

![](https://raw.githubusercontent.com/LaamGinghong/pics/master/img/20201109160337.png)

## plugins

上面我们介绍过 html-webpack-plugin 等插件，我们发现这些插件都能够不同程度的影响着 webpack 的构建过程，下面还有一些常见的插件。

### clean-webpack-plugin

clean-webpack-plugin 用于在打包前清理上一次项目生成的 bundle 文件，它会根据 `output.path` 自动清理文件夹；这个插件在生产环境中使用的比较频繁，因为生产环境经常会通过 hash 生成很多 bundle 文件，如果不及时清理，就会导致文件夹体积非常庞大。

```js
module.exports = {
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      // ...
    })
  ]
}
```

### mini-css-extract-plugin

我们之前使用 style-loader 处理的样式都是通过 style 标签插入到页面中的，但是生产环境需要单独抽离样式文件，所以我们就可以使用 mini-css-extract-plugin 来处理。

同时，我们需要注意的是，该插件和 style-loader 并不兼容，因此需要使用环境变量来判断当前 webpack 的运行环境。

```js
module.exports = {
  module: {
    rules: [{
      test: /\.less$/,
      use: [isDev ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader', 'less-loader']
    }]
  },
  plugins: [
    !isDev && new MiniCssExtractPlugin({
      filename: '[name].[hash:8].css'
    })
  ]
}
```

### optimize-css-assets-webpack-plugin

我们发现，虽然配置了 production 模式，打包出来的 js 被压缩了，但是 css 文件并没有被压缩，因此我们需要单独为 css 文件进行一次压缩处理：

```js
module.exports = {
  plugins: [
    new OptimizeCSSAssetsPlugin()
  ]
}
```

### copy-webpack-plugin

我们在public/index.html中引入了静态资源，但是打包的时候webpack并不会帮我们拷贝到dist目录，因此copy-webpack-plugin就可以很好地帮我做拷贝的工作了：

```js
module.exports = {
  plugins: [
    new CopyWebpackPlugin({
      patterns: [{
        from: 'public/js/*.js',
        to: path.resolve(__dirname, 'dist', 'js'),
        flatten: true
      }]
    })
  ]
}
```

## loader 和 plugin 的区别

*   loader：由于 webpack 只能识别 js，loader 相当于翻译官的角色，帮助 webpack 对其他类型的资源进行转译的预处理工作；
*   plugins：plugins 拓展了 webpack 的功能，由于 webpack 运行时会广播很多事件，plugin 可以监听这些事件，然后通过 webpack 提供的 API 来改变输出结果。



