# 深拷贝
## 乞丐版
```javascript
var someObj = {};
var newObj = JSON.parse(JSON.stringify(someObj));
```

## 白领版

```javascript
function deepClone(data) {
  if (typeof data === "object") {
    var result = Array.isArray(data) ? [] : {};
    for (var key in data) {
      if (typeof data[key] === "object") {
        result[key] = deepClone(data[key]);
      } else {
        result[key] = data[key];
      }
    }
  } else {
    return data;
  }
}
```

## 精英版

```typescript
function deepClone<T>(data: T): T {
  const isObj = (v: any): boolean => Object.prototype.toString.call(v).slice(8, -1) === 'Object'
  
  function _deepClone(val: any) {
    if(Array.isArray(val)) {
      const source = val as any[]
      return source.reduce((res, item) => {
        res.push(_deepClone(item))
        return res
      }, [])
    }
    
    if(isObj(val)) {
      const source = val as object
      return Object.keys(val).reduce((res, key) => {
        res[key] = _deepClone(source[key])
        return res
      }, {})
    }
    
    return val
  }
  
  return _deepClone(data) as T
}
```

