# 使用 CSS3 Cubic-Bezier 创建动画链接悬停效果

我们将使用 CSS3 动画过渡来创建简单但引人入胜的悬停效果，将鼠标悬停在 div 上，会弹出一个小浮层。

我们还将看一下**CSS3 Cubic-Bezier（贝塞尔）曲线**，它是CSS过渡，为弹出框提供了更加流畅的运动，而不是僵化的机械运动。

我们看一下最终效果：

![](https://raw.githubusercontent.com/LaamGinghong/pics/master/img/20201120115316.gif)

让我们开始吧

## HTML部分

因为我们讨论的是 CSS 动画，因此模版尽量简单：

```html
<html>

<head>
	<meta charset="UTF-8">
	<link rel="stylesheet" href="styles.css">
</head>

<body>
	<div class="container">
		<div class="block">Block 1
			<span>Tab 1</span>
		</div>
		<div class="block">Block 2
			<span>Tab 2</span>
		</div>
	</div>
</body>

</html>
```

## CSS 部分

简单调整一下，将我们的背景修改一个颜色，然后将两个 block 水平垂直居中：

```css
body {
  padding: 0;
  margin: 0;
}

.container {
  height: 100vh;
  background: pink;
  display: flex;
  align-items: center;
  justify-content: center;
}

.container .block {
  color: #fff;
  background: rgba(0, 0, 0, 0.4);
  height: 100px;
  width: 120px;
  margin: 0 2px;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
  line-height: 100px;
  transition: all 0.4s;
  position: relative;
}

.container .block:hover {
  background: rgba(0, 0, 0, 0.6);
}

.container .block span {
  position: absolute;
  left: -15px;
  right: -15px;
  bottom: 0;
  color: #666;
  background: #fff;
  border-radius: 4px;
  height: 40px;
  line-height: 40px;
  visibility: hidden;
  z-index: 1;
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  opacity: 0;
}

.container .block:hover span {
  bottom: 120px;
  visibility: visible;
  opacity: 1;
}
```

CSS3 **Cubic-Bezier**曲线由四个点**p0**，**p1**，**p2**和**p3**定义。 p0点是曲线的起点，而p3点是曲线的终点。曲线越线性，运动就越僵硬(或不那么流畅)。

如果一个点一开始是正数，而下一个点是负数，那么运动一开始就会很慢。当点值变得比之前的点值高时，运动加快。

这就是CSS中Cubic-Bezier点的含义。由于动画短，所以动作很细微。弹出框从正方形底部开始时缓慢开始，然后开始加速到顶部。

尽管您可以创建没有Cubic-Bezier曲线过渡的动画，但动画的差异如下：

有Cubic-Bezier曲线过渡的动画：

![](https://raw.githubusercontent.com/LaamGinghong/pics/master/img/20201120115316.gif)

没有动画：

![](https://raw.githubusercontent.com/LaamGinghong/pics/master/img/20201120120044.gif)

可以看到，动画为悬停效果增添了生气。

最后一组CSS涉及样式化弹出框底部的小箭头。要了解有关在CSS中如何制作三角形的更多信息，请查看此CSS技巧文章。

## 总结

我们创建了一个简约的按钮样式链接。链接具有基本的背景悬停效果，但我们并没有止步于此。我们添加了一个小弹出框来显示链接的文本。在CSS3 Cubic-Bezier塞尔曲线的帮助下，动画流畅且令人愉悦。

这类知识非常有用，可以作为你显示社交媒体帐户的网站设计的一部分。

本文示例演示和完整代码请访问如下地址，建议 PC 端打开 [https://stackblitz.com/edit/bezier-transition](https://stackblitz.com/edit/bezier-transition)

