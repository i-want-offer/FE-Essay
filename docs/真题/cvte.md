# 一面

## 自我介绍

## 在维护组件库的过程中，有什么难点

## 说一下原型链

## 继承的优缺点

## 说一下输入 url 到页面渲染的全过程

## 首屏优化

## ts 的编译原理

## 实现一个 ts 工具函数，获取 Promise 中的泛型

```typescript
type A = Promise<string>
type UnGenericPromise<T extends Promise<any>> = T extends Promise<infer U> ? U : never
```

实现一个工具函数，用来提取 promise 的泛型类型

## React 中性能优化的做法

## PureComponent 中如何对比两个对象

## node 的事件循环

