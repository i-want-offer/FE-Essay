# BigInt

BigInt 是 ES2020 推出的新特性，以弥补过去 JS 无法做超大数字运算。

## 概述

BigInt 是一个新型内置类型，主要是为了表达大于 `2^53-1` 的整数。

我们定义一个 BigInt 类型的数据时有两种方式，第一个是在数字后面加 n，另外一种是调用 `BigInt()` 方法。

```js
let theBigInt = 9007199254740991n
let alsoHuge = BigInt(9007199254740991)

typeof thiBigInt // bigint
```

## 运算

BigInt 支持一下运算 +、`*` 、- 、`**` 、%，并且支持了除了 >>>（无符号右移）之外的其他位运算。

值得注意的是，BigInt 不支持单目 + 运算，主要原因还是 BigInt 无法和 Number 类型直接运算，如果想要运算的话需要转换成同一个类型。但是，如果是 BigInt 转换成 Number 类型，有可能会丢失精度。

在比较运算符中，BigInt 和 Number 是不严格相等的，但是可以进行大小比较。

