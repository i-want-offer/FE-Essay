# JSON.parse

>   JSON.parse(text[, reviver])

在面向面试编程中，有两种实现方式

## eval

```javascript
function jsonParse(opt) {
  return eval(`(${opt})`)
}
```



## new Function

```javascript
function jsonParse(opt) {
  return new Function(`return ${opt}`)()
}
```

