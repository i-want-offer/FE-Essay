# Virtual DOM 原理

1.  利用 JavaScript 创建 DOM 树
2.  树的 diff，同层对比，输出 patchs(listDiff / diffChildren / diffProps)
    1.  没有新的节点，返回
    2.  新的节点 tagName 与 key 不变，对比 props，继续递归遍历子树
        1.  对比属性（对比新旧属性列表）
        2.  都存在的是否有变化
        3.  是否出现旧列表中没有的新属性
    3.  tagName 和 key 值变化了，则直接替换成新节点
3.  渲染差异
    1.  遍历 patchs，把需要更改的节点取出来
    2.  局部更新 DOM

```javascript
// diff 算法的实现
function diff(oldTree, newTree) {
  const patchs = {} // 差异手机
  dfs(oldTree, newTree, 0, patchs)
  return patchs
}

function dfs(oldNode, newNode, index, patchs) {
  let curPatchs = []
  if(newNode) {
    // 当新旧节点的 tagName 和 key 完全一致时
    if(oldNode.tagName === newNode.tagName && oldNode.key === newNode.key) {
      // 继续对比属性差异
      const props = diffProps(oldNode.props, newNode.props)
      curPatchs.push({type: 'changeProps', props})
      
      // 递归进入下一层级比较
      diffChildren(oldNode.children, newNode.children, index, patchs)
    }else {
      curPatchs.push({type: 'replaceNode', node:newNode})
    }
  }
  
  // 构建出整个差异树
  if(curPatchs.length) {
    if(patchs[index]) {
      patchs[index] = patchs[index].concat(curPatchs)
    }else {
      patchs[index] = curPatchs
    }
  }
}

// 属性对比实现
function diffProps(oldProps, newProps) {
  const propsPatchs = []
}
```

