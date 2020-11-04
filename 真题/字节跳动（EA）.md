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

## 三面

### 自我介绍

### 观麦的具体业务流程、商业模式

### 你们只是一个软件提供商，怎么保证客户能够正确使用你们的软件

### 公司的研发团队规模

### 前端有多少人？技术栈是什么

### 你们迁移 ts 的原因

### 你觉得迁移 ts 是正确的吗

### 所以你们迁移 ts 话费了多少成本？是完全的重构吗？

### 你们做这样整体重构的目的，仅仅是为了获得静态类型校验这样的目的吗？

### 你刚才说你离开了观麦，你现在处于什么状态？

### 那你现在考虑离开吗？为什么？

### 你实际做的业务是什么？

### 你觉得你做的业务没有技术含量吗？

### 这次你看机会你想找什么样的工作？

### 你选一个你在过往经历中能够体现出你的技术能力产出的过程

### 但是我没有听到里面有遇到技术上的挑战以及解决方案

### 你自己在代码里面用没有用到一些前端设计模式以及一些新的设计思路

### 你们整个前端工程化的体系是怎样做的

### 你目前整个开发中用的什么框架

### 你怎么对比 react 和 vue，从现在和从以后的发展趋势

### 它们整体在设计思想上有什么不同

### 为什么更喜欢使用 Angular

### 你在前端性能优化上有什么实践经验吗





