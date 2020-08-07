# 字节跳动

## 一面

### 对 tree-shaking 的了解

*    虽然生产模式下默认开启，但是由于经过 babel 编译全部模块被封装成 IIFE（立即执行函数）
*   IIFE 中可能存在副作用无法被识别从而导致不能安全删除整个 IIFE
*   需要配置 `{ module: false }` 和 `sideEffects: false`
*   rollup 和 webpack 的 shaking 程度不同

```js
// helpers.js
export function foo() {
  return 'foo'
}

export function bar() {
  return 'bar'
}

// main.js
import { foo } from './helpers'
const elem = document.getElementById('output')
elem.innerHTML = `Output: ${foo()}`
```

使用 Webpack + babel 编译后：

```js
function(module, exports, __webpack_require__) {
   /* harmony export */ exports["foo"] = foo;
   /* unused harmony export bar */;
  function foo() {
    return 'foo'
  }
  function bar() {
    return 'bar'
  }
}

// 可以看出 exports 中已经没有 bar 这个方法，于是再配合简单代码压缩
function(t, n, r) {
  function e() {
    return 'foo'
  }
  n.foo = e
}
// 就这样 bar 被干掉了
```

使用 rollup 打包编译，最终以 IIFE 语法输出：

```js
(function () {
  'use strict'
  
  function foo() {
    return 'foo'
  }
  const elem = document.getElementById('output')
  elem.innerHTML = `Output: ${foo()}`
}())
```

在你需要处理的代码对外不产生副作用时， tree-shaking 效果还不错，rollup.js 生成的 bundle 会更小一些。看一下它的在线 demo 就知道，模块合并以后都在同一个作用域下，直接用变量名就可以访问各个模块的接口；而不是 webpack 这样每个模块外还要包一层函数定义，再通过合并进去的 define/require 相互调用。Tree-shaking 不是代码压缩，所以还是得配合压缩工具来用。

### Commonjs 和 ES Module 的区别

### 介绍一下缓存策略

强缓存、协商缓存

### 301、302、307、308 的区别

### 两数之和

[两数之和](https://leetcode-cn.com/problems/two-sum/)

### 洗牌算法

### 数组中第K个最大元素

[数组中第K个最大元素](https://leetcode-cn.com/problems/kth-largest-element-in-an-array/)

## 二面

### redux-saga 和 mobx 对比

*   saga 还是遵循 mvc 模型，mobx 更接近 mvvm 模型
*   mobx 大概实现原理：数据劫持、发布订阅

### https 了解吗

*   非对称加密握手过程
*   证书签名过程和如何防止被篡改

### 跨域

*   webpack-dev-server 原理和如何处理跨域
*   nginx 转发
*   cors 中的简单请求和复杂请求
*   非简单请求下发起的 options

### localStorage、sessionStorage 和 cookie 的区别

### cookie 跨域时如何处理

### 爬楼梯

[爬楼梯](https://leetcode-cn.com/problems/climbing-stairs/)

### 使用最小花费爬楼梯

[使用最小花费爬楼梯](https://leetcode-cn.com/problems/min-cost-climbing-stairs/)

### 编辑距离

[编辑距离](https://leetcode-cn.com/problems/edit-distance/)

## 三面

### electron 的主进程，渲染进程之间的区别以及它们通信的手段

*   ipcMain、ipcRenderer
*   localStorage

### webview 和 iframe 的区别

webview是网页的原生载体，用于在原生环境中加载一个页面，iframe是网页的html载体，用于在网页中加载一个页面

### 大型文件上传

*   文件切片
*   用 web-worker 单独线程计算文件 hash 值
*   上传由于和其他接口统一域名，所以要做并发处理
*   进度条
*   对于已经上传过的文件跳过，对于失败做重传处理
*   发挥 electron 能使用 node 的优势，文件切片，计算哈希和上传都可以用 node 实现，并且开不同进程处理。并且由于 node 上传，所以不会有浏览器同一域名并发限制

### 快照数组

[快找数组](https://leetcode-cn.com/problems/snapshot-array/)

## 四面

### 路径总和

[路径总和](https://leetcode-cn.com/problems/path-sum/description/)



# 虎牙

## 一面

### http 中 get 和 post 的区别

### 缓存策略

### https 的握手过程

### http2 的特点

*   二进制传输
*   Header 压缩，哈夫曼编码
*   多路复用
*   服务端推送

### weak-Set、weak-Map和 Set、Map 的区别

### MVVM、MVC 的区别

### 如何实现一个 MVVM 模型

*   数据劫持 + 发布订阅

### saga 和 mobx 区别

### 说一下 vnode

*   vnode 作为数据和视图的一种映射关系
*   vue 和 react 的diff算法有相同又不同，相同的是都是同级比较，不同的是 vue 是双指针比较，react 是 key 集合比较

### 讲一下 webpack 性能优化

*   体积
    *   拆包
    *   摇树
    *   externals
*   速度
    *   多线程
    *   缓存

### 写过 plugins 吗

webpack 在打包构建的全过程中都会暴露一些生命周期函数，plugins 可以监听他们，在合适的生命周期里面调用改变 webpack 构建的输出

### webpack-dev-server 的 HMR 实现原理

### 手写防抖节流

## 二面

二面全是直播相关知识，没有记的必要

## 三面

### websocket 和 ajax 的区别

### xss、csrf

### 了解过 React 的 fiber

### react 执行过程

*   jsx 经过 babel 编译之后变成 render 函数
*   create update
*   enqueueUpdate
*   scheduleWork 更新 expiration time 
*   requestWord
*   workLoop 大循环
    *   performUnitOfWork
    *   beginWork
    *   completeUnitOfWork
*   Effect List
*   commit

### 介绍一下 hook

*   比起 hoc，hook 复用性更高
*   useState、useEffect、useRef 用法
*   优化 useCallback、useMemo

## 四面

聊人生