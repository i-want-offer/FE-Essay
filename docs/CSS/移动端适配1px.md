# 原因

移动端造成 `1px` 的边框变粗的原因是因为：

>   CSS 中的 `1px` 并不等于移动设备的 `1px`，这是由于不同手机有不同的像素密度。在 `window` 对象中有一个 `devicePixelRatio` 属性，它可以反映 CSS 中的像素和设备的像素比。

>   devicePixelRatio 的官方定义：设备物理像素和设备独立像素的比例



# 解决方法

## 直接使用 `0.5px` 边框

WWWDC 对 IOS 的建议：直接使用 `0.5px` 边框

缺点：仅支持 IOS 8+，不支持安卓。

## 使用边框图片 `border-image`

```css
.border-image-1px {
  border: 1px solid transparent;
  border-image: url('../img/border') 2 repeat;
}
```

优点：可以设置单条、多条边框

缺点：修改颜色麻烦，圆角需要特殊处理

## 使用 `box-shadow` 模拟

```css
.box-shadow-1px {
  box-shadow: inset 0 -1px 1px -1px #e5e5e5;
}
```

优点：使用简单，圆角也能实现

缺点：边框有阴影，百分百过不了视觉走查

## 伪类 + transform + 绝对定位实现

```css
.scale-1px {
  position: relative;
}

.scale-1px::after {
  content: ' ';
  width: 100%;
  height: 1px; /* no */
  background: #e5e5e5;
  position: absolute;
  left: 0;
  bottom: 0;
  transform: scaleY(0.5);
}
```

优点：所有场景都能满足，支持圆角

缺点：伪类冲突
