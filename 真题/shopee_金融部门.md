# 一面

* 手写 删除链表的第 k 个节点
* 手写 Funtion.prototype.bind
* 手写 instanceof(a, b)  
* 实现大数相加： add('294732947329847328947328947382', '11') // 返回'294732947329847328947328947393'
* 解释浏览器缓存
* 网络分层，知道多少？ 解释 https / TCP ，自己知道多深说多深
* 跨域的方案解释一遍 （CORS, POST Massage, jsonP, 反向代理
* 解释简单请求和非简单请求？ 跨域如何带上cookie？
* React 事件系统理解，尽量多看一些文章去理解透彻
```js
   componentDidMount() {
    this.parent.addEventListener('click', (e) => {
      console.log('dom parent');
    })
    this.child.addEventListener('click', (e) => {
      console.log('dom child');
      
      // 1 加了这个之后会怎么样 ？ e.stopPropagation()
    })
    document.addEventListener('click', (e) => {
      console.log('document');
    })
  }

  childClick = (e) => {
    console.log('react child');
    
    // 2 加了这个之后又会怎么样 ？ e.stopPropagation()
  }

  parentClick = (e) => {
    console.log('react parent');
  }

  render() {
    return (
      <div onClick={this.parentClick} ref={ref => this.parent = ref}>
        <div onClick={this.childClick} ref={ref => this.child = ref}>
          test
        </div>
      </div>)
  }

```
* React.useEffect 和 useLayoutEffect 的执行顺序
```jsx
const App = () => {
  const [count, setCount] = React.useState(0);
  
  React.useLayoutEffect(() => {
    console.log('1')
    
    return () => {
      console.log('2')
    }
  }, [count])
  
  React.useEffect(() => {
    console.log('3')
    
    return () => {
      console.log('4')
    }
  }, [count]);

  return (
      <div onClick={() => setCount(2)}>{count}</div>
  );
}

ReactDOM.render(<App/>, document.getElementById('app'));

// 顺序应该是 2 => 1 => 画面变成2 => 4 => 3
```

# 二面
* 解释箭头函数 和 this 指向
```js
var a = 99
var obj = {
  a: 1024,
  say: () => console.log(this.a)
}

obj.say() // 打印的是？

obj.say.apply({a: 8989}) // 打印的是 ？
```

* 考察类型转化
```js
var obj = {a：1}

var foo = {}
foo[obj] = true

Object.keys(foo) // 返回的是什么？

```

* 接着吹项目，吹比。。。。 40分钟完事

