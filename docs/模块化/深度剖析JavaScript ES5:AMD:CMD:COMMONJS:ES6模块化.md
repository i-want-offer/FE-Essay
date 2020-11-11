# 深度剖析JavaScript ES5/AMD/CMD/COMMONJS/ES6模块化

前端模块化其实是一个有年代知识的考点，面试中经常会问到各种模块化标准之间的异同，其中一些模块化标准至今已经被废弃不再使用，一些模块化至今仍然在实际应用中发光发热。

本文尝试详解各种前端模块化标准。

## CommonJS

CommonJS 出现就是为了解决原本 JS 文件引入的不足点： **模块依赖** 和 **全局污染** 问题，它并不是 JS 本身的一个内容，而是对于模块化的一种具体实现。

*   CommonJS 实际上就是用 require 函数，只要引用，就会创建一个 **模块的实例** ，即实例化（每当引入一个文件，就会为这个文件变成一个 JS 实例）；
*   做法是通过 require 引入模块，通过 `module.exports` 导出，并且文件加载是 **同步** 完成的；
*   对服务端比较友好，内涵 **缓存机制** ，也就是说只要 require 一个模块，那么这个模块就会被缓存，并且还会进行一次比较异同的操作，例如我修改了这个模块，那么就会 **将缓存的模块替换新的模块** ；
*   在 node 上运行，不依赖于客户端。

而当我们引入一个模块后，其实会被解析为一个立即执行函数，类似原本 ES5 利用自执行函数封装一样，类似下面， **引入的模块并不是全局变量。** 

```js
(function(exports, require, module, __filename, __dirname) {
  
})()
```

CommonJS 至今仍然是 nodejs 的模块化标准。

## AMD 出现

看到 AMD，你可能会情不自禁地说 AMD YES！但此 AMD 并非彼 AMD。

从上问我们知道了 CommonJS 只能在 node 环境下使用，在浏览器上无法使用，而 CommonJS 本身的实现思路是不错的，于是创造了 AMD（Asynchronous Module Definition）异步模块定义，是通过 **RequireJS** 来实现，区别于 CommonJS，它是 **异步** 的。

定义模块： `define(moduleName, [module], factory)`

引入模块： `require([module], callback)`

下面看这个例子

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/457469ddb0b5410dab47ecaecd8f2910~tplv-k3u1fbpfcp-zoom-1.image?imageslim)

moduleB 此时它依赖于模块 A，按照以下方式进行依赖。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/900a9120ce26482e9d04124d2218387f~tplv-k3u1fbpfcp-zoom-1.image?imageslim)

然后在 index.js 文件中我们需要通过 `require.config` 来配置我们的模块路径，如若没有配置的话，就会报错找不到。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fa67ed094f254b4885f9266c7e5e80bb~tplv-k3u1fbpfcp-zoom-1.image?imageslim)

**注意点！** 上述依赖模块 **只有当全部加载完毕之后，才会执行后边的回调函数。** 这种方式就是我们比较疑惑的一个名词： **依赖前置。**

因此，它不用考虑模块的引入顺序，并且保证是规范化的输入输出，同时它会动态地创建 script 标签，如下图所示，它使用了 async 来进行异步加载。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4c409c1c3225485d9e84efe870540ec9~tplv-k3u1fbpfcp-zoom-1.image?imageslim)

## 引出 CMD

此时，阿里也为模块化作了贡献，推出了 CMD（Common Module Definition）通用模块定义，它参考了 AMD，引入了 `sea.js` 。

定义模块： `define(function (require, exports, module) {})`

引入模块： `sea.js([module路径], function(moduleA, moduleB, moduleC) {})`

下面看个例子：

定义一个模块 moduleA

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/52c400b688294feebd57999ef8d98623~tplv-k3u1fbpfcp-zoom-1.image?imageslim)

再来定义一个模块 moduleB，此时它依赖于模块 A，按照如下方式进行依赖。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/146a6b04380d4d3aab840a59ed593b8b~tplv-k3u1fbpfcp-zoom-1.image?imageslim)

然后在 index.js 文件中，我们需要首先通过数组确定模块路径，如下所示：

```js
seajs.use(['module_a.js', 'module_b.js'], function(moduleA, moduleB){
    console.log(moduleA.a);
    console.log(moduleB.b);
})
```

下面总结一下 CMD 相关知识：

通过 require 加载，define 定义，exports 导出（使用 return 同理），module 操作模块。

而在使用模块时，需要配置相关 url，依赖加载完毕之后，再执行回调函数，这里和 AMD 没啥区别。

**注意点！** 但是下面就有本质上不同了， **CMD 就进依赖、按需加载，** 增强灵活性。

## ES6 模块化登场

JS 语言标准中的模块化规范，属于语言本身的一种新特性。

引入模块： `import module from '模块路径'`

导出模块： `export module`

下面看这个例子：

定义一个模块 moduleA

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b371cba56e68462782de1c722fcd750f~tplv-k3u1fbpfcp-zoom-1.image?imageslim)

在定义一个模块 moduleB，此时它依赖于模块 A，按照以下方式进行依赖。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/af41c25ee9b74086a2b621664d0cab5b~tplv-k3u1fbpfcp-zoom-1.image?imageslim)

然后在 index.js 文件中我们需要配置我们的模块路径，如若没有配置的话，就会报错找不到。 ![img](https:////p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cfcb275888f0490ca8d84e8aedc86d11~tplv-k3u1fbpfcp-zoom-1.image)

ES6 模块化 与 CommonJS 对比：

先做一个实验，假设

在 export.js 中我们导出一个变量 a，并且进行了自加操作：

![img](https:////p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9385f74ff5fb4de0ab9c9d84f798fa23~tplv-k3u1fbpfcp-zoom-1.image)

在 common.js 文件中，我们写入如下代码：

![img](https:////p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/408b2a0fd1c740b199c77b4856e38227~tplv-k3u1fbpfcp-zoom-1.image)

在 es6.js 文件中，我们写入如下代码：

![img](https:////p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1eb2106be651401b90318d74c64d8450~tplv-k3u1fbpfcp-zoom-1.image)

最终结果如下： ![img](https:////p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c73633ec304b4dbf902e2fabffaae4b6~tplv-k3u1fbpfcp-zoom-1.image)

通过例子，我们来总结一下：

区别1：

-   common.js 模块输出的是一个值的拷贝
-   ES6 模块输出的是一个值得引用

区别2：

-   common.js 运行在服务端，因此模块是在运行时加载，即程序执行时 `require` 才会加载。
-   ES6 模块在编译时加载

