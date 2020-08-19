babel 的编译过程分为三个阶段：**parsing**、**transforming**、**generating**，以 ES6 编译为 ES5 作为例子：

1.  ES6 代码输入；
2.  babylon 进行解析得到 AST；
3.  plugin 用 babel-traverse 对 AST树进行遍历编译，得到新的 AST树；
4.  用 babel-generator 通过 AST树生成 ES5 代码。