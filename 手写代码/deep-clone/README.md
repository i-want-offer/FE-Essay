# 深拷贝
## 乞丐版
```javascript
var someObj = {};
var newObj = JSON.parse(JSON.stringify(someObj));
```

### 白领版
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
