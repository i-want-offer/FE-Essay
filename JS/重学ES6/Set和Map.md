# Set 和 Map

## Set

### 概念

>   Set 是一个值的集合，集合中的值都是唯一的。

Set 是一个构造函数，可以通过 new 来创建一个实例。

Set 通过 `add()` 来增加元素，新增的元素位于集合的底部，如果新值与之前的元素重合，会被自动过滤掉。

Set 构造函数可以接受一个具有 Iterable 接口的其他数据结构作为参数。

### API

Set 的原型属性有两个：

*   `Set.prototype.constructor` ：构造函数，默认就是 Set 函数；
*   `Set.prototype.size` ：返回 Set 对象中的值的个数。

原型方法分为两类：一个是操作类，一个是遍历类。

操作类：

*   `Set.prototype.add(value)` ：在 Set 对象尾部添加一个元素，返回该 Set 对象；
*   `Set.prototype.clear()` ：清空 Set 对象内的所有元素；
*   `Set.prototype.delete(value)` : 移除 Set 的值终于这个值相等的值；
*   `Set.prototype.has(value)` ：返回一个布尔值，判断集合中是否存在当前值。

遍历类：

*   `Set.prototype.values()` ：返回一个新的迭代器对象，包含集合中的值；
*   `Set.prototype.keys()` ：同 `Set.prototype.values()` ；
*   `Set.prototype.forEach()` ：按照集合元素顺序，遍历访问所有元素。
*   `Set.prototype.entries()` ：返回一个新的迭代器对象，元素为 `[value, value]`

### WeakSet

WeakSet 也是一个构造函数，与 Set 类似，但是不同点主要有两个：

*   WeakSet 的元素值必须是可迭代对象，而不是像 Set 一样可以使用所有原生类型值；
*   WeakSet 持弱引用：集合中对象的引用为弱引用。如果没有其他的对 WeakSet 中对象的引用，那么这些对象会被当成垃圾回收掉。这也意味着 WeakSet 中没有存储当前对象的列表，正是因为这样，WeakSet 是不可枚举的。

WeakSet 有三个原型方法：

*   `WeakSet.prototype.add(value)` ：同 `Set.prototype.add` ；
*   `WeakSet.prototype.delete(value)` ：同 `Set.prototype.delete`  ；
*   `WeakSet.prototype.has(value)` ：同 `WeakSet.prototype.has` 。

## Map

### 概念

在 JS 中的对象是创建无序键值对的主要机制，但是对象的缺点在于不能使用非字符串作为键。因此 ES6 推出了新的数据结构 Map。

Map 和对象很类似，都是键值对形式，但是 Map 的键可以是任意类型的值，同时是有序状态。

在 MDN 中清晰地列出了 Map 和对象的区别：

|          | Map                                                          | Object                                                       |
| -------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 意外的键 | Map 默认不包含任何键，只包含显式插入的键。                   | 每一个对象都会有一个原型对象，根据原型继承机制，每一个对象都至少会包含它原型对象上面的键。（虽然 ES5 开始使用 `Object.create(null)` 的方式来创建一个没有原型的对象，但是这种用法不太常见） |
| 键的类型 | 一个 Map 的键可以是任意值，包括函数、对象或者是任意的基本类型。 | 一个对象的键必须是一个字符串或者是 Symbol。                  |
| 键的顺序 | Map 中的 key 是有序的，迭代遍历的时候按照插入的顺序进行遍历访问。 | 一个对象的键是无序的。（自 ES6 规范以来，对象却是保留了字符串和 Symbol 键的创建顺序；因此只有字符串键的对象上进行迭代将按照插入顺序产生键） |
| size     | Map 的键个数有提供具体的 API 来获取大小。                    | 需要手动遍历去计算。                                         |
| 迭代     | Map 是 iterable 的，所以可以直接被迭代。                     | 迭代一个对象需要先获取这个对象的 key，再按照 key 去获取对应的值。 |
| 性能     | 在频繁增删键值对的场景下表现更好。                           | 未做特殊性能优化。                                           |

### API

Map 的原型属性有两个：

*   `Map.prototype.constructor` ：创建当前实例的构造函数，默认是 Map 函数；
*   `Map.prototype.size` ：返回 Map 对象键值对的个数。

原型方法同样分成两类：操作类和遍历类。

操作类：

*   `Map.prototype.set(key, value)` ：设置 Map 对象中键的值，并返回 Map 对象；
*   `Map.prototype.get(key) ` ：返回键对应的值，如果不存在则返回 undefined；
*   `Map.prototype.has(key)` ：返回一个布尔值，表示当前 Map 中是否包含某个键；
*   `Map.prototype.delete(key)` ：删除 Map 某个键中对应的值；
*   `Map.prototype.clear()` ：清空当前 Map 对象。

遍历类：所有方法同 Set 一致，唯一区别在于：

*   `Map.prototype.keys()` ：返回的是元素对应的键；
*   `Map.prototype.entries()` ：返回的是 `[value, key]` 的格式

### WeakMap

WeakMap 和 WeakSet 很类似，都是弱引用，并且元素值的键必须是对象。

WeakMap 有五个原型方法，同 Map 的操作类方法一致。

