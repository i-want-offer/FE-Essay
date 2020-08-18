# 前言

我们可以发现 react-router 用 Link 或者 Push 跳转的时候，页面没有刷新，Url 却发生了变化，而且点击浏览器的返回按钮，页面同样没有刷新，Url 又回退了，这是为什么呢？



# 解密 - 点击返回按钮页面不刷新

## HashRouter 分析

通过 `location.hash` 来达到 `url` 变化但是页面不刷新

```js
location.hash = hash
```

然后通过 `onhashchange` 来监听浏览器的返回事件

```js
window.addEventListener('onhashchange', function (event) {
  changeDisplayName() // 替换显示内容
})
```

## BrowserRouter 分析

通过 pushState 来达到 url 改变但是页面不刷新，`history.push ` 实际上用原生的 `history.pushState` 来实现的，`history.replace` 实际上是用原生的 `history.replaceState` 来实现的。

```js
changeDisplayName() // 替换显示内容
window.history.pushState(null, null, newUrl)
```

然后通过 `popstate` 来监听浏览器的返回事件

```js
window.addEventListener('popstate', function (event) {
  changeDisplayName() // 替换显示内容
})
```

**demo**:

```jsx
import React, { useEffect, useState, useRef, Component } from 'react';

const MapPage=()=>{
  return <div>MapPage</div>
}
const RankPage=()=>{
  return <div>RankPage</div>
}

function ConPage() {
  const[ Page, setPage ] = useState('rank');

  useEffect(() => {
    window.addEventListener('popstate', (event) => {
      console.log("location: " + document.location + ", state: " + JSON.stringify(event.page));
      let val;
      if(event.page=='rank') {
        val='rank'
      }else{
        val='map'
      }
      console.log('useEffect',val) 
      setPage(val)
    });
  }, [])


  const _changePage = () => {
    if( Page=='rank' ) {
      setPage('map')
      window.history.pushState({page:'map'}, null, 'http://dev.jd.com:10086/con?pId=map');
     } else {
      setPage('rank')
      window.history.pushState({page:'rank'}, null, 'http://dev.jd.com:10086/con?pId=rank');
     }
  }

  return (
    <div>
      <div onClick={_changePage} className='btnTest'> 切换路由</div>
      {Page=='rank' && <RankPage />}
      {Page=='map' && <MapPage />}
    </div>
  )
}
export default ConPage
```

