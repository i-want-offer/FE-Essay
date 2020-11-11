# AST

>   **抽象语法树（Abstract Syntax Tree）**，是将代码逐字母解析成 **树状对象** 的形式。这是语言之间的转换、代码语法检查、代码风格检查、代码格式化、代码高亮、代码错误提示、代码自动补全等等的基础

```typescript
// 转换前
function square(n) {
  return n * n
}

// 转换后
const element = {
  type: "FunctionDeclaration",
  start: 0,
  end: 35,
  id: Identifier,
  expression: false,
  generator: false,
  params: [1, element],
  body: BlockStatement
}
```



# Babel 编译原理

*   babylon 将 ES Next 代码解析成 AST
*   babel-traverse 对 AST 进行遍历转译，得到新的 AST
*   新 AST 通过 babel-generator 转换成 ES5
