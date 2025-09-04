
# offset和client以及scroll之间的区别

> offset、client和scroll是 JavaScript 中用于描述元素位置和尺寸的三个概念，它们的具体含义和区别如下：
___

**先说区别：**

> 
> **1，offset指偏移**: 包括这个元素在文档中占用的所有显示宽度，包括滚动条、padding、border，不包括overflow隐藏的部分；
> 
>**2，client指元素本身的可视内容**: 不包括overflow被折叠起来的部分，不包括滚动条、border，包括padding；
> 
> **3，scroll指滚动**: 包括这个元素没显示出来的实际宽度，包括padding，不包括滚动条、border；

## 1，offset
返回的值都是以像素为单位的；

对块级元素来说，offsetTop、offsetLeft、offsetWidth 及 offsetHeight 描述了元素相对于 offsetParent 的边界框。




|属性  |描述  |
|--|--|
| `element.offsetHeight`  |返回该元素的像素高度，高度包含该元素的垂直内边距 (padding)和边框(border)，且是一个整数  |
| `element.offsetWidth `  |返回一个元素的布局宽度，包含元素的边框 (border)、内边距 (padding)、竖直方向滚动条 (scrollbar)（如果存在的话）、以及 CSS 设置的宽度 (width) 的值  |
| `element.offsetLeft`  |返回当前元素左上角相对于 offsetParent 元素的左边界偏移的像素值  |
| `element.offsetTop`  |返回当前元素相对于offsetParent 元素的顶部内边距的距离 

`offsetParent` 是一个只读属性，返回一个指向最近的（指包含层级上的最近）包含该元素的定位元素或者最近的 table, td, th, body 元素。当元素的 style.display 设置为 "none" 时，offsetParent 返回 null。offsetParent 很有用，因为 offsetTop 和 offsetLeft 都是相对于其内边距边界的。


```js
var element = document.getElementById("myElement");
var offsetTop = element.offsetTop;
var offsetLeft = element.offsetLeft;
```

## 2，client
返回的值都是以像素为单位的；
|属性  |描述  |
|--|--|
| `element.clientHeight`  |返回该元素内部的高度，包含内边距，但不包括边框（border）、外边距（margin）和水平滚动条（如果存在）  |
| `element.clientWidth `  |返回该元素的布局宽度，包括内边距（padding），但不包括边框（border）、外边距（margin）和垂直滚动条（如果存在） |
| `element.clientLeft`  |返回一个元素的左边框的宽度。如果元素的文本方向是从右向左（RTL, right-to-left），并且由于内容溢出导致左边出现了一个垂直滚动条，则该属性包括滚动条的宽度  |
| `element.clientTop`  |返回一个元素顶部边框的宽度。不包括顶部外边距或内边距 

**注意：**
clientHeight 是可以通过 CSS height + CSS padding - 水平滚动条高度（如果存在）来进行计算的；
clientLeft 和clientTop都不包括外边距和内边距。

```js
var element = document.getElementById("myElement");
var clientWidth = element.clientWidth;
var clientHeight = element.clientHeight;
```


## 3，scroll
scroll指滚动，包括这个元素没显示出来的实际宽度，包括padding，不包括滚动条、border；
|属性  |描述  |
|--|--|
| `element.scrollHeight `  |获取对象的滚动高度，对象的实际高度,包括由于溢出导致的视图中不可见内容  |
| `element.scrollWidth `  |获取对象的滚动宽度,包括由于 overflow 溢出而在屏幕上不可见的内容  |
| `element.scrollLeft  `  |可以读取或设置元素滚动条到元素左边的距离 |
| `element.scrollTop `  |可以获取或设置一个元素的内容垂直滚动的距离 

```js
var element = document.getElementById("myElement");
var scrollTop = element.scrollTop;
var scrollLeft = element.scrollLeft;
```
回到顶部：
```js
window.scrollTo(0, 0); 
```