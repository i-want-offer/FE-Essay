# 一面

## 说出打印结果

![](https://raw.githubusercontent.com/LaamGinghong/pics/master/img/20200902162836.png)

## 手写原型链继承

### 实例属性和原型属性的区别

### instancef 的原理

## 浏览器缓存

### Service Worker 大小大概是30Gb，如果用户硬盘没有那么大怎么办

### Service Worker 的大小和强缓存、协商缓存的大小是一起计算的还是分开计算

### Push Cache 的具体处理方式

## HTTP2 的优缺点

### HTTP2 有没有可能比 HTTP1 还要更慢

## var、let、const 的区别

## 说出打印结果

```js
    // 任务
    // 面试官提出的问题将出现在这里。
    
    // 写出下面这段代码打印的结果
    async function async1() {
      console.log('async1 start');
      await async2();
      console.log('async1 end');
    }
    
    async function async2() {
      console.log('async2 start');
    }
    
    console.log('script start');
    
    setTimeout(function() {
      console.log('setTimeout');
    }, 0);
    
    async1();
    
    new Promise(function(resolve) {
      console.log('promise1');
      resolve();
    }).then(function() {
      console.log('promise2');
    }).then(function() {
      console.log('promise3');
    });
    
    console.log('script end');
```

## webpack

### 常用插件

### 如果有一个工程打包特别大，如何进行优化

## cjs 和 esm 模块化的区别

## es6+ 有哪些新的语法

## 跨域解决方案

### 说一下 CORS 中的预请求

## xss 和 csrf

### 用户信息存储的方式

## React 性能优化的方式

## 实现一个节流函数

![](https://raw.githubusercontent.com/LaamGinghong/pics/master/img/20200907163633.png)

要求初次执行的时候立刻执行
