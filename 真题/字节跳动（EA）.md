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

## 二面

### 自我介绍

### 离职原因

### 你希望加入一个什么样的团队

### 能说说迁移 ts 的背景吗

### 算法题

![](https://raw.githubusercontent.com/LaamGinghong/pics/master/img/20201026085941.png)

```js
function addSerial(arr) {
    var hashMap = {}
    arr.forEach((item, index)=>{
        hashMap[item] = hashMap[item] || {
            length: 0,
            nums: [],
            index
        }
        hashMap[item].length++
        hashMap[item].nums.push(hashMap[item].length)
    })
    var result = arr.map(item=>{
        var num = hashMap[item].nums.shift()
        return `${item}${num}`
    })
    for(const i in hashMap) {
        if(hashMap.hasOwnProperty(i)) {
            if(hashMap[i].length === 1) {
                const index = hashMap[i].index
                result[index] = arr[index]
            }
        }
    }
    return result
}
```

### 你实现的这个算法的时间复杂度和空间复杂度分别是多少

### 输出题

![](https://raw.githubusercontent.com/LaamGinghong/pics/master/img/20201026090040.png)

```js
// 'window'
// 'window'
// '1-1'
// '1-2'
// 'window'
// '1-2'
```

### 你觉得这题在考察什么

### 分别说说为什么是这些输出

### 能说说你在团队中推动的事情吗

### 根据你的简历，你是有组件开发的经历？

### 你认为什么样的组件是一个好组件

### 如何保证组件的正确性，不会出错？

### 如果你现在下班了，但是用了你的组件的某个一个即将上线的需求出了问题，你的同事有能力修改代码， 你会怎么做？

### 能介绍一下如何做到按需加载组件吗？





