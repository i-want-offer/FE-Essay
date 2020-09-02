# Code Splitting 是什么以及为什么

在以前，为了减少 HTTP 请求，通常我们会把所有的代码都打包成一个单独的 JS 文件。但是如果这个 JS 文件的体积太大的话，就会让整个请求体体积过大，从而降低请求响应的速度，那就得不偿失了。

这时，我们不妨把所有代码分成一块一块，需要某块代码的时候再去加载它；还可以利用浏览器的缓存，下次用到它的时候，直接从缓存中读取。很显然，这种方式可以加快我们网页的加载速度。

所以说，Code Splitting 其实就是把代码分成很多很多块（chunk）。



# 怎么做

代码切割的主要方式有两种：

*   分离业务代码和第三方库（vendor）
*   按需加载（利用 `import()` 语法）

之所以把业务代码和第三方代码分离出来，是因为业务的需求是源源不断的，因此业务代码更新频率更高；相反，第三方库更新迭代相对较慢，有时还会锁版本，所以可以充分利用浏览器的缓存来加载这些第三方库。

而按需加载的使用场景，比如说「访问某个路由的时候再去加载相应的组件」，用户不一定一访问所有的路由，所以没必要把所有路由对应的组件都在开始的时候加载完毕。更典型的例子是「某些用户他们的权限只能访问特定的页面」，所以更没必要把他们没有权限的组件加载进来。



# 准备工作

