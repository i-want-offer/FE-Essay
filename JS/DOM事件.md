# DOM 事件

## 事件级别

1.  DOM 0级

    ```javascript
    el.onclick = function() {
    }
    ```

    >   当希望为同一个元素/标签绑定多个同类型的事件时（如给同一个按钮绑定三个点击事件），是不被允许的。DOM 0事件绑定，给元素的事件行为绑定方法，这些方法都是在当前元素事件行为的冒泡阶段（或者目标阶段）执行的

2.  DOM 2级

    ```javascript
    el.addEventListener(eventName, callback, useCapture)
    
    // eventName: 事件名称，可以是标准的 DOM 事件
    // callback: 回调函数，当事件触发时，函数会被注入一个参数为当前的事件对象 event
    // useCapture: 默认为false，代表事件句柄在冒泡阶段执行
    ```

3.  DOM 3级，写法和 DOM 2级一致，只是在 DOM 2级事件的基础上添加了更多的事件类型

    >   UI 事件：当前用户与页面的元素交互时触发：load，scroll
    >
    >   焦点事件：当元素获得或失去焦点时触发：blur，focus
    >
    >   鼠标事件：当用户通过鼠标在页面执行操作时触发：dblclick，mouseup
    >
    >   滚轮事件：当使用鼠标滚轮或类似设备时触发：mousewheel
    >
    >   文本事件：当在文档中输入文本时触发：textinput
    >
    >   键盘事件：当用户通过键盘在页面上执行操作时触发：keydown，keypress
    >
    >   合成事件：当为 IME（输入法编辑器）输入字符时触发：compositionstart
    >
    >   变动事件：当底层 DOM 结构发生变化时触发：DOMsubtreeModified
    >
    >   同时 DOM 3级事件也允许使用者自定义一些事件



## DOM 事件模型 事件流

事件模型分为：**捕获**和**冒泡**

事件流：

1.  捕获阶段：事件从 window 对象自上而下向目标节点传播的阶段
2.  目标阶段：真正的目标节点正在处理事件的阶段
3.  冒泡阶段：事件从目标节点自下而上向 window 对象传播的阶段

![DOM 事件流](https://user-gold-cdn.xitu.io/2019/12/31/16f5acb3c238de6c?imageslim)



## 事件委托（代理）

由于事件会在冒泡阶段向上传播到父节点，因此可以把子节点的监听函数定义在父节点上，由父节点的监听函数统一处理多个子元素的事件，这种方法叫事件的代理。

优点：

*   减少内存消耗，不需要为每个子元素绑定事件，提高性能
*   动态绑定事件



## Event 对象使用

1.  阻止默认行为：`event.preventDefault()`

2.  阻止冒泡：

    1.  `event.stopPropagation()` 阻止事件冒泡到父元素，阻止任何父事件处理程序被执行
    2.  `event.stopImmediatePropagation()` 既能阻止事件向父元素冒泡，也能阻止元素同事件类型的其他监听器被触发

3.  `event.target & event.currentTarget`

    ```html
    <div id="a">
      aaaa
      <div id="b">
        bbbb
        <div id="c">
          cccc
          <div id="d">
            dddd
          </div>
        </div>
      </div>
    </div>
    
    <script>
    	document.getElementById("a").addEventListener("click", function(e) {
        console.log(
        	"target:" e.target.id + "& currentTarget:" + e.currentTarget.id
        )
      })
      document.getElementById("b").addEventListener("click", function(e) {
        console.log(
        	"target:" e.target.id + "& currentTarget:" + e.currentTarget.id
        )
      })
      document.getElementById("c").addEventListener("click", function(e) {
        console.log(
        	"target:" e.target.id + "& currentTarget:" + e.currentTarget.id
        )
      })
      document.getElementById("d").addEventListener("click", function(e) {
        console.log(
        	"target:" e.target.id + "& currentTarget:" + e.currentTarget.id
        )
      })
    </script>
    
    <!-- 
    	当我们点击最里层的元素 d 时，会依次输出：
    	target: d & currentTarget: d
    	target: d & currentTarget: c
    	target: d & currentTarget: b
    	target: d & currentTarget: a
    -->
    ```

    由上述例子可知：`event.currentTarget` 始终是监听事件者，而 `event.target` 是事件的真正发出者



## 自定义事件

```javascript
// 创建事件，Event 是无法传递参数的
var event = new Event('event')

// 创建参数，CustomEvent 允许传递参数
var event = new CustomEvent('event', { detail: 'Hello world' })

// 监听事件
el.addEventListener('event', function(e) {
  // ...
}, false)

// 分发事件
el.dispatchEvent(event)
```



## 手写发布订阅模式

```typescript
class EventEmitter {
  events: {[key: string]: Function[]} = {}
  
 	// 订阅
	on(type: string, callback: Function) {
    if(!this.events) this.events = Object.create(null)
    
    if(!this.events[type]) {
      this.events[type] = [callback]
    }else {
      this.events[type].push(callback)
    }
  }
  
  // 取消订阅
  off(type: string) {
    if(!this.events[type]) return 
   	delete this.events[type]
  }
  
  // 只执行一次订阅
  once(type: string, callback: Function) {
    function fn() {
      callback()
      this.off(type)
    }
    
    this.on(type, fn)
  }
  
  // 触发事件
  emit(type: string, ...rest) {
    this.events[type] && this.events[type].forEach(fn => fn(...rest))
  }
}

// 使用情况
const event = new EventEmitter()

event.on('click', (...rest) => {
  console.log(rest)
})

event.emit('click')

event.off('click')

event.once('click', (...rest) => {
  console.log(rest)
})
```

