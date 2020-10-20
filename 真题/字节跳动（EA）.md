# 字节跳动（EA）

## 一面

### 自我介绍

### 详细介绍一下迁移 ts 遇到的问题以及如何解决

### 介绍一下浏览器缓存

### 算法题

LeetCode 原题 [搜索旋转排序数组](https://leetcode-cn.com/problems/search-in-rotated-sorted-array/)

![](https://raw.githubusercontent.com/LaamGinghong/pics/master/img/20201020220240.png)

### 介绍一下 HTTP/3、HTTP/2

### HTTP/2 多路复用的原理

### 介绍一下 flex 布局

### 如果flex容器是1000px，10个子项，每个款200px，会怎么渲染

### 输出题

```js
async function async1() {
  console.log('async1 start');
  await async2();
  console.log('async1 end');
}
async function async2() {
  console.log('async2');
}
console.log('script start');
setTimeout(function() {
  console.log('setTimeout');
}, 0)
async1();
new Promise(function(resolve) {
  console.log('promise1');
  resolve();
})
.then(function() {
  console.log('promise1 then');
  return 'promise1 end';
})
.then((res) => {
  console.log(res);
})
.then((res) => {
  console.log(res);
});
console.log('script end');
```

### 介绍一下跨域问题以及如何解决

### CORS 和普通的 ajax 请求有哪些不同

### 介绍一下 web 安全

### 有了解过 CSP 吗

### 介绍一下 webpack 的全过程

### webpack 中 loader 和 plugin 的区别

### 最近有学习哪些前端的新技术吗