我用 Vue 写了一个简单的 [demo](https://github.com/lyyourc/webpack-code-splitting-demo)：它调用了一个 api，然后显示返回的 emoji 表情。

![img](https://pic2.zhimg.com/80/v2-6c42e5f2789cb76a4d4d88ec42d3087d_720w.png)

接下来，看看第一次打包情况：

![img](https://pic4.zhimg.com/80/v2-f2c0d0e3ea151c0582a8442f51175ace_720w.png)

可以看到，当前只有一个 chunk，也就是 app.js，它是一个 entry chunk。因为我们的 webpack 配置是这样子的：

```js
// webpack.config.js
module.exports = {
  entry: {
    app: './src/main.js' // entry chunk
  }
}
```

app.js 包含了我们的第三方库 vue 和 axios，以及我们的业务代码 src。

接下来我们把它们分离开来。



# 分离 Vendor

最简单的方法就是：增加一个 entry

```js
// webpack.config.js
module.exports = {
  entry: {
    app: './src/main.js',
    vendor: ['vue', 'axios']
  }
}
```

来分析一下打包：

![img](https://pic2.zhimg.com/80/v2-38bf000bb1e976654af621bdf9fc9758_720w.png)

虽然 vendor.js 这个 chunk 包含了我们想要的 vue 和 axios，但是 app.js 却没有忽略他们。

这是因为，每个 entry 都有自己的依赖，我们想要把 vue 和 axios 等第三方依赖提取出来，就需要找出它们相同的依赖，就像这样：

![img](https://pic2.zhimg.com/80/v2-12ac7011458a1e5de5e8316c29ad274f_720w.png)

如果想要提取公共模块的话，就需要用到 CommonsChunkPlugin。

## CommonsChunkPlugin

现在我们修改 webpack 配置：

```js
new webpack.optimize.CommonsChunkPlugin({
  name: 'vendor'
})
```

使用完成之后，所有的 chunk 中，同时引用了 vendor 数组中的依赖超过 2 次的，都会被移动到 vendor.js 里面。

此时我们来看打包情况：

![img](https://pic4.zhimg.com/80/v2-1c4663763de6ffd4bf9fd1f15857f6b9_720w.png)

没有问题，这正是我们想要的效果。

但是，随着业务的增长，我们依赖的第三方库可能会越来越多，这时候，我们的 webpack 配置文件可能就会变成这样：

```js
module.exports = {
  entry: {
    app: './src/main.js',
    vendor: [
      'vue',
      'axios',
      'vue-router',
      'vuex'
      // ... 很长很长
    ]
  }
}
```

更糟糕的事，每当我们引入了新的依赖，都需要在 vendor 中手动增加依赖对应的包名。

## 自动化分离 vendor

如果我们想把所有 node_modules 下目录的 js 都自动分离到 vendor.js，则需要用到 minChunks：

```js
// webpack.config.js
module.exports = {
  entry: {
    app: './src/main.js'
    // vendor: [] 这一行去掉
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: ({ resource }) => 
      	resource && 
      	resource.indexOf('node_modules') >= 0 && 
      	resource.match(/\.js$/)
    })
  ]
}
```

配置完成之后，每当我们从入口文件中递归查找依赖的时候，一旦发现依赖来自 node_modules，并且文件类型是 js 的时候，则会自动将这个文件打包到 vendor.js 里面。



# Dynamic Import

由于产品经理加了新的需求，我们的 demo 变成了这个样子，新增了路由。

![img](https://pic1.zhimg.com/80/v2-15ba96e3725ba32502a5ca377613606f_720w.png)

同时我们的打包：

![img](https://pic3.zhimg.com/80/v2-f6168264319278ceb1bde38c8f737fc5_720w.png)

新增的第三方库 vue-route 和 justified-layout 都自动转移到了 vendor.js。

## import()

如果我们想实现「按需加载」路由组件的话，只需要修改几行代码就好了：

```js
// route.js
const Emoji = () => import(
 // webpackChunkName: "Emojs"
  './pages/Emojs.vue'
)

const Photos = () => import(
	// webpackChunkName: "Photos"
  './pages/Photos.vue'
)
```

同时我们还需要修改出口文件的名称：

```js
// webpack.config.js
module.exports = {
  output: {
    chunkFilename: "[name].chunk.js"
  }
}
```

如果你使用了 babel，需要安装 [babel-plugin-syntax-dynamic-import](https://www.npmjs.com/package/babel-plugin-syntax-dynamic-import) 来解析 `import()` 语法，修改 .babelrc：

```json
{
  "plugins": ["syntax-dynamic-import"]
}
```

看一下打包情况：

![img](https://picb.zhimg.com/80/v2-1bf6253be84dc5f976277105a414f091_720w.png)

可以看到，除了主包 app.js 以外，已经额外分离出了两个单独的 chunk，分别对应了我们的两个路由组件。

但是引发了额外的问题，那便是之前在主包已经拆分好的 vendor，在 chunk 中失效了，某一些依赖是多个 chunk 公用的，这时候这些依赖理应在 vendor.js 中，而不应该是每一个 chunk 都有自己的依赖。

## async flag

要解决上面的问题，我们需要用到 CommonsChunkPlugin 的 async：

```js
module.exports = {
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      async: 'common-in-lazy',
      minChunks: ({ resource } = {}) =>
      	resource && 
      	resource.includes('node_modules') && 
      	/axios/.test(resource)
    }) // 注意，我们不是删了原来的，而是新增了一个
  ]
}
```

添加了这些配置，webpack 在打包的时候会找到所有的 async chunk，遍历他们找到来自 node_modules 并且名字中带有 axios 的依赖，把他们都转移到 common-in-lazy.js 中。

再看看我们的打包结果：

![img](https://pic1.zhimg.com/80/v2-995ed2d93926e62044e54dbb38320cf6_720w.png)



# 分离业务公共模块

不单只是第三方依赖，通常我们在写业务代码的时候，也会抽离一些代码放到公共模块中。

细心的读者应该可以看到上图 Photos.chunk 和 Emoji.chunk 里面都包含了 MagicBtn，如果类似的公共组件一多起来，就会产生很多重复的代码，所以我们也应该将这些重复代码打包到一个公共的模块里面去。

实现方式和 async flag 一样：

```js
// webpack.config.js
module.exports = {
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      async: 'used-twice',
      minChunks: (module, count) => count >= 2
    })
  ]
}
```

这样，当 webpack 打包的时候，在所有异步 chunk 中引入次数大于等于 2 的模块，webpack 就会把它打包到 used-twice.js chunk 中。

最后我们打包的结果是：

![img](https://pic1.zhimg.com/80/v2-8223cc7dd6ec555582036ebd1771ec62_720w.png)



# 总结

>   你的 Code Splitting = webpack bundle analyzer + CommonsChunkPlugin + 你的分析

我们做代码切割的目的，就是为了充分利用浏览器的缓存，以及首屏的极限优化达到按需加载的效果。