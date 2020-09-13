# BFC

>   BFC：Block Formatting Context（块级格式化上下文）
>
>   在解释什么什么是 BFC 之前，我们需要先知道 Box、Formatting Context 的概念

## Box：CSS 布局的基本单位

Box 是 CSS 布局的对象和基本单位，直观来说，一个页面有很多个 Box 组成的。元素的类型和 display 属性，决定了这个 box 的类型。不同的 box，会参与不同的 Formatting Context（一个决定如何渲染文档的容器），因此 box 内的元素会以不同的方式渲染。

常见盒子：

*   block-level box：*display* 属性为 **block**，**list-item**，**table** 的元素，会生成 block-level box
*   inline-level box：*display* 属性为 **inline**，**inline-block**，**inline-table** 的元素，会生成 inline-level box
*   run-in box：css3 特有



## Formatting Context

Formatting Context 是 W3C CSS2.1 规范中的一个概念。他是页面的一块渲染区域，并且有一套渲染规则，它决定了其子元素如何定位，以及和其他元素的关系和相互作用。最常见的 Formatting Context 有 **Block formatting context** 和 **Inline formatting context**



## BFC 布局规则

*   内部的 Box 会在垂直方向一个接一个地放置
*   Box 垂直方向的距离由 margin 决定。属于同一个 BFC 的两个相邻 Box 的 margin 会发生重叠
*   每个盒子（块盒与行盒）的 margin box 的左边，与包含块 border box 的左边相接触，即使存在浮动也是如此
*   BFC 的区域不会与 float box 重叠
*   BFC 就是页面上的一个隔离的独立容器，容器里面的子元素不会影响外面的元素。反之也是如此
*   计算 BFC 的高度时，浮动元素也参与计算



## 如何创建 BFC

*   根元素或其他包含他的元素
*   浮动元素（元素的 float 不是 none）
*   绝对定位元素（元素具有 position 为 absolute 或 fixed）
*   内联块（元素具有 ` display: inline-block `）
*   表格单元格（元素具有 `display: table-cell `，HTML 表格单元格默认属性）
*   表格标题（元素具有 `display: table-caption`，HTML 表格标题默认属性）
*   具有 overflow 且值不是 visible 的块元素
*   弹性盒子（flex 或 inline-flex）
*   `display: flow-root`
*   `column-span: all`



## BFC 的作用

1.  利用 BFC 避免 margin 重叠
2.  自适应两栏布局
3.  清除浮动

