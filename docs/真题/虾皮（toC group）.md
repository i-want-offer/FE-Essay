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



# 二面

## 自我介绍

## 介绍一下你们的组件库

### 有哪个组件最让你印象深刻

### 这个组件的原理介绍一下

### 这个组件有做兼容性处理吗

## 说出以下代码的输出

```html
<body>
  <div id="box">
    <a href="javascript:console.log(1)" id="anchor">Click</a>
  </div>
</body>
<script>
	var box = document.getElementById('box')
  var anchor = document.getElementById('anchor')
  
  anchor.addEventListener('click', function() {
    console.log(2)
  })
  
  box.addEventListener('click', function() {
    console.log(3)
  }, true)
  
	box.addEventListener('click', function() {
    console.log(4)
  })
</script>
```

## `let a = "abc"`，解释器在解释在这句话的过程中，内存发生的变化，比如内存放在哪里，申请了多大的内存

## 介绍一下 esm 和 cjs 的差异

## 介绍一下前端安全问题

## 假设有一个页面需要实现下拉无限滚动加载，如何实现和优化

## 笔试题

```js
// 实现如下这样的函数`f()`，要求调用深度不限。(考察点：对 JS 对象化的理解)

// f(1).val === 1
// f(1)(2).val === 3
// f(1)(2)(3).val === 6
// f(10)(100)(1000)(10000).val === 11110
// f(a0)(a1)(a2)...(an).val === a0 + a1 + a2 +...+ an
```

