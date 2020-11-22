# React 使用 use Effect 和 useLayoutEffect 的区别

useEffect 是每次 render 之后都会调用的函数，可以代替之前 class component 中的三个生命周期钩子。

作为 componentDidMount 使用，`[]` 作为第二个参数；

作为 componentDiUpdate 使用，可以指定依赖；

作为 componentWillUnmount 使用，通过 return 一个函数清除副作用；

以上三种用途可同时存在。

## 案例

要想知道一个组件什么时候第一次渲染，可以使用 useEffect，第二个参数为空数组，这样只在第一次调用时执行，第二三次不执行。

```jsx
//使用useEffect之前要先引入
import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'

function App(){
  const [n, setN] = useState(0);
  const add = () => {
    setN(i => i + 1);
  };

  // 第一次渲染，只执行这一次，[]要在第二个参数
	useEffect(() => {
    console.log('这是第一次渲染执行这句话');
  }, []);

  return(
    <div>
      n:{n}
      <button onClick={add}>+1</button>
    </div>
  )
}

ReactDOM.render(<App />,document.getElementById('root'));
```

每次渲染都要执行，只要有一个数据变化了就执行，不用写第二个参数：

```js
useEffect(() => {
  console.log('这是第一次渲染执行这句话');
});
```

当某一个数据变化了才执行：

```js
useEffect(() => {
	console.log('n变化了');
}, [n])
```

## 区别

useLayoutEffect 与 useEffect 用法一样，但略有差别：

*   useEffect 是按照顺序执行代码的，改变屏幕像素之后执行（先渲染，后改变 DOM），当改变屏幕内容时可能会产生闪烁；
*   useLayoutEffect 是改变屏幕像素之前就执行（会推迟页面显示的事件，先改变 DOM 后渲染），不会产生闪烁。

综上：

*   useLayoutEffect 总是比 useEffect 先执行；
*   useLayoutEffect 里的任务最好影响了 Layout；
*   **为了用户体验，优先使用 useEffect（优先渲染）。**

