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
  const patchs = {} // 差异收集
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
    } else {
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
  // 遍历新旧属性列表
  // 查找删除项
  // 查找修改项
  // 查找新增项
  for(const key in oldProps) {
    if(!newProps.hasOwnProperty(key)) propsPatchs.push({ type: 'remove', prop: oldProps[key] }) // 移除
    else if(oldProps[key] !== newProps[key]) propsPatchs.push({ type: 'change', prop: oldProps[key], value: newProps[k] }) // 修改
  }
  
  for(const key in newProps) {
    if(!oldProps.hasOwnProperty(key)) propsPatchs.push({ type: 'add', prop: newProps[key]}) // 新增
  }
  return propsPatchs
}

// 对比子级差异
function diffChildren(oldChild, newChild, index, patchs) {
  // 标记子级的删除/新增/移动
  let { change, list } = diffList(oldChild, newChild, index, patchs)
  if(change.length) {
    if(patchs[index]) patchs[index] = patchs[index].concat(change)
    else patchs[index] = change
  }
  
  // 根据 key 获取原本匹配的节点，进一步递归从头开始对比
  oldChild.map((item, i) => {
    let keyIndex = list.indexOf(item.key)
    if(keyIndex) {
      let node = newChild[keyIndex]
      // 进一步递归对比
      dfs(item, node, index, patchs)
    }
  })
}

// 对比列表，主要也是根据 key 值查找匹配项
// 对比出新旧列表的新增/删除/移动
function diffList(oldList, newList, index, patchs) {
  let change = []
  let list = []
  const newKeys = newList.map(item => item.key)
  oldList.forEach(item => {
    if(newKeys.includes(item.key)) list.push(item.key)
    else list.push(null)
  })
  
  // 标记删除
  for (let i = list.length - 1; i >= 0; i--) {
    if(!list[i]) {
      list.splice(i, 1)
      change.push({ type: 'remove', index: i})
    }
  }
  
  // 标记新增和移动
  newList.forEach((item, i) => {
    const { key } = item
    const index = list.indexOf(key)
    if(index === -1 || key === null) {
      // 新增
      change.push({ type: 'add', node: item, index:i })
      list.splice(i, 0, key)
    }else if(index !== i) {
      // 移动
      change.push({ type: 'move', form: index, to: i})
      move(list, index, i)
    }
  })
  
  return { change, list }
}
```

