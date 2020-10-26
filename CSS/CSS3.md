# 前言

有了 CSS3，我们可以少些不少 JS 代码。CSS 3 不难，但很难用好。



# 过渡

>   CSS3 过渡是元素从一种样式逐渐改变为另一种样式的效果，要实现这一点，必须规定两项内容：指定要添加效果的 CSS 属性，执行效果持续时间。

 过渡是最常用的样式之一，平常使用场景为让一些交互效果变得更加生动流畅，不会显得那么生硬。

## 语法

```
transition: CSS属性, 花费时间, 效果曲线(默认是 ease), 延迟时间(默认是 0);
```

上面是简写模式，也可以分开写：

```
transition-property: CSS属性;
transition-duration: 花费时间;
transition-timing-function: 效果曲线;
transition-delay: 延迟时间;
```



# 动画

动画也是非常常用的样式之一，平常主要用来实现交互的动画效果，配合过渡让整个交互可以变得非常自然。

## 语法

```
animation: 动画名称, 一个周期花费时间, 运动曲线(默认是 ease), 动画延迟(默认是 0), 播放次数(默认是 1), 是否反向播放动画(默认 normal), 是否暂停动画(默认 runing);

animation-fill-mode: none | forwards | backwards | both;
none: 不改变默认行为;
forwards: 当动画完成后，保持最后一个属性值（在最后一个关键帧定义）;
backwards: 在 animation-delay 所制定的一段时间内，动画显示之前，应用开始属性值（在第一个关键帧中定义）;
both: 向前向后都被应用
```



# 形状变化

## 旋转

```
transform: rotate(30deg);
```

## 位移

```
transform: translate(30px, 30px);
```

## 缩放

```
transform: scale(.8);
```

## 偏离

```
transform: skew(10deg, 10deg);
```

## 翻滚

```
transform: rotateX(180deg); // 以 X 轴翻滚
transform: rotateY(180deg); // 以 Y 轴翻滚
transform: rotate3d(10,10,10,90deg); // 以圆心 3d 翻滚
```



# 选择器



# 阴影

>   以前没有 CSS3，或者需要兼容低版本浏览器的时候，阴影只能使用图片来实现。

## 语法

```
box-shadow: 水平阴影位置 垂直阴影位置 模糊距离 阴影的大小 阴影的颜色 阴影的方向(默认是从里到外，设置inset就是从外到里);
```



# 边框

## 边框图片

### 语法

```
border-image: 图片url 图像边界向内偏移 图像边界的宽度(默认为边框宽度) 用于指定在边框外部绘制偏移的量(默认0) 铺满方式(重复repeat、拉伸stretch、铺满round，默认为拉伸);
```

## 边框圆角

### 语法

```
border-radius: n1, n2, n3, n4;
```



# 背景

## background-clip

*   border-box

    背景从边框开始绘制

*   padding-box

    背景从 padding 开始绘制

*   content-box

    背景从 content 开始绘制

## background-origin

background-origin 用来指定 background-position 的相对位置

*   border-box
*   padding-box
*   content-box

## background-size

背景图片的大小，某些属性可配合 background-repeat，background-position 一起使用

## 允许多张背景图片



# 反射（倒影）

## 语法

```
-webkit-box-reflect: 方向[above-上 | below-下 | right-右 ｜ left-左], 偏移量, 遮罩图片
```



# 文字

## 换行

`word-break: normal | break-all | keep-all`

*   normal：默认规则，只在单词间隔处换行；
*   keep-all：只在半角空格或连接线处换行；
*   break-all：允许单词内换行。

`word-wrap: normal | break-word`

*   break-word：允许常单词或者 URL 换行；
*   normal：默认规则，只在断子点换行。

`text-overflow: clip | ellipsis`

*   clip：超出直接隐藏；
*   ellipsis：超出现实省略号

## 文字阴影

```
text-shadow: 水平阴影 垂直阴影 模糊距离 阴影颜色
```



# 颜色

## rgba

*   rgb：颜色值
*   a：饱和度

## hsla

*   h：色相
*   s：饱和度
*   l：亮度
*   a：透明度



# 渐变



# 滤镜

可以用来实现类似于公祭日那天网站变灰色。



# 弹性布局（Flex）



# 栅格布局（Grid）



# 多列布局

```html
<html>
  <style>
    #id {
      column-count: 2;
      column-rule: 2px solid #000;
    }
  </style>
  <body>
    <div id="news">
      123123412341238467219384u1rikdsm;faijspofiup1o823u4018734982934rdksa;lnoipjhpio1p283u412034
    </div>
  </body>
</html>
```



# 盒模型定义

`box-sizing`：

*   border-box：IE 模型，元素宽高包含边框和 padding；
*   content-box：标准模型，元素宽高值包含 content。



# 媒体查询

用于响应式布局监听屏幕大小变化。



# 混合模式

