# 一面

## 自我介绍

## 你是怎么接触前端的

## js new 执行构造函数的的过程

[手写 new](https://github.com/i-want-offer/FE-Interview-questions/blob/master/%E6%89%8B%E5%86%99%E4%BB%A3%E7%A0%81/new/README.md)

## js 说一下 this 指向

就是说 this 绑定的几种情况

[this绑定](https://github.com/i-want-offer/FE-Interview-questions/blob/master/JS/JavaScript%20%E6%B7%B1%E5%85%A5%E7%B3%BB%E5%88%97/this.md)

## 说一下 bind 函数结构

## 说一下 js 继承

我说了寄生组合继承

[手写寄生组合继承](https://github.com/i-want-offer/FE-Interview-questions/blob/master/%E6%89%8B%E5%86%99%E4%BB%A3%E7%A0%81/extends/README.md)

中间他问了为什么需要把子函数的constructor 修改回本身：

原因在于使用 Object.create 修改子类的原型的 `__proto__ `，从而导致子类的构造函数变更为父类的构造函数，这样会导致 instanceof 判断错误。

## 实现正则表达式

>   实现域名匹配 qq.com 以及这个域名的所有子域名。
>
>   子域名：a.qq.com ，a.b.qq.com

```js
const reg = /((\w\.)+(qq.com)$)|^(qq.com)$/
```

实现思路：以 qq.com 作为字符串的结尾进行判断，以此判断 字符串. 的这种格式

## 说一下 DOM事件流模型

[DOM事件](https://github.com/i-want-offer/FE-Interview-questions/blob/master/JS/DOM%E4%BA%8B%E4%BB%B6.md)

## 说一下你知道的 HTTP 状态码

[HTTP状态](https://github.com/i-want-offer/FE-Interview-questions/blob/master/%E5%89%8D%E5%90%8E%E7%AB%AF%E9%80%9A%E4%BF%A1/HTTP%20%E7%8A%B6%E6%80%81%E7%A0%81.md)

## 浏览器缓存的过程

[浏览器缓存](https://github.com/i-want-offer/FE-Interview-questions/blob/master/%E5%89%8D%E5%90%8E%E7%AB%AF%E9%80%9A%E4%BF%A1/%E6%B5%8F%E8%A7%88%E5%99%A8%E7%BC%93%E5%AD%98.md)

## 说一下 XSS

[前端安全](https://github.com/i-want-offer/FE-Interview-questions/blob/master/%E5%AE%89%E5%85%A8/%E5%89%8D%E7%AB%AF%E5%AE%89%E5%85%A8.md)

### 如何防范

## 说一下 CSRF

[前端安全](https://github.com/i-want-offer/FE-Interview-questions/blob/master/%E5%AE%89%E5%85%A8/%E5%89%8D%E7%AB%AF%E5%AE%89%E5%85%A8.md)

### 危险网站 B 如何拿到受信任网站 A 的 cookie

危险网站B 无法拿到网站 A 的cookie，它是直接在网站B中向A的目标服务器发送get请求

### 危险网站 B 利用哪种 API 受信任网站 A 发送请求

xhr

## 项目经历中有写 SSR，说一下你是怎么实现的

Next.js

### 如何保证同构的模块不会挂掉，例如在服务端访问 document

没有做过

据了解，这种写法应该禁止

## ts问题

上一个面试说过，业务项目中经常存在线上会出现 null、undefined 等类型错误，所以迁移了 ts，ts解决了什么问题

## 你觉得 ts 很重吗，如何确保你的同事不写 any

配置禁掉了 any，如果用了 `//@ts-ignore` 会在 review 过问

## ts 给你带来的价值

## 实现一个 ts 的工具函数

```typescript
type A = {
  a: number;
  b: string;
  c: () => void;
  d: (s: string) => boolean;
}
```

实现一个工具函数 `GetOnlyFnProps<T>` ，提取泛型类型 T 中字段值是函数的类型。

```typescript
type GetOnlyFnKeys<T extends object> = {
  [K in keyof T]: T[K] extends Function ? K : never
}[keyof T]

type GetOnlyFnProps<T extends object> = {
  [K in GetOnlyFnKeys<T>]: T[K]
}
```

## 你有维护组件库，说一下如何管理组件

git + lerna

## 组件质量如何保存

## 没有测试用例的情况下，组件发布完全靠测试去人工测试？有没有遇到出错的情况。

## 组件发布的是不是所有依赖这个组件库的项目都需要升级？

## 发布问题

如果业务A需要组件进行修改，发布了版本 1.0.1，此时业务B没有升级，仍然是 1.0.0，如果此时业务 B 需要组件修改，发布版本 1.0.2，这时候就会带上 1.0.1上的修改，这上面的修改有可能会引发业务 B 的问题，如何处理

## 除了 lerna，还有其他的方式吗

## 你们组件库，别人如何能知道如何使用

storybook

## 假如现在是下午 5 点 35 分，时针和分针的夹角是多少

时钟每一大格是 30 度，每一小格是 6 度

时针每过一分钟移动 0.5 度



# 二面

## 自我介绍

## 公司自己开发组件库的原因

## 你在开发组件的角色

## 迁移 ts 的背景和原因

## 聊到一个服务端渲染的项目，具体聊聊为什么需要使用服务端渲染

## 这几个项目中，哪几个项目的挑战难度比较大

## 笔试题

1.  事件循环机制考察，打印输出的

2.  this 指向问题

    ```js
    var a = 2
    
    var obj = {
      a: 3,
      fn: function () {
        (() => {
          console.log(this.a)
        })()
      },
    }
    obj.fn()
    ```

3.  实现 input 的 autocomplete 功能

## 算法

### 大数相加

## 最近有没有了解前端最新技术

## react 17 有了解过吗

## pwa 有了解吗

## deno 和 node 的区别

## 在之前的公司，有没有主动推动一些技术的发展



# 三面

## 为什么离职

## 上上家为什么离职

我聊了对技术不追求

## 你认为上一家公司对技术有追求吗

我答了出色的系统

## 如何理解一个出色的系统

### 你们有多少的客户

### 客户样本太少，如何解决

### 哪个功能客户用得最多

### 整个系统里面一共有多少个订单

## 为什么要从 redux 从 mobx

### 你觉得这两个各自在哪个场景下更加合适

## 系统维护了多久

### 经手了很多人，维护的难度会不会很大

所以接入 ts

### 为什么接入 ts 会延长系统的生命周期

## 官网重构

### 怎样优化 seo

### 怎样进行首屏渲染测速

### 怎么知道服务端渲染的速度会快呢

### 是同构吗？是数据同构？是UI同构？

### 整个服务端渲染的瓶颈在哪里？单机qps是多少？

### 整个网站有多少用户量？有多少台 node 服务器

### 用的是 http/1 还是 http/2，用的是 http 还是 https？

## 你最擅长的是什么

### 有用 lint 吗

### 一共有多少条规则

### ts 除了静态类型检查以外，还有什么优秀的地方

## 只有 ts 有装饰器吗

## React 的版本？

## 计算题

```js
/*
	假设说，你们部门70%的人喜欢打篮球，80%的人喜欢踢足球，90%的人喜欢打排球，问篮球和足球都喜欢的人有多少
*/
```

### 给出的条件中能算出具体值吗？不能的话能算出具体范围吗？

## 如果团队需要加班到晚上 2-3 点，你觉得合理吗？





