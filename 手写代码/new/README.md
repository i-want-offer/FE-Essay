# new 运算符

>   ` new Fn(...arguments)`

1.  创建一个空对象
2.  让空对象的 `__proto__` （IE 没有该属性）成员指向构造函数的 prototype 成员对象
3.  使用 apply 调用构造函数，属性和方法被添加到 this 引用的对象中
4.  如果构造函数中没有返回其他对象，那么返回 this，即创建的这个新对象；否则返回构造函数返回的对象

```typescript
function New(fn: () => any, ...args: any) {
  const obj = Object.create(fn.prototype)
  const result = fn.apply(obj, args)
  if(result && (typeof result === 'object' || typeof result === 'function')) {
    return result
  }
  return obj
}
```

