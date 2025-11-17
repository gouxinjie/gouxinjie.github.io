# 前端常见面试题总结（初版）

## 一、CSS 相关

### 1、css 中盒子水平垂直居中的几种方式

父元素：

```css
.container {
  width: 600px;
  height: 600px;
  border: 1px solid red;
  background-color: antiquewhite;
  margin: 0 auto;
  /* 父盒子开启相对定位 */
  position: relative;
}
```

**1，定位走自身一半**

这种方式需要知道子元素的实际高度和宽度，最后要水平方向和垂直方向利用 margin 属性的负值走自身一半；

```css
/* 子元素 */
.item {
  width: 100px;
  height: 100px;
  background-color: yellowgreen;
  /* 子元素开启绝对定位 */
  position: absolute;
  top: 50%; /* 子元素的上边界走父盒子高度的50% */
  left: 50%; /* 子元素的左边界走父盒子宽度的50% */
  margin-top: -50px; /*向上走回自身高度的一半*/
  margin-left: -50px; /*向左走回自身宽度的一半*/
}
```

**2，定位使用 margin;auto**

也是使用绝对定位，但上下左右的定位值都要设置为 0；不需要知道子元素的宽度和高度；

正常情况下不使用定位，margin:auto 等同于 margin:0 auto；也就是水平居中，无法达到垂直居中，既使垂直方向有剩余空间；

使用了绝对定位之后， margin: auto;就可以实现垂直方向的居中；我猜想是因为绝对定位触发了 BFC 区域，导致父元素和子元素相互隔离；(仅个人观点)

```css
/* 子元素 */
.item {
  width: 100px;
  height: 100px;
  background-color: yellowgreen;
  /* 子元素开启绝对定位 */
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto; /*相当于宽度和高度自动计算为居中*/
}
```

**3，使用 flex 弹性布局**

flex 布局是很常用的方法；不需要知道子元素的宽度和高度， 主轴和交叉轴都设置为居中即可；

```css
/* 父元素 */
.container {
  width: 600px;
  height: 600px;
  border: 1px solid red;
  background-color: antiquewhite;
  display: flex;
  /* 主轴居中 */
  justify-content: center;
  /* 交叉轴居中 */
  align-items: center;
}
```

**4，transform(变换)实现居中**

也是使用子绝父相，利用 css3 新增 transform 的 translate 属性来进行垂直居中；

translate 可以同时传两个属性，第一个是水平方向移动距离，第二个是垂直方向的移动距离；

translate 中的%百分比相对的是自身的 ，也就是向左向上走自身的%50 来实现居中效果；

```css
/* 子元素 */
.item {
  width: 100px;
  height: 100px;
  background-color: yellowgreen;
  position: absolute;
  top: 50%;
  left: 50%;
  // 走自身一半
  transform: translate(-50%, -50%);
}
```

### 2， 盒模型介绍

CSS3 中的盒模型有以下两种：**标准盒模型**、**IE（替代）盒模型**。

两种盒子模型都是由 `content + padding + border + margin` 构成，其大小都是由 `content + padding + border` 决定的，但是盒子内容宽/高度（即 `width/height`）的计算范围根据盒模型的不同会有所不同：

- 标准盒模型：只包含 `content` 。
- IE（替代）盒模型：`content + padding + border` 。

可以通过 `box-sizing` 来改变元素的盒模型：

- `box-sizing: content-box` ：标准盒模型（默认值）。
- `box-sizing: border-box` ：IE（替代）盒模型。

### 3，BFC 具有一些特性：

块级格式上下文，每一个 BFC 盒子都相当于一个独立的区域，具有以下特性：

1. 块级元素会在垂直方向一个接一个的排列，和文档流的排列方式一致。
2. 在 BFC 中上下相邻的两个容器的 `margin` 会重叠，创建新的 BFC 可以避免外边距重叠。
3. 计算 BFC 的高度时，需要计算浮动元素的高度。
4. BFC 区域不会与浮动的容器发生重叠。
5. BFC 是独立的容器，容器内部元素不会影响外部元素。
6. 每个元素的左 `margin` 值和容器的左 `border` 相接触。

**创建 BFC 的方式：**

（1）元素设置浮动：float 除 none 以外的值

（2）绝对定位元素（`position` 为 `absolute` 或 `fixed` ）

（3）display 值为：inline-block、table-cell、table-caption、flex 等

（4）overflow 值为：hidden、auto、scroll

### 4，css 选择器和优先级

!important > style > id > class

### 5， 实现两栏布局（左侧固定 + 右侧自适应布局）

现在有以下 DOM 结构：

```html
html 代码解读复制代码
<div class="outer">
  <div class="left">左侧</div>
  <div class="right">右侧</div>
</div>
```

1，利用浮动，左边元素宽度固定 ，设置向左浮动。将右边元素的 `margin-left` 设为固定宽度 。

> 注意，因为右边元素的 `width` 默认为 `auto` ，所以会自动撑满父元素。

```css
css 代码解读复制代码.outer {
  height: 100px;
}
.left {
  float: left;
  width: 200px;
  height: 100%;
  background: lightcoral;
}
.right {
  margin-left: 200px;
  height: 100%;
  background: lightseagreen;
}
```

2，同样利用浮动，左边元素宽度固定 ，设置向左浮动。右侧元素设置 `overflow: hidden;` 这样右边就触发了 `BFC` ，`BFC` 的区域不会与浮动元素发生重叠，所以两侧就不会发生重叠。

```css
css 代码解读复制代码.outer {
  height: 100px;
}
.left {
  float: left;
  width: 200px;
  height: 100%;
  background: lightcoral;
}
.right {
  overflow: auto;
  height: 100%;
  background: lightseagreen;
}
```

3，利用 `flex` 布局，左边元素固定宽度，右边的元素设置 `flex: 1` 。

```css
.outer {
  display: flex;
  height: 100px;
}
.left {
  width: 200px;
  height: 100%;
  background: lightcoral;
}
.right {
  flex: 1;
  height: 100%;
  background: lightseagreen;
}
```

4，利用绝对定位，父级元素设为相对定位。左边元素 `absolute` 定位，宽度固定。右边元素的 `margin-left` 的值设为左边元素的宽度值。

```css
.outer {
  position: relative;
  height: 100px;
}
.left {
  position: absolute;
  width: 200px;
  height: 100%;
  background: lightcoral;
}
.right {
  margin-left: 200px;
  height: 100%;
  background: lightseagreen;
}
```

5，利用绝对定位，父级元素设为相对定位。左边元素宽度固定，右边元素 `absolute` 定位， `left` 为宽度大小，其余方向定位为 `0` 。

```css
.outer {
  position: relative;
  height: 100px;
}
.left {
  width: 200px;
  height: 100%;
  background: lightcoral;
}
.right {
  position: absolute;
  left: 200px;
  top: 0;
  right: 0;
  bottom: 0;
  height: 100%;
  background: lightseagreen;
}
```

### 6， 实现圣杯布局和双飞翼布局（经典三分栏布局）

圣杯布局和双飞翼布局的目的：

- 三栏布局，中间一栏最先加载和渲染（**内容最重要，这就是为什么还需要了解这种布局的原因**）。
- 两侧内容固定，中间内容随着宽度自适应。
- 一般用于 PC 网页。

圣杯布局和双飞翼布局的技术总结：

- 使用 `float` 布局。
- 两侧使用 `margin` 负值，以便和中间内容横向重叠。
- 防止中间内容被两侧覆盖，圣杯布局用 `padding` ，双飞翼布局用 `margin` 。

**圣杯布局：** HTML 结构：

```html
html 代码解读复制代码
<div id="container" class="clearfix">
  <p class="center">我是中间</p>
  <p class="left">我是左边</p>
  <p class="right">我是右边</p>
</div>
```

CSS 样式：

```css
#container {
  padding-left: 200px;
  padding-right: 150px;
  overflow: auto;
}
#container p {
  float: left;
}
.center {
  width: 100%;
  background-color: lightcoral;
}
.left {
  width: 200px;
  position: relative;
  left: -200px;
  margin-left: -100%;
  background-color: lightcyan;
}
.right {
  width: 150px;
  margin-right: -150px;
  background-color: lightgreen;
}
.clearfix:after {
  content: "";
  display: table;
  clear: both;
}
```

**双飞翼布局：** HTML 结构：

```html
<div id="main" class="float">
  <div id="main-wrap">main</div>
</div>
<div id="left" class="float">left</div>
<div id="right" class="float">right</div>
```

CSS 样式：

```css
.float {
  float: left;
}
#main {
  width: 100%;
  height: 200px;
  background-color: lightpink;
}
#main-wrap {
  margin: 0 190px 0 190px;
}
#left {
  width: 190px;
  height: 200px;
  background-color: lightsalmon;
  margin-left: -100%;
}
#right {
  width: 190px;
  height: 200px;
  background-color: lightskyblue;
  margin-left: -190px;
}
```

tips：上述代码中 `margin-left: -100%` 相对的是父元素的 `content` 宽度，即不包含 `paddig` 、 `border` 的宽度。

其实以上问题需要掌握 **margin 负值问题** 即可很好理解

### 7，可以继承的 ss 属性

1. **字体系列属性**

- font-family：字体系列 ；font-weight：字体的粗细
- font-size：字体的大小 ； font-style：字体的风格

1. **文本系列属性**

- text-indent：文本缩进 ；text-align：文本水平对齐
- line-height：行高； word-spacing：单词之间的间距
- letter-spacing：中文或者字母之间的间距 ； color：文本颜色
- text-transform：控制文本大小写（就是 uppercase、lowercase、capitalize 这三个）

### 8，隐藏元素的方法有哪些

- **display: none**：渲染树不会包含该渲染对象，因此该元素不会在页面中占据位置，也不会响应绑定的监听事件。
- **visibility: hidden**：元素在页面中仍占据空间，但是不会响应绑定的监听事件。
- **opacity: 0**：将元素的透明度设置为 0，以此来实现元素的隐藏。元素在页面中仍然占据空间，并且能够响应元素绑定的监听事件。
- **position: absolute**：通过使用绝对定位将元素移除可视区域内，以此来实现元素的隐藏。
- **z-index: 负值**：来使其他元素遮盖住该元素，以此来实现隐藏。
- **clip/clip-path** ：使用元素裁剪的方法来实现元素的隐藏，这种方法下，元素仍在页面中占据位置，但是不会响应绑定的监听事件。
- **transform: scale(0,0)**：将元素缩放为 0，来实现元素的隐藏。这种方法下，元素仍在页面中占据位置，但是不会响应绑定的监听事件。

### 9，link 和@import 的区别

两者都是外部引用 CSS 的方式，它们的区别如下：

- link 是 XHTML 标签，除了加载 CSS 外，还可以定义 RSS 等其他事务；@import 属于 CSS 范畴，只能加载 CSS。
- link 引用 CSS 时，在页面载入时同时加载；@import 需要页面网页完全载入以后加载。
- link 是 XHTML 标签，无兼容问题；@import 是在 CSS2.1 提出的，低版本的浏览器不支持。
- link 支持使用 Javascript 控制 DOM 去改变样式；而@import 不支持。

### 10，CSS3 中有哪些新特性

- 新增各种 CSS 选择器 （: not(.input)：所有 class 不是“input”的节点）
- 圆角 （border-radius:8px）
- 多列布局 （multi-column layout）
- 阴影和反射 （Shadoweflect）
- 文字特效 （text-shadow）
- 文字渲染 （Text-decoration）
- 线性渐变 （gradient）
- 旋转 （transform）
- 增加了旋转,缩放,定位,倾斜,动画,多背景

### 11，什么是物理像素，逻辑像素和像素密度，为什么在移动端开发时需要用到@3x, @2x 这种图片？

以 iPhone XS 为例，当写 CSS 代码时，针对于单位 px，其宽度为 414px & 896px，也就是说当赋予一个 DIV 元素宽度为 414px，这个 DIV 就会填满手机的宽度；

而如果有一把尺子来实际测量这部手机的物理像素，实际为 1242\*2688 物理像素；经过计算可知，1242/414=3，也就是说，在单边上，一个逻辑像素=3 个物理像素，就说这个屏幕的像素密度为 3，也就是常说的 3 倍屏。

对于图片来说，为了保证其不失真，1 个图片像素至少要对应一个物理像素，假如原始图片是 500300 像素，那么在 3 倍屏上就要放一个 1500900 像素的图片才能保证 1 个物理像素至少对应一个图片像素，才能不失真。

### 12，margin 和 padding 的使用场景

- 需要在 border 外侧添加空白，且空白处不需要背景（色）时，使用 margin；
- 需要在 border 内测添加空白，且空白处需要背景（色）时，使用 padding。

### 13，单行、多行文本溢出隐藏

- 单行文本溢出

```css
css 代码解读复制代码overflow: hidden;            // 溢出隐藏
text-overflow: ellipsis;      // 溢出用省略号显示
white-space: nowrap;         // 规定段落中的文本不进行换行
```

- 多行文本溢出

```css
css 代码解读复制代码overflow: hidden;            // 溢出隐藏
text-overflow: ellipsis;     // 溢出用省略号显示
display:-webkit-box;         // 作为弹性伸缩盒子模型显示。
-webkit-box-orient:vertical; // 设置伸缩盒子的子元素排列方式：从上到下垂直排列
-webkit-line-clamp:3;        // 显示的行数
```

注意：由于上面的三个属性都是 CSS3 的属性，没有浏览器可以兼容，所以要在前面加一个`-webkit-` 来兼容一部分浏览器。

### **14，浮动元素引起的问题和解决？**

- 父元素的高度无法被撑开，影响与父元素同级的元素（父元素塌陷问题）

**清除浮动的方式如下**

- 给父级 div 定义`height`属性
- 最后一个浮动元素之后添加一个空的 div 标签，并添加`clear:both`样式
- 包含浮动元素的父级标签添加`overflow:hidden`或者`overflow:auto`
- 使用 :after 伪元素。由于 IE6-7 不支持 :after，使用 zoom:1 触发 hasLayout\*\*

### 15，什么是 margin 重叠问题？如何解决？

**问题描述：** 两个块级元素的上外边距和下外边距可能会合并（折叠）为一个外边距，其大小会取其中外边距值大的那个，这种行为就是外边距折叠。需要注意的是，**浮动的元素和绝对定位**这种脱离文档流的元素的外边距不会折叠。重叠只会出现在**垂直方向**。

**计算原则：**

折叠合并后外边距的计算原则如下：

- 如果两者都是正数，那么就去最大者
- 如果是一正一负，就会正值减去负值的绝对值
- 两个都是负值时，用 0 减去两个中绝对值大的那个

**解决办法：** 对于折叠的情况，主要有两种：**兄弟之间重叠**和**父子之间重叠**

（1）兄弟之间重叠

- 底部元素变为行内盒子：`display: inline-block`
- 底部元素设置浮动：`float`
- 底部元素的 position 的值为`absolute/fixed`

（2）父子之间重叠

- 父元素加入：`overflow: hidden`
- 父元素添加透明边框：`border:1px solid transparent`
- 子元素变为行内盒子：`display: inline-block`
- 子元素加入浮动属性或定位

**position:fixed 根元素是浏览器**

### 16，画一条 0.5px 的线

```
transform: scale(0.5,0.5);
```

## 二、JS 相关

### JWT

**过程：**

1、客户端使用用户名和密码请求登录 2、服务端收到请求，验证用户名和密码 3、验证成功后，服务端会签发一个 token，再把这个 token 返回给客户端 4、客户端收到 token 后可以把它存储起来，比如放到 cookie 中 5、客户端每次向服务端请求资源时需要携带服务端签发的 token，可以在 cookie 或者 header 中携带 6、服务端收到请求，然后去验证客户端请求里面带着的 token，如果验证成功，就向客户端返回请求数据

**优点：**

- **支持跨域访问**：`cookie`是无法跨域的，而`token`由于没有用到`cookie`(前提是将`token`放到请求头中)，所以跨域后不会存在信息丢失问题
- **更适用于移动端**：当客户端是非浏览器平台时，`cookie`是不被支持的，此时采用`token`认证方式会简单很多

### **1，函数式编程的含义**

函数式编程是一种强调以函数为主的软件开发风格。通过组合纯函数，避免共享状态、可变作用和副作用来构建软件的过程。 目的：使用函数来抽象作用在数据之上的控制流和操作，从而在系统中消除副作用并减少对状态的改变。

### **2，闭包：**

**概念**：函数里面套函数，一个函数中返回了另一个函数，内部函数可以访问外部函数的作用域。

这归功于 js 特有的作用域链式查找，函数内部可以直接读取全局变量，会一级级的向上查找，直到找到为之。（此过程不可逆）

利用了函数作用域链的特性，一个函数内部定义的函数会将包含外部函数的活动对象添加到它的作用域链中，函数执行完毕，其执行作用域链销毁，但因内部函数的作用域链仍然在引用这个活动对象，所以其活动对象不会被销毁，直到内部函数被烧毁后才被销毁。

### **3，作用域** （全局作用域、局部作用域、块级作用域、全局变量、局部变量、作用域链）

（1）全局作用域：在整个 script 标签或者一个单独的 js 文件内起作用

（2）局部作用域（也叫函数作用域）：只能在函数内部起效果和作用（函数的形参可以看作是局部变量，节约内存）

（3）函数的形参可以看作是局部变量

```js
var i = 0;
function fun() {
  var i = 6;
  console.log("i:", i);
}
fun(); // 6 函数里面是就近原则
```

（4）作用域链：内部函数访问外部函数的变量，采取的是**链式查找**的方式来决定取哪个值。（就近原则）

```js
var num = 22;
function fn() {
  //外部函数
  var num = 33;
  function fun() {
    //内部函数
    console.log(num);
  }
  fun();
}
fn(); //输出结果是：33
```

（5）块级作用域

```
var a = 1;
function foo() {
  console.log('a',a); // undefined
    var a = 2;
}
```

当 `foo` 函数被调用时：

1. 变量 `a` 在函数 `foo` 的作用域内被声明了且变量提升了，但是还没有被赋值，所以它的值是 `undefined`。
2. 由于函数内部声明了 `var a`，即使全局作用域中存在一个值为 `1` 的变量 `a`，函数内部的 `console.log` 也不会去访问全局作用域中的 `a`，因为函数内部的 `a` 遮蔽了全局的 `a`。
3. 因此，`console.log` 输出的是 `undefined`，而不是全局变量 `a` 的值 `1`。

```
// 块级作用域
var a = 1;
function foo() {
  console.log('a',a); // undefined
  if(true){
    let a = 2;
  }
}

foo();
```

在这段代码中，`let` 关键字被用来声明变量 `a`，这创建了一个块级作用域（block scope）；所以打印的还是 undefined 但是可以定义和外部相同的变量名。

**创建块级作用域的方式：**

1，ES6 新增的 let 或 const 则会形成块级作用域。且不允许变量名重复，包括 var 和 let 都定义了一个变量 a，这是不被允许的。

2，块级作用域有 for 循环的{}循环体，if else 语句{}里面，**`switch`** 语句；`try/catch` 语句中，`catch` 块会创建一个新的块级作用域。

### 4，call、apply、bind 区别与封装

`call`、`apply` 和 `bind` 是 JavaScript 中用于改变函数的执行上下文（即 `this` 指向）的三个方法。它们都属于 `Function` 原型上的方法，因此所有的函数都继承了这些方法。

**1、call 方法**

- `call` 方法接受一个参数列表，其中第一个参数是 `this` 要指向的对象，之后的参数是传递给函数的参数。

- 语法：`func.call(thisContext, arg1, arg2, ...)`

  ```
  function func(a, b) {
    console.log(this); // 输出：{ c: 1 }
    console.log(this.c, a, b);
  }
  var obj = { c: 1 };
  func.call(obj, 2, 3); // 输出：1 2 3
  ```

  **call 源码实现：**

  ```
  // call() 函数
  Function.prototype.myCall = function (context) {

    console.log("this:", this); // 此时 this 指向的是：将来调用 myCall 方法的那个函数

    // 处理参数(即：实参)；
    var args = [...arguments].slice(1);

    context = context || window;// 如果没有传递 context，则默认 window

    context.fn = this; // 该操作是：将 将来调用 myCall 方法的那个函数，封装到 context 的一个属性中去(即：context.fn)；
    console.log('context:', context);//{ c: 1, fn: [Function: func] }

    var r = context.fn(...args); // 调用这个函数

    return r; // 返回调用结果
  };
  ```

改变 this 指向的原理是对象中函数的 this 指向，对象中的函数 this 的指向是此对象。如下运行：

```
let obj = {
  c:1,
  func:function(a,b){
   console.log("c",this.c); // 输出：1
  }
}
obj.func();
```

**2、apply 方法**

- `apply` 方法与 `call` 类似，但它接受一个参数数组，其中第一个参数也是 `this` 要指向的对象，第二个参数是一个包含所有传递给函数的参数的数组。
- 语法：`func.apply(thisContext, [argsArray])`

```
function func(a, b) {
  console.log(this.c, a, b);
}
var obj = { c: 1 };
func.apply(obj, [2, 3]); // 输出：1 2 3
```

**apply 源码实现**

```
Function.prototype.myApply = function(context, arr) {
  var fn = Symbol('fn');
  context = context || window;
  context[fn] = this;

  var result;
  if (Array.isArray(arr)) {
    result = context[fn](...arr);
  } else {
    result = context[fn]();
  }

  delete context[fn];
  return result;
};
```

**3、bind 方法**

- `bind` 方法创建一个新的函数，在调用时将 `this` 关键字设置为提供的值，预置参数列表，并且返回这个新函数。
- 语法：`const newFunc = func.bind(thisContext, arg1, arg2, ...)`

```
function func(a, b) {
  console.log(this.c, a, b);
}
var obj = { c: 1 };
var newFunc = func.bind(obj, 2, 3);
newFunc(); // 输出：1 2 3
```

**bind 源码实现：**

```
  Function.prototype.bind = function (thisArg) {
    let self = this;
    return function () {
      self.apply(thisArg, arguments);
    }
  };
```

**总结：**

都是来改变 this 指向和函数的调⽤，实际上 call 与 apply 的功能是相同的，只是两者的传参方式不一样，call ⽅法跟的是⼀个参数列表，apply 跟⼀个 数组作为参数，call ⽅法和 apply 使⽤后就直接调⽤。

bind 传参后不会立即执行，而是返回一个改变了 this 指向的函数，这个函数可以继续传参，且执行，需要类似于 bind()()两个括号才能调⽤。

arguments 是一个伪数组：使用展开运算符变为真数组

```
function test() {
  const args = [...arguments];
  console.log(args);
}
test(1, 2, 3) // [ 1, 2, 3 ]
```

使用**slice**也可以

```
function test() {
  const args = Array.prototype.slice.call(arguments);
  args.forEach((arg) => console.log(arg)); // 使用数组方法
}
test(1, 2, 3);
```

使用**Array.from**也可以：

```
function test() {
  const args = Array.from(arguments);
  args.forEach((arg) => console.log(arg)); // 使用数组方法
}
test(1, 2, 3);
```

### 5、箭头函数：

js 中我们在调⽤函数的时候经常会遇到 this 作⽤域的问题，这个时候 ES6 给我们提箭头函数。

1、 箭头函数是匿名函数不能作为构造函数，所以不能使用 new 和 super constructor 等关键字。

2、 箭头函数使用不定参数时不能绑定 arguments,取而代之可以使用...reset 来解决。

3、 this 指向不同,继承父级的 this。

5、 箭头函数没有 prototype(原型)，所以箭头函数本身没有 this。

6、 箭头函数不能当做 Generator 函数,不能使用 yield 关键字。

7、 写法不同，箭头函数把 function 省略掉了 （）=> 也可以吧 return 省略掉，写法更简洁。

8、箭头函数不能通过 call（）、apply（）、bind（）方法直接修改它的 this 指向。

### 6、reduce 函数执行顺序如下

reduce 函数允许传入两个参数，第一个称为 reducer（其实也就是 redux 里面的 reducer），是一个函数，函数里面可以有四个参数，第二个参数是累加器的初始值，不提供则将使用数组中的最后一个元素。

**函数里面四个参数的解释：**

第一个参数是回调函数上一次的计算结果；主要是第一次运算时 如果指定了初始值那么使用它，如果没有指定初始值的话就是数组的第 0 项；

第二个参数是当前值；第三个参数是当前的索引。第四个参数是你遍历的数组。

**总的来说**：就是每一次运行 reducer 会将先前元素的计算结果作为参数传入，最后将其结果汇总为单个返回值；

说白了就是会将上一次的运行结果当做下一轮计算的初始值；

| `reducer` 执行 | `previousValue` | `currentValue` | `currentIndex` | return |
| -------------- | --------------- | -------------- | -------------- | ------ |
| 第一次执行     | `10`            | `1`            | `0`            | `11`   |
| 第二次执行     | `11`            | `2`            | `1`            | `13`   |
| 第三次执行     | `13`            | `3`            | `2`            | `16`   |

#### reduce 的运用场景

**1，累加数组所有的值，累加可以，那么加减乘除 中其他三个的原理是一样的不在多说**；

```js
let arr = [1, 2, 3, 4, 5];
function reducer(preValue, currentValue, currentIndex, arr) {
  return preValue + currentValue;
}
let res = arr.reduce(reducer, 0);
console.log("%c res", "color: red", res); // 15
```

**2，累加数组对象里面的值** 要累加对象数组中包含的值，必须提供 initialValue，以便各个 item 正确通过你的函数；

```js
let arr = [{ x: 1 }, { x: 2 }, { x: 3 }];
function reducer(preValue, currentValue, currentIndex, arr) {
  return preValue + currentValue.x;
}
let res = arr.reduce(reducer, 0);
console.log("%c res", "color: red", res); // 15
```

**3，将二维数组转化为一维**

```js
let arr = [
  [0, 1],
  [2, 3],
  [4, 5]
]; //将二维数组转化为一维数组
function reducer(preValue, currentValue, currentIndex, arr) {
  return preValue.concat(currentValue); //concat数组连接方法 或者使用return [..,preValue,...currentValue]
}
let res = arr.reduce(reducer, []);
console.log("%c res", "color: red", res); //  [0, 1, 2, 3, 4, 5]
```

**4，将多维数组转化为一维数组**

```js
let arr1 = [
  [0, 1],
  [1, 2, 3],
  [4, [1, 23]]
];
// 此处要使用一个方法封装一下
const newArr = function (arr) {
  return arr.reduce((pre, cur) => pre.concat(Array.isArray(cur) ? newArr(cur) : cur), []);
};
console.log("222", newArr(arr1));
```

### 7、js 的数据类型：

**基本数据类型**

Number、[Boolean](https://so.csdn.net/so/search?q=Boolean&spm=1001.2101.3001.7020)、String、Null、Undefined。变量是直接按值存放的，存放在栈内存中的简单数据段，可以直接访问。还有 Symbol 类型，创建唯一的变量值；用法如下：

```
// 使用 Symbol() 函数创建一个新的 Symbol
let mySymbol = Symbol('mySymbol');
```

Symbol 作为属性键：

```
let obj = {};
let mySymbol = Symbol('mySymbol');

// 使用 Symbol 作为对象属性的键
obj[mySymbol] = 'This is a secret value';

console.log(obj[mySymbol]); // 输出：This is a secret value
```

**复杂数据类型:**

Function,Array,Object(typeof()这个三种类型得到的都是 object)是存放在堆内存中的对象，变量保存的是一个指针，这个指针指向另一个位置。当需要访问引用类型的值时，首先从栈中获得该对象的地址指针，然后再从堆内存中取得所需的数据。

**浅拷贝：**只拷贝值的引用，不拷贝内存；对源或副本的更改可能也会导致其他对象的更改；

**深拷贝：**既拷贝值又拷贝内存；改动副本的数据不会对原数据产生影响；

栈遵循的是后进先出；堆是先进先出；

### 8、浏览器工作原理？

浏览器的工作原理可以简单地概括为以下几个步骤：

1. **用户输入 URL**：用户在浏览器地址栏输入 URL 或点击链接，触发浏览器的导航行为。
2. **发送 HTTP 请求**：浏览器向服务器发送 HTTP 请求，请求获取网页的资源，包括 HTML、CSS、JavaScript 文件以及其他相关的资源文件。
3. **接收和解析响应**：浏览器接收到服务器返回的 HTTP 响应，根据响应的内容类型进行解析。如果是 HTML 文件，则开始构建 DOM 树，同时解析 CSS 文件构建 CSSOM 树。如果有 JavaScript 文件，则执行 JavaScript 代码。
4. **构建渲染树**：浏览器将解析得到的 DOM 树和 CSSOM 树进行合并，构建出渲染树（Render Tree）。渲染树只包含需要显示的节点和对应的样式信息。
5. **布局和绘制**：浏览器根据渲染树进行布局（Layout）和绘制（Painting）。布局阶段确定每个节点在屏幕上的位置和大小，绘制阶段将渲染树转换为屏幕上的像素。
6. **显示页面**：浏览器将绘制得到的像素信息发送给显示器，显示页面内容在用户的屏幕上。
7. **处理用户交互**：浏览器监听用户的交互事件，例如鼠标点击、滚动等，根据事件执行相应的操作。这可能包括重新构建渲染树、重新布局和绘制。
8. **定时器和异步任务**：浏览器执行定时器任务和处理异步任务，例如延迟执行的 JavaScript 代码、网络请求等。

整个过程中，浏览器会不断地与服务器进行通信，下载和加载页面所需的资源，并将这些资源解析和渲染成用户可见的页面。同时，浏览器还负责处理用户的交互操作，并执行 JavaScript 代码来实现网页的动态效果和交互功能。

### 9、Content-Type

在[HTTP 协议](https://so.csdn.net/so/search?q=HTTP协议&spm=1001.2101.3001.7020)消息头中，使用 Content-Type 来表示请求和响应中的媒体类型信息。它用来告诉服务端如何处理请求的数据，以及告诉客户端如何解析响应的数据，比如显示图片，解析并展示 html 等。

**1，'Content-Type': "application/x-www-form-urlencoded"** 此 post 请求会报错。

HTTP 会将请求参数用 key1=val1&key2=val2 的方式进行组织，并放到请求实体里面，注意如果是中文或特殊字符如"/"、","、“:" 等会自动进行 URL 转码。不支持文件，一般用于表单提交。

**2，Content-Type: application/json;charset=UTF-8**

现在绝大部分的请求都会以 json 形式进行传输，post 会将序列化后的 json 字符串直接塞进请求体中。

**3，multipart/form-data**

用于在表单中上传文件。

### **10、常见的检测数据类型的几种方式?**

`typeof ` 其中数组、对象、null 都会被判断为 Object，其他判断都正确

`instanceof `只能判断引用数据类型,不能判断基本数据类型 constructor 它有 2 个作用 一是判断数据的类型，二是对象实例通过`constructor`对象访问它的构造函数。需要注意的事情是如果创建一个对象来改变它的原型,constructor 就不能来判断数据类型了

`最好用的判断` Object.prototype.toString.call()

### **11、类数组转换为真数组?**

```
//通过call调用数组的slice方法来实现转换
Array.prototype.slice.call(arrayLike)
[].slice.call(arguments, 0)

//通过call调用数组的splice方法来实现转换
Array.prototype.splice.call(arrayLike,0)

//通过ES6 Array.from方法来实现转换
Array.from(arrayLike)

```

但是 arguments 没有 slice 方法，但是正常数组有这个方法，所以用正常数组[].slice.call(arguments,a,b)就可以执行 slice 方法并且让 slice 中的 this 指向 arguments，所以最终 slice 顺利执行，且访问的是 arguments[a-b]范围数据，并将之 push 进入新数组作为返回值。

### 12、移动端项目适配方案

### 13、正向代理和反向代理

**1，正向代理为客户端服务。**

正向代理时，由客户端发送对某一个目标服务器的请求，代理服务器在中间将请求转发给该[目标服务器](https://www.zhihu.com/search?q=目标服务器&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra={"sourceType"%3A"answer"%2C"sourceId"%3A2254739842})，目标服务器将结果返回给代理服务器，代理服务器再将结果返回给客户端。

使用场景：浏览器的跨域问题，访问被禁止的资源，隐藏客户端的地址

![img](https://pic1.zhimg.com/v2-4880f5f7d29e9669f3548ae6f00b4bdf_r.jpg?source=1940ef5c)

**2，反向代理为服务器端服务。**

客户端请求服务端时，业务繁忙的时候反向代理会把你的请求代理给其他服务器（一对多）进行处理，然后再将这些资源返回给客户端

客户端只会得知代理服务器的 IP 地址，而不知道在代理服务器后面的服务器集群的存在。

使用场景：负载均衡，提升服务器安全性，加密/SSL 加速，提供缓存服务。

![img](https://pic1.zhimg.com/v2-d70c2447834f518a04d6c34ce7574231_r.jpg?source=1940ef5c)

### 14、hasOwnProperty 方法

hasOwnProperty(pro pertyName)方法 是用来检测属性是否为对象的自有属性，如果是，返回 true，否者 false；

hasOwnProperty() 方法是 Object 的原型方法，所有 Object 的实例对象都会继承 hasOwnProperty() 方法；

hasOwnProperty() 只会检查对象的自有属性，对象原形上的属性其不会检测；

### 15、字符串 false 转布尔值 false 也可以使用 JSON.parse()

**JSON.stringify()的缺点**

1，拷贝的对象的值中如果有函数,undefined,symbol 则经过 JSON.stringify()序列化后的 JSON 字符串中这个键值对会消失（无法拷贝）

2，无法拷贝不可枚举的属性，无法拷贝对象的原型链上的属性 3，拷贝 Date 引用类型会变成字符串

### 16、谈谈你对 Promise 的理解？

答：Promise 用来解决异步回调问题，由于 js 是单线程的，很多异步操作都是依靠回调方法实现的，这种做法在逻辑比较复杂的回调嵌套中会相当复杂；也叫做回调地狱；

promise 用来将这种繁杂的做法简化，让程序更具备可读性，可维护性；promise 内部有三种状态，pending，fulfilled，rejected；pending 表示程序正在执行但未得到结果，即异步操作没有执行完毕，fulfilled 表示程序执行完毕，且执行成功，rejected 表示执行完毕但失败；这里的成功和失败都是逻辑意义上的；并非是要报错。其实，promise 和回调函数一样，都是要解决数据的传递和消息发送问题，promise 中的 then 一般对应成功后的数据处理，catch 一般对应失败后的数据处理。

**(1) race 方法**

他也是 Promise 对象中的方法 他是执行最快的那个 promise；All 方法可以触发多个 他只是触发一个 但是在多个 promise 中做出一个选择

选择就选择出一个运行最快的 promise；

**(2) All 方法**

他是 Promise 对象中的方法 他是一次执行多个 promise;

**总结：**

1. promise.all 接收的 promise 数组，总是按顺序且同步执行并返回的；只要有一个 promise 失败,最终状态就是失败的（reject）就会被 catch 捕获。
2. promise.race 也接收 promise 数组，总是返回执行最快的那一个，其他 promise 的状态并不关心。

### 17、谈一谈你对 async...await 的理解?

async...await 是基于 promise 的 generator 语法糖，它用来等待 promise 的执行结果;async 修饰的函数无论有没有 return 都会返回 I 个 promise 对象，而 await 等待的 promise 结果是 resolve 状态的内容。reject 状态的内容需要使用 try...catch 获取，await 关键字必须要出现在 async 修饰的函数中，否则报错。

### 18、严格模式

(1) 定义变量必须使用声明符 var let ；(2) 不能删除变量；(3) 八进制要使用 0o 开头

(4) 不能使用 this 返回 window；(5) Eval 函数只能识别简单的运算符

### 19、Set 和 Map 数据类型的方式

**一、Set 集合内置的方法** 类似数组结构，无序不重复

Add 方法 ： 添加一个元素；Has 方法 : 查看一个元素是否在这个 set 集合中

Size 属性 ： 类似与数组的 length 查看 set 中有几个元素

Delete 方法 ： 删除一个 set 元素；Clear 方法 ： 清空 set 集合

**迭代 Set 对象**

- keys() 、values()、 entries() 、forEach()、 for..of 循环

**二、map 中的方法**

Set 方法 ： 添加一个 map 集合属性；Size 属性 ： 查看 map 集合元素的数量

Get 方法 ： 取出一个 map 元素；Delete 方法 ： 删除一个 map 元素

Has 方法 ： 查看元素是否在 map 集合中；Clear 方法 ： 清空 map 集合

**迭代 Map 对象：**

- entries()：返回包含`[key, value]` 的迭代器; keys()：返回包含`key`的迭代器
- values()：返回包含`value`的迭代器; forEach()：传入迭代处理函数，遍历所有条目
- for..of 循环：和`entries()`函数的表现类似，循环内部对迭代器做了处理

### 20、some 和 every 函数的使用

1，some() 方法会依次执行数组的每个元素：

- 如果有一个元素满足条件，则表达式返回*true* , 剩余的元素不会再执行检测。
- 如果没有满足条件的元素，则返回 false。

2，every()方法会遍历数组的每一项，如果有有一项不满足条件，则表达式返回 false,剩余的项将不会再执行检测；

如果遍历完数组后，每一项都符合条，则返回 true。

**注意：** 这两个方法都不会对空数组进行检测，且不会改变原始数组。

### 21、事件循环 EventLoop

**描述：**

JavaScript 中的事件循环机制是指当代码执行到异步操作时，比如网络请求、定时器、事件监听等，这些异步操作会被放入事件队列中，等待主线程执行完同步代码后，再从事件队列中取出异步操作并执行。

事件循环机制由三个部分组成：

1.调用栈（Call Stack）：用于存储执行上下文的栈结构，主要用于执行同步代码。

2.消息队列（Message Queue）：用于存储异步操作的事件队列。

3.事件循环（Event Loop）：用于监听调用栈和消息队列，当调用栈为空时，从消息队列中取出一个事件并将其放入调用栈中执行。

当事件循环监听到消息队列中有事件时，会将事件推入调用栈中执行，执行完毕后再次监听消息队列，重复上述步骤，直到消息队列中没有事件为止。这就是 JavaScript 的事件循环机制。

**1，执行顺序**：同步任务---> 微任务 --->宏任务

| 微任务                         | 宏任务                  |     |
| ------------------------------ | ----------------------- | --- |
| Promise 回调函数 then , catch  | setTimeout，setInterval |     |
| Object.observe（已废弃）       | ajax 请求               |     |
| MutationObserver 监视 DOM 变动 | 事件函数                |     |

### 22，new 操作符原理

https://www.cnblogs.com/bryanfu/p/15121890.html

简单理解：

1. 创建一个新对象
2. 将构造函数的作用域赋值给新的对象（因此 this 指向了新对象）
3. 给这个新对象添加属性和方法
4. 返回新对象

### 23、Iterator

**1，概念：**

JavaScript 原有的表示“集合”的数据结构，主要是数组（`Array`）和对象（`Object`），ES6 又添加了`Map`和`Set`。用户还可以组合使用它们，定义自己的数据结构，比如数组的成员是`Map`，`Map`的成员是对象。这样就需要一种统一的接口机制，来处理所有不同的数据结构。

遍历器（Iterator）就是这样一种机制。它是一种接口，为各种不同的数据结构提供统一的访问机制。任何数据结构只要部署 Iterator 接口，就可以完成遍历操作（即依次处理该数据结构的所有成员）。

Iterator 的作用有三个：一是为各种数据结构，提供一个统一的、简便的访问接口；二是使得数据结构的成员能够按某种次序排列；三是 ES6 创造了一种新的遍历命令`for...of`循环，Iterator 接口主要供`for...of`消费。

**2，实现 Iterator 接口的原生对象有：**

ES6 规定，默认的 Iterator 接口部署在数据结构的 Symbol.iterator 属性上；或者说，一个数据结构只要有 Symbol.iterator 属性，就认为是可遍历的。

**原生具备 Iterator 接口的数据结构有：**

- Array 、Map、Set、String、TypedArray、函数的 arguments 对象、NodeList 对象

可以看到 Array 原型对象和 Set 集合已经实现了 Iterator 这个属性：

```js
// 数组
console.log("array:", Array.prototype);
// Es6新增Set集合
let set = new Set([1, 2, 3]);
console.log("set:", set);
```

那么数组的实例对象当然也会拥有这个属性，如下：

```js
let arrIter = [1, 2, 3][Symbol.iterator]();
console.log("arrIter：", arrIter);
console.log(arrIter.next());
console.log(arrIter.next());
console.log(arrIter.next());
console.log(arrIter.next());
```

**3，默认调用 Iterator 接口的场合**

有一些场合会默认调用 Iterator 接口（即`Symbol.iterator`方法），除了下文会介绍的`for...of`循环，还有几个别的场合。

**（1）解构赋值**

对数组和 Set 结构进行解构赋值时，会默认调用`Symbol.iterator`方法。

```javascript
let set = new Set().add("a").add("b").add("c");

let [x, y] = set;
// x='a'; y='b'

let [first, ...rest] = set;
// first='a'; rest=['b','c'];
```

**（2）扩展运算符**

扩展运算符（...）也会调用默认的 Iterator 接口。

```javascript
// 例一
var str = "hello";
[...str]; //  ['h','e','l','l','o']

// 例二
let arr = ["b", "c"];
["a", ...arr, "d"];
// ['a', 'b', 'c', 'd']
```

实际上，这提供了一种简便机制，可以将任何部署了 Iterator 接口的数据结构，转为数组。也就是说，只要某个数据结构部署了 Iterator 接口，就可以对它使用扩展运算符，将其转为数组。

```javascript
let arr = [...iterable];
```

**5，for... of 循环**

for... of 循环其实就是 Iterator 的语法糖；

for...of 循环可以使用的范围包括数组、Set 和 Map 结构、某些类似数组的对象（比如 arguments 对象、DOM NodeList 对象）、字符串等。也就是说有 Iterator 接口的数据类型，for ...of 都可以遍历；（不能遍历普通对象，会直接报错，obj is not iterable）

如果想要遍历普通对象可以使用 for in 循环：

```js
let obj = { name: "Eula" };
for (const iterator in obj) {
  console.log("键:", iterator); // name
  console.log("值:", obj[iterator]); // Eula
}
```

### 24，keys()、values() 和 entries()

ES6 提供三个新的方法：`entries()`，`keys()`和`values()`—用于遍历数组。它们都返回一个遍历器对象（Iterator），可以用`for...of`循环进行遍历，唯一的区别是`keys()`是对键名的遍历、`values()`是对键值的遍历，`entries()`是对键值对的遍历。

**1，keys()是对键名的遍历**

```js
let obj = {
  Amber: "安柏",
  Eula: "优菈",
  KamisatoAyaka: "神里绫华"
};
// for of不支持遍历普通对象，可通过与Object.keys()搭配使用遍历
for (let key of Object.keys(obj)) {
  console.log(key); // Amber,Eula,KamisatoAyaka  拿到的都是对象的键名
}
console.log(Object.keys(obj)); //(3) ['Amber', 'Eula', 'KamisatoAyaka']
```

**2，values()是对键值的遍历**

```js
let obj = {
  Amber: "安柏",
  Eula: "优菈",
  KamisatoAyaka: "神里绫华"
};
for (let key of Object.values(obj)) {
  console.log(key); // 安柏,优菈,神里绫华  拿到的都是对象的值
}
console.log(Object.values(obj)); //(3) ['安柏', '优菈', '神里绫华']
```

**3，entries()是对键值对的遍历**

```js
let obj = {
  Amber: "安柏",
  Eula: "优菈",
  KamisatoAyaka: "神里绫华"
};
for (let key of Object.entries(obj)) {
  console.log(key);
  // ['Amber', '安柏']
  // ['Eula', '优菈']
  // ['KamisatoAyaka', '神里绫华']
}

console.log(Object.entries(obj));
// 会以一个数组重新包装起来
// [
//   ["Amber", "安柏"],
//   ["Eula", "优菈"],
//   ["KamisatoAyaka", "神里绫华"]
// ];
```

entries 方法还有个用法就是：将`Object`转换为`Map`，`new Map()`构造函数接受一个可迭代的`entries`。借助`Object.entries`方法你可以很容易的将`Object`转换为`Map`:

```js
let obj = {
  name: "Eula",
  age: 18
};
let map = new Map(Object.entries(obj));
console.log(map); // Map(2) {'name' => 'Eula', 'age' => 18}
```

### 25、前端常见的设计模式，追问：你在实际的工作中有用过吗？

常见的设计模式包括但不限于以下几种：

1. 单例模式（Singleton Pattern）：确保一个类只有一个实例，提供全局访问，比如浏览器中的 window 对象。
2. 工厂模式（Factory Pattern）：通过构造函数封装来创建类的实例，传入不同的参数来创建不同的实例。主要是用来创建同一类型的实例。
3. 观察者模式（Observer Pattern）：定义了一种一对多的依赖关系，当一个对象的状态发生改变时，其依赖者将收到通知。

### **26、对象和 map 区别**

1，object 的键名是字符串，Map 上的键名可以是任何类型

2，object 不可以被 for of 迭代，因为它本身并没有实现迭代接口。map 可以；

3，Map 保留键的顺序，Object 不会

4， JSON 支持对象 Object 但不支持映像 Map（转出来是一个空对象）

### 27、从 URL 输入到页面展现到底发生什么？

1，浏览器会先判断请求的资源是否在缓存里面，如果缓存里面没有失效，就直接使用，否则发起新的请求。

2，发起新的请求，然后进行 DNS 地址逆解析；

3，解析完成后开始建立 TCP IP 协议 的三次握手； （三次握手可单独了解一下）

4，三次握手成功后，发送 http 请求，web 服务器开始返回一个 html 报文；

5，然后浏览器开始对 html 进行解析， 解析过程如下：

1. 解析 HTML，构建 DOM 树
2. 解析 CSS，生成 CSS 规则树
3. 合并 DOM 树和 CSS 规则，生成 render 树
4. 布局 render 树（Layout/reflow），负责各元素尺寸、位置的计算
5. 绘制 render 树（paint），绘制页面像素信息

6，绘制完成后进行 TCP 四次挥手断开链接，最后完成；

### 28、new 关键字

（1）在内存中创建一个新对象（2）这个新对象内部的[[prototype]]特性被赋值为构造函数的 prototype 属性（3）构造函数内部的 this 被赋值为这个新对象（即 this 指向新对象）（4）执行构造函数内部的代码（给新对象添加属性）（5）如果构造函数返回非空对象，则返回该对象；否则，返回刚创建的新对象

下面是实现过程：

```js
function new2(Constructor, ...args) {
  // (1)、创建一个新对象
  var obj = Object.create(null);
  // (2)、新对象的[[Prototype]]特性被赋值为 构造函数的 prototype 属性
  obj.__proto__ = Constructor.prototype;
  // (3)、构造函数内部的 this 被赋值为这个新对象
  var result = Constructor.apply(obj, args);

  // (4)、执行构造函数内部的代码

  // (5)、如果构造函数返回非空对象，则返回该对象；否则，返回刚创建的新对象
  return typeof result === "object" ? result : obj;
}
// 使用
function User(firstname, lastname) {
  this.firstname = firstname;
  this.lastname = lastname;
}
const user2 = new2(User, "johnny", "joestar");
console.log(user2);
```

### 29，http 强缓存和协商缓存

在 Web 开发中，缓存是一种非常重要的优化技术。它可以帮助我们减少服务器压力，提高页面加载速度，并降低网络流量。在这篇文章中，我们将介绍两种常用的缓存策略：强制缓存和协商缓存。

强制缓存是一种使用浏览器缓存的策略。当浏览器请求一个页面时，它会先检查本地缓存中是否有该页面的副本。如果有，则直接使用缓存中的副本，而不是向服务器发送请求。这样可以显著减少服务器压力，提高页面加载速度。

强制缓存通过在 HTTP 响应中设置 “Expires” 或 “Cache-Control” 头来实现。**Expires 头表示缓存的过期时间**，浏览器在该时间之后会再次向服务器发送请求。Cache-Control 头则提供了更多的控制选项，例如 “no-cache” 和 “public”。其中 “no-cache” 表示缓存不能被重用，而 “public” 则表示缓存可以被代理服务器和浏览器共享。

协商缓存是另一种缓存策略，它使用服务器和浏览器之间的协商来确定是否使用缓存。当浏览器请求一个页面时，它会在请求中附加 “If-Modified-Since” 和 “If-None-Match” 头。这些头中包含了浏览器上一次请求的时间和资源的 ETag 值。服务器收到请求后，会检查资源是否发生了变化。如果没有变化，则返回 304 状态码，表示资源未变化，并在响应头中设置 “Last-Modified” 和 “ETag”。浏览器收到响应后，会使用本地缓存。

如果服务器资源发生了变化，则会返回 200 状态码和最新的资源，并在响应头中设置 “Last-Modified” 和 “ETag”。浏览器收到响应后，会更新本地缓存。

协商缓存比强制缓存更加可靠，因为它总是检查服务器上的最新版本。这就能避免用户看到过时的信息。但是，由于需要服务器额外的响应，协商缓存可能会慢一些。

总的来说，缓存策略是根据应用场景和需求来选择的。对于静态资源，强制缓存可能是更好的选择，而对于动态资源，协商缓存则更为合适。

### 30、手写深拷贝

```

let arr = ['华佗','李时珍','张仲景',['白起','王翦'],'扁鹊','喜来乐'];
// 自定义函数进行深浅拷贝
function deepCopy(object){
    let result;
    if (Object.prototype.toString.call(object) == '[object Object]'){
        result = {};
    }else if (Object.prototype.toString.call(object) == '[object Array]'){
        result = [];
    }else{
        return '不符合深拷贝的数据类型';
    }
    // 遍历空对象或者是空数组  也就是要拷贝的对象
    for(let key in object){
        if (typeof object[key] == 'object'){
            result[key] = deepCopy(object[key]);
        }else{
            result[key] = object[key];
        }
    }
    return result;
}
console.log(deepCopy(arr));  //[object Array]
结果如下：
[ '华佗', '李时珍', '张仲景', [ '白起', '王翦' ], '扁鹊', '喜来乐' ]

```

### 31、实现一个 Promise.all：

```
Promise.all = function (promises) {
  return new Promise((resolve, reject) => {
    // 参数可以不是数组，但必须具有 Iterator 接口
    if (typeof promises[Symbol.iterator] !== "function") {
      reject("Type error");
    }
    if (promises.length === 0) {
      resolve([]);
    } else {
      const res = [];
      let count = 0;
      const len = promises.length;
      for (let i = 0; i < len; i++) {
        //考虑到 promises[i] 可能是 thenable 对象也可能是普通值
        Promise.resolve(promises[i])
          .then((data) => {
            res[i] = data;
            if (++count === len) {
              resolve(res);
            }
          })
          .catch((err) => {
            reject(err);
          });
      }
    }
  });
};
```

### 32、浏览器的垃圾回收机制

https://juejin.cn/post/6981588276356317214

### 33、手写防抖和节流

**防抖：**

```
function debounce(fn, delay) {
  let timer = null;
  return function() {
    const context = this;
    const args = arguments;
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(context, args);
    }, delay);
  };
}
// 使用示例
window.addEventListener('resize', debounce(function(event) {
  console.log('Resize event handler called', event);
}, 1000));
```

**节流：**

```
function throttle(fn, interval) {
  let lastTime = 0;
  return function() {
    const context = this;
    const args = arguments;
    const now = new Date();
    if (now - lastTime > interval) {
      lastTime = now;
      fn.apply(context, args);
    }
  };
}
// 使用示例
window.addEventListener('scroll', throttle(function(event) {
  console.log('Scroll event handler called', event);
}, 1000));
```

### 33、手写冒泡排序

```
function bubbleSort(arr) {
  let len = arr.length;
  for (let i = 0; i < len; i++) {
    // 最后 i 个元素已经是排好序的了，不需要再比较
    for (let j = 0; j < len - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        // 交换两个元素
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
  return arr;
}

// 使用示例
const arr = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5];
console.log(bubbleSort(arr));
```

### 34，手写 instanceof

这个手写一定要懂原型及原型链。

```javascript
javascript 代码解读复制代码function myInstanceof(target, origin) {
  if (typeof target !== "object" || target === null) return false;
  if (typeof origin !== "function")
    throw new TypeError("origin must be function");
  let proto = Object.getPrototypeOf(target); // 相当于 proto = target.__proto__;
  while (proto) {
    if (proto === origin.prototype) return true;
    proto = Object.getPrototypeOf(proto);
  }
  return false;
}
```

### 35、去重

**使用 Set**

`Set` 是 ES6 引入的一种新的数据结构，它类似于数组，但是成员的值都是唯一的。

```javascript
const arr = [1, 2, 2, 3, 4, 4, 5];
const uniqueArr = [...new Set(arr)];
console.log(uniqueArr); // 输出：[1, 2, 3, 4, 5]
```

**使用 filter 方法**

可以使用 `filter` 方法结合 `indexOf` 方法来去重。

```javascript
const arr = [1, 2, 2, 3, 4, 4, 5];
const uniqueArr = arr.filter((item, index, self) => self.indexOf(item) === index);
console.log(uniqueArr); // 输出：[1, 2, 3, 4, 5]
```

**使用 reduce 方法**

可以使用 `reduce` 方法来累加元素，如果元素不存在则添加。

```javascript
const arr = [1, 2, 2, 3, 4, 4, 5];
const uniqueArr = arr.reduce((acc, current) => {
  if (!acc.includes(current)) {
    acc.push(current);
  }
  return acc;
}, []);
console.log(uniqueArr); // 输出：[1, 2, 3, 4, 5]
```

### 36、怎么判断对象为空

`Reflect.ownKeys` 方法返回一个包含对象所有自有属性（包括不可枚举属性）的数组。如果这个数组的长度为 0，则说明对象为空。

```
function isEmpty(obj) {
  return Reflect.ownKeys(obj).length === 0;
}

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

function isEmpty(obj) {
  return JSON.stringify(obj) === '{}';
}

```

### 37、寻找字符串中出现最多的字符怎么实现？

1. 创建一个对象来存储每个字符出现的次数。
2. 遍历字符串中的每个字符，并更新对象中相应字符的计数。
3. 找到出现次数最多的字符。

```
function findMostFrequentChar(str) {
  // 创建一个对象来存储字符及其出现次数
  const charCount = {};

  // 遍历字符串中的每个字符
  for (const char of str) {
    if (charCount[char]) {
      charCount[char]++;
    } else {
      charCount[char] = 1;
    }
  }

  // 找到出现次数最多的字符
  let maxChar = '';
  let maxCount = 0;
  for (const [char, count] of Object.entries(charCount)) {
    if (count > maxCount) {
      maxCount = count;
      maxChar = char;
    }
  }

  return maxChar;
}

// 示例
const result = findMostFrequentChar("moonshot");
console.log(result); // 输出出现次数最多的字符
```

### 38、Vue 项目怎么提高项目性能？举一些例子

在 Vue 项目中提高性能，可以采取以下几种策略和方法：

1. **使用异步组件和懒加载**：这样可以减少首屏加载的组件数量，提高页面加载速度。例如，对于不影响首屏显示的组件，可以采用懒加载技术，减少初始加载时间。
2. **使用虚拟列表**：在处理大量数据的列表渲染时，可以使用虚拟列表来优化性能，只渲染可视区域内的元素。
3. **优化事件处理**：尽量避免使用 `v-for` 和 `v-on` 的组合，因为这样会导致大量的监听器被创建，影响性能。
4. **使用高性能的组件库**：如 element-ui，iview 等，它们都是高性能的组件库，可以提高组件的渲染性能。
5. **使用 `keep-alive` 缓存组件**：对于频繁切换的组件，使用 `<keep-alive>` 标签包裹组件，可以缓存组件状态，避免重复渲染，从而提升性能。
6. **合理使用异步组件**：如果某个组件相对较大或不常用，可以将其定义为异步组件，按需加载，从而提升应用的整体性能。
7. **使用 `shallowReactive` 和 `shallowRef`**：在一些情况下，可能不需要对嵌套对象进行深度响应跟踪。使用 `shallowReactive` 或 `shallowRef` 可以提升性能。
8. **节流和防抖**：在处理一些高频率触发的事件（如滚动和输入）时，可以使用节流和防抖技术来提升性能。将这些操作控制在一定的时间间隔内，可以减少不必要的调用。
9. **避免不必要的重渲染**：在某些情况下，子组件可能频繁重渲染，导致性能下降。可以通过使用 `v-once` 指令让组件只渲染一次，或使用 `defineComponent` 创建纯组件来避免这一问题。
10. **减少不必要的计算和渲染**：尽量将复杂的计算逻辑放在组件的方法中处理，避免在模板中使用复杂的表达式，并优化计算属性。
11. **使用 `v-show` 代替 `v-if`**：优化 DOM 操作，因为 `v-show` 只是切换 CSS 的 `display` 属性，而 `v-if` 会触发组件的销毁和重建。
12. **压缩代码和减少捆绑包体积**：使用构建工具如 Webpack 配合压缩插件（如 TerserPlugin）来压缩 JavaScript 文件，分析依赖，移除不必要的库或使用替代品，减少最终打包体积。
13. **资源优化**：使用压缩工具如 TinyPNG 对图片资源进行压缩，减少图片大小；使用 Base64 编码代替雪碧图，减少 HTTP 请求次数；对于小文件，如 CSS 字体、小图片等，可以考虑内联到 HTML 中，减少请求。
14. **Vue 编译优化**：使用 Vue CLI 或 Vite 等工具，启用编译优化配置。
15. **服务器端渲染（SSR）**：对于需要快速加载的应用，可以使用 SSR 减少客户端渲染时间。

这些策略和方法可以帮助提升 Vue 项目的性能，改善用户体验。

### 39、前端移动端的 rem 适配计算原理

https://www.jianshu.com/p/281fee833c92

### 40、JS 如何翻转一个字符串

**使用数组方法和`join`**

```
function reverseString(str) {
  return str.split("").reverse().join("");
}

const originalString = "hello world";
const reversedString = reverseString(originalString);
console.log(reversedString); // 'dlrow olleh'
```

### 41、 前端如何快速获取页面 url query 参数

**使用 URLSearchParams API**

```
const urlParams = new URLSearchParams(window.location.search);
```

### 42、那些情况会导致内存泄露

内存泄漏是指程序在申请内存后，未能正确释放已分配的内存，导致内存占用不断增加，最终可能耗尽系统资源。在 JavaScript 和 Web 开发中，内存泄漏是一个常见的问题。以下是一些常见导致内存泄漏的情况：

1，闭包

2，定时器和回调函数

3，未移除的事件监听器会导致内存泄漏，因为事件监听器会持有对目标对象的引用。

### 43、ES6 有那些新特性

1. **Let 和 Const 声明变量**：
   - `let`：块级作用域的变量声明，不允许重复声明。
   - `const`：块级作用域的常量声明，声明后值不可改变。
2. **模板字符串**：
   - 使用反引号（```）和`${}`语法嵌入变量和表达式。
3. **解构赋值**：
   - 允许从数组或对象中提取数据并赋值给新的变量。
4. **箭头函数**：
   - 提供了一种更简洁的函数写法，没有自己的`this`、`arguments`、`super`或`new.target`。
5. **类（Class）**：
   - 引入了基于原型的继承的更优雅的语法。
6. **模块**：
   - 原生支持模块化，使用`import`和`export`关键字。
7. **Promise 对象**：
   - 用于异步计算，提供了一种更好的异步编程解决方案。
8. **生成器（Generator）和迭代器（Iterator）**：
   - 允许函数在保持状态的情况下暂停和恢复。
9. **Set 和 Map 数据结构**：
   - `Set`：类似于数组，但成员唯一。
   - `Map`：类似于对象，但可以使用任意类型的键。
10. **Proxy 对象**：
    - 用于创建一个对象的代理，从而在访问对象的属性或方法时进行拦截和自定义操作。
11. **Symbol 类型**：
    - 一种新的原始数据类型，表示一个唯一的、不可变的数据。
12. **二进制和八进制表示法**：
    - 使用`0b`前缀表示二进制数，使用`0o`前缀表示八进制数。
13. **数组的扩展方法**：
    - 如`Array.from()`、`Array.of()`、`find()`、`findIndex()`、`fill()`、`copyWithin()`等。
14. **对象字面量的增强**：
    - 包括属性值简写、方法定义简写、可计算的属性名和属性名重复检查。
15. **解构赋值的扩展**：
    - 允许从字符串、数组和对象中提取数据。
16. **函数参数的默认值**：
    - 允许在函数定义时为参数指定默认值。
17. **Rest 参数**：
    - 允许函数接收任意数量的参数，这些参数被存储在一个数组中。
18. **展开运算符（Spread）和剩余参数**：
    - 允许一个数组的元素被展开并插入到另一个数组或函数参数中。
19. **`for...of`循环**：
    - 提供了一种简洁的遍历可迭代对象（如数组、字符串）的方法。
20. **`Math`、`Number`、`String`、`Object`、`Array`等全局对象的扩展**：
    - 增加了很多新的静态方法和属性。

### 44、匿名函数的典型应用场景

1. **事件处理**

匿名函数常用于事件处理程序中，因为事件处理通常是一次性的，不需要在其他地方重复使用。

```
document.getElementById('myButton').addEventListener('click', function(event) {
  console.log('Button clicked!');
});
```

2. **立即执行函数表达式（IIFE）**

立即执行函数表达式（Immediately Invoked Function Expression, IIFE）是一种常见的模式，用于创建一个作用域，防止变量污染全局命名空间。

```
(function() {
  const message = 'Hello, world!';
  console.log(message);
})();
```

3. **回调函数**

匿名函数常用于作为回调函数传递给其他函数，特别是在异步编程中。

```
setTimeout(function() {
  console.log('This will be printed after 2 seconds');
}, 2000);
```

4. **数组方法**

许多数组方法（如 `map`、`filter`、`reduce` 等）接受一个函数作为参数，匿名函数在这里非常方便。

```
const numbers = [1, 2, 3, 4, 5];

const squaredNumbers = numbers.map(function(number) {
  return number * number;
});

console.log(squaredNumbers); // [1, 4, 9, 16, 25]
```

5. **函数参数**

匿名函数可以用作函数的参数，特别是在需要传递特定行为时。

```
function processArray(array, callback) {
  for (let i = 0; i < array.length; i++) {
    callback(array[i]);
  }
}

const numbers = [1, 2, 3, 4, 5];

processArray(numbers, function(number) {
  console.log(number * 2);
});
```

6. **闭包**

匿名函数常用于创建闭包，以便在函数外部访问内部变量。

```
function createCounter() {
  let count = 0;
  return function() {
    count++;
    return count;
  };
}

const counter = createCounter();
console.log(counter()); // 1
console.log(counter()); // 2
console.log(counter()); // 3
```

7 **Promise 回调**

在 Promise 链中，匿名函数常用于处理异步操作的结果

```
fetch('https://api.example.com/data')
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    console.log(data);
  })
  .catch(function(error) {
    console.error('Error:', error);
  });
```

**8 箭头函数**

ES6 引入的箭头函数也是一种匿名函数，常用于简化语法。

```
const numbers = [1, 2, 3, 4, 5];

const squaredNumbers = numbers.map(number => number * number);

console.log(squaredNumbers); // [1, 4, 9, 16, 25]
```

总结

匿名函数在 JavaScript 中用途广泛，它们可以用于事件处理、立即执行、回调、数组操作、条件语句、函数参数、闭包、模块化编程、Promise 回调等多种场景。使用匿名函数可以提高代码的可读性和简洁性，同时避免不必要的变量污染。

### 45，什么是函数科里化

函数柯里化（Currying）是一种将使用多个参数的函数转换成一系列使用单个参数的函数的技术。通过柯里化，我们可以创建新的函数，这些新函数预先填充了一部分参数值，从而可以复用这些部分参数化的函数。

步骤 1：定义原始的加法函数

```
function add(a, b) {
    return a + b;
}
```

步骤 2：实现柯里化函数

```
function curry(fn) {
    return function curried(a) {
        return function(b) {
            return fn(a, b);
        };
    };
}
```

步骤 3：柯里化 `add` 函数

```
const curriedAdd = curry(add);
```

步骤 4：使用柯里化后的函数

```
console.log(curriedAdd(1)(2)); // 输出: 3
```

## 三、VUE 相关

### **1，vue 深入响应式原理 -- 需要熟背**

https://zhuanlan.zhihu.com/p/45081605

https://blog.csdn.net/LY18483/article/details/126074944

#### 一，实现 mvvm 主要包含两个方面，数据变化更新视图，视图变化更新数据；

关键点在于数据变化更新视图：因为视图变化更新数据可以使用事件监听即可，比如 input 标签监听 `input` 事件就可以实现了；

**1**，当我们把一个普通的 JavaScript 对象传入 Vue 实例作为 `data` 数据时，Vue 将使用 [`Object.defineProperty`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty) 遍历并把这些 property 全部添加 getter 和 setter 方法;且每一个组件实例都对应一个 **watcher** 实例；当我们访问 data 里面的数据时，会触发 getter 添加其依赖项，当改变数据时，会触发 setter 并通知 watcher 使它关联的组件重新渲染页面;

**2**，当然上面是关于处理对象数据的响应式，那么数组是怎么实现响应式的？

数组收集依赖是手动添加依赖(会循环递归数组的每一项)，而不是通过 Object.defineProperty 收集依赖；

```js
function dependArray(value) {
  for (var i = 0, l = value.length; i < l; i++) {
    var e = value[i];
    // 只有子项是对象的时候，收集依赖进 dep.subs
    e && e.__ob__ && e.__ob__.dep.addSub(Dep.target);
    // 如果子项还是 数组，那就继续递归遍历
    if (Array.isArray(e)) {
      dependArray(e);
    }
  }
}
```

数组依赖的触发时是使用数组原型上面的一些方法（push,pop,shift,unshift,sove,reverse,splice），从而知晓数组的变化情况；因为这些方法都会改变原数组；

**3，**添加依赖项就是添加 Watcher 通俗的理解，就是 vue 中观察者实例：会在数据变化的时候接收通知，并给出相应的行为；

#### 二，vue2 响应式存在的问题：

1，Vue 无法检测**对象属性的添加或移除**，因为 Vue 会在初始化实例时首先会对对象的每一个属性执行 getter/setter （伪属性）转化，所以 property 必须在 `data` 对象上存在才能让 Vue 将它转换为响应式的；所以：对于已经创建的实例，Vue 不允许动态添加根级别的响应式 property；

解决：`Vue.set(vm.someObject, 'b', 2) `或 `this.$set(this.someObject,'b',2) `

有时你可能需要为已有对象赋值多个新 property，比如使用 `Object.assign()` 或 `_.extend()`。但是，这样添加到对象上的新 property 不会触发更新。在这种情况下，你应该用原对象与要混合进去的对象的 property 一起创建一个新的对象。

```javascript
// 代替 `Object.assign(this.someObject, { a: 1, b: 2 })`
this.someObject = Object.assign({}, this.someObject, { a: 1, b: 2 });
```

2，对于数组的缺陷是不能够直接对**数组的某一选进行重新赋值**；和**修改数组的长度**；因为数组类型没有用 defineProperty 的 gte 方法收集依赖，触发依赖使用的也是数组的原生方法也是重写之后的原生方法。

解决：

```js
Vue.set(vm.items, indexOfItem, newValue) 或
this.$set(vm.items, indexOfItem, newValue) 或
this.items.splice(indexOfItem, 1, newValue)
```

针对 修改数组的长度 只能使用 splice 方法；

**3，为什么不对数组数据使用 Object.defineProperty 方法进行劫持数组**

尤雨溪 github 上面回复： 性能代价和获得的用户体验收益不成正比

博客原文：https://segmentfault.com/a/1190000015783546?_ea=4074035

### 2，vue3 响应式的最大特点 -- 需要熟背

Vue 3 的响应式系统本身最大的特点是不仅不依赖编译，而且跟组件上下文无关，甚至跟 Vue 框架其它部分也是解耦的。同一套系统你可以用在 Vue 组件里，组件外，其他框架里，甚至用在后端；

不依赖编译：

因为 vue3 中使用了 Proxy 作为响应式的基础，这就使得任何 JavaScript 对象都可以在运行时被转换成响应式对象，而不需要预先的编译过程。对比`Object.defineProperty` 有以下优势：

- **无需预先知道属性**：`Proxy` 可以拦截对象的所有属性，包括在创建响应式对象后动态添加的属性。
- **支持数组变化检测**：`Proxy` 可以拦截数组索引和 `length` 属性的变化，而 `Object.defineProperty` 无法做到。
- **性能提升**：在某些场景下，`Proxy` 的性能优于 `Object.defineProperty`，尤其是在处理大量属性时。

Proxy 可以直接拦截数组，set 和 map 对象等。

### 3，vue 中 key 的作用 -- 需要熟背

`key` 这个特殊的 attribute 主要作为 Vue 的虚拟 DOM 算法提示，在比较新旧节点列表时用于识别 vnode。

在没有 key 的情况下，Vue 将使用一种最小化元素移动的算法，并尽可能地就地更新/复用相同类型的元素。如果传了 key，则将根据 key 的变化顺序来重新排列元素，并且将始终移除/销毁 key 已经不存在的元素。

**注意：**

不推荐使用 index 作为 key 值,因为 index 是安装顺序递增的，因为删除节点和新增节点会导致 vue 在比较新旧节点的时候会重复创建节点。

**反驳：**

我看到网上很所说 key 的特点是复用已有的子组件，而不是销毁和重新创建它们。当我看到官网对可以的描述后，发现 key 的存在就是为了依据 key 的变化顺序来重新排列元素，且将始终移除/销毁 key 已经不存在的元素。

### 4，vue 中数据数据请求放在 created 和 mounted 的区别？

**1，放在 created**

created => API 请求 => mounted => 组件首次渲染=> 获取数据 => 组件重新渲染（update）

     也就是说，再发送 API 请求以后，就会产生 2 个分支，代码逻辑比较混乱。

**2，放在 mounted **

created => mounted => 组件首次渲染 => API 请求 => 获取到数据 => 组件重新渲染 ；

```
可以看到，没有分支，只有一个流程。
```

### 5，vue 是 mvvm 模型吗？

1，先说明一下什么是标准的 mvvm 模型；

- **M**: Model，既是数据，主要负责业务数据相关；
- **V**: View，即视图，细分下来就是 html+css 层；
- **VM**: ViewModel。是连接界面 View 和数据 Model 桥梁，负责监听 M 或者 V 的修改，是实现 MVVM 双向绑定的核心；

由上图可知：会有以下对应关系

Vue 中的 data ====== MVVM 模型中 Model

Vue 中的 template ====== MVVM 模型中 View

Vue 中的 new Vue 实例 ====== MVVM 模型中 ViewModel

**实现 mvvm 主要包含两个方面：数据变化更新视图，视图变化更新数据**

视图变化更新数据：----- 可以利用 v-model 指令，也可以用户手动输入监听@input 事件来实现，更改数据。

数据变化更新视图：----- Model 变更触发 View 更新必须通过 VewModel (Vue 实例)；当 Object.defineProperty( )数据劫持中的 set 方法时触发时会通知 render 函数异步更新模板；

以上是 MVVM 的思想。

当然，Vue 也是按照这样的设计的，但是 vue 中添加了一个属性 ref，通过 ref 可以拿到 dom 对象，通过 ref 直接去操作视图。这一点上，违背了 MVVM。放一张官网的解释：

**MVC 模型**

**M--model** 模型 数据来源；

**V---view** 视图 主要用来展示前台页面及数据给用户；

**C---controller** 控制器 主要用户流程控制 作为中间枢纽 连接 V 和 M 主要做一些流程判断等；

**mvvm 和 mvc 模型的区别**

区别:

- mvvm 通过数据驱动视图层的显示而不是节点操作
- mvc 中的 view 和 model 是可以直接访问的,造成耦合度较高
- mvvm 真正将页面和数据逻辑分离,将数据绑定放到 js 实现,解决了 mvc 中大量的 dom 操作使得页面渲染速度将降低,加载速度慢

mvc(Model-View-Controller)是单通信的,必须通过 Controller 承上启下,mvc 和 mvvm 的区别并不是 vm 完全取代了 c,只是在 mvc 的基础上增加了 vm 层,弱化了 c 的地位,vm 主要是抽离出中的业务逻辑,实现逻辑组件的重用是开发效率更高；

### 6，vueCli 介绍

vue 脚手架的作用是用来自动**一键生成 vue+webpack**的项目模版，包括依赖库，免去你手动安装各种插件；

### 1. Vue CLI 的定义

Vue CLI 是一个官方发布 vue.js 项目脚手架 使用 vue-cli 可以快速搭建 Vue 开发环境以及对应的 webpack 配置；

Vue CLI 这个构建工具大大降低了 webpack 的使用难度，支持热更新，有 webpack-dev-server 的支持，

`webpack-dev-server`在内部使用`Express`搭建搭建了一个小型`Node`服务来接收处理后的文件；那是什么程序传递文件的呢？就是`webpack-dev-middleware`。

但是 vue 中的 webpack 需要**分析依赖编译并打包启动**，加载启动所以比较慢；而 vite 不需要编译打包所以启动比较快；

安装脚手架:

```
## 安装
npm install -g @vue/cli
## 升级
npm update -g @vue/cli
```

**脚手架的作用（ 前端构建工具的作用）**

比如 vue-cli;一个构建工具他到底承担了哪些脏活累活:

1，模块化开发支持:支持直接从 node modules 里引入代码 +多种模块化支持

2，处理代码兼容性:比如 babel 语法降级，less,ts (语法转换不是构建工具做的，构建工具将这些语法对应的处理工具集成进来自动化处理)

3，提高项目性能:压缩文件，代码分割。

4，优化开发体验:

4.1，构建工具会帮你自动监听文件的变化，当文件变化以后自动帮你调用对应的集成工具进行重新打包，然后再浏览器重新运行(热更新） 4.2，开发服务器:跨域的问题，用 react-cli create-react-element vue-cli 解决跨域的问题，

5，提高了开发效率；

6，统一了项目结构和规范，脚手架可以定义项目的标准结构、命名规范、代码风格等，帮助团队成员遵循统一的开发规范，提高项目的可维护性和协作效率。

### 7、现在前端项目为什么需要 node.js -- 需要熟背

Node.js 提供了 JavaScript 运行时环境，可以在服务器端执行 JavaScript 代码；

1，node 作为后台语言，可以启动本地开发服务器来调试和查看项目。

2，构建工具的使用，Webpack、Vite、Rollup 等，这些工具需要 Node.js 环境来运行。

3，npm/yarn 包管理：Node.js 提供了 npm（或 yarn）这样的包管理器，用于管理项目依赖。

4，跨平台的特性，Node.js 允许在不同的操作系统上运行 JavaScript 代码，这使得 Vue 项目可以在 Windows、macOS 和 Linux 上开发和构建。

---

### 8、webpack 中 loader 和 plugin 的区别：

相信很多人在学习前端过程中，都接触过*webpack*。但可能在创建前端项目时，都只是用**脚手架 vue-cli**的初始化命令跑一下，将 webpack 当成一个**黑盒**使用：

#### **loader**：

webpack 原生是只能解析 js 文件，如果想将其他文件也打包的话，就会用到 loader。 所以 Loader 的作用是让 webpack 拥有了加载和解析非 JavaScript 文件的能力；比如 loader 可以打包 css，字体，图片等；

比如：

语法转换打包使用 ： babel-loader(转为 es5 语法) ， esbuild-loader（转 es6 语法），ts-loader(加载 ts)

样式打包使用：stlye/css-loader(用于识别`.css`文件, 处理`css`必须配合`style-loader`共同使用)

sass/less-loader(加载并编译 less/sass), postcss-loader(使用 PostCSS 加载并转换 CSS/SSS 文件)

文件处理：file-loader (打包图片文件);

#### **Plugin**：

直译为”插件”。Plugin 可以扩展 webpack 的功能，让 webpack 具有更强大的功能；比如 js 压缩,图片压缩，打包分析插件；

```
vconsole-webpack-plugin
```

**既然要配置那么多的 loader 和 plugins 为什么我们在使用 vue 时不用配置**

因为：构建工具（脚手架）已经帮我们处理了；

### 9、vue 中的 Scoped 属性

Vue 中的 `scoped` 属性用于将样式的作用域限制在当前组件内，防止样式全局污染。其实现原理主要包括以下几个步骤：

1. **唯一标识符的生成**：当 Vue 组件中的 `<style>` 标签使用了 `scoped` 属性时，Vue 会在编译过程中通过 PostCSS 插件（例如 postcss-selector-scope）为组件中的所有选择器添加一个唯一的标识符（如 `data-v-xxxxxx`）。这个标识符是动态生成的，保证了不同组件之间的唯一性。

2. **修改选择器**：Vue 会将组件中的所有 CSS 选择器修改为包含这个唯一标识符的属性选择器。例如，如果原来有一个 `.foo` 的选择器，Vue 会将其修改为 `.foo[data-v-xxxxxx]`，确保只有带有这个标识符的元素才会被这个选择器匹配到。

3. **DOM 元素的修改**：同时，Vue 还会在组件的根元素以及所有子元素上添加这个唯一的标识符作为自定义属性。这样，只有这些带有标识符的元素才会被对应的 CSS 选择器选中。

   通过上述步骤，Vue 实现了样式的私有化，即组件内的样式不会泄露到组件外部，也不会被外部的样式影响，从而实现了样式的作用域限制。

### 10、vue 生命周期详细讲解

1，beforecreate(创建前)，vue 实例初始化阶段，不可以访问 data,methods；this 此时是 undefined;

2，created（创建后）：vue 实例初始化完成，可以访问 data，methods，但是节点尚未挂载，不能获取 dom 节点；

3，beforeMount（挂载前）：实际上与 created 阶段类似，同样的节点尚未挂载，此时模板已经编译完成，但还没有被渲染至页面中（即为虚拟 dom 加载为真实 dom）注意的是这是在视图渲染前最后一次可以更改数据的机会，不会触发其他的钩子函数；

4，mounted（挂载完成）：这个阶段说明模板已经被渲染成真实 DOM，实例已经被完全创建好了；

5，beforeUpdate（更新前）：data 里面的数据改动会触发 vue 的响应式数据更新，也就是对比真实 dom 进行渲染的过程；

6，updated（更新完成）：data 中的数据更新完成，dom 节点替换完成；

7，beforeDestroy（销毁前）：销毁前执行（$destroy 方法被调用的时候就会执行）,一般在这里善后，清除计时器、监听等；

Vue 组件销毁时，会自动解绑它的全部指令及事件监听器，但是仅限于组件本身的事件，而对于`定时器`、 `addEventListener` 注册的监听器等，就需要在组件销毁的生命周期钩子中手动销毁或解绑，以避免内存泄露。

8，destroyed（销毁后）：销毁后 （Dom 元素存在，只是不再受 vue 控制）,卸载 watcher，事件监听，子组件。

**提示**：第一次页面加载时会触发 beforeCreate, created, beforeMount, mounted 这几个钩子；DOM 渲染在 mounted 过程中就已经完成了；

**父组件和子组件的执行顺序：**

```js
  ->父beforeCreate
  ->父created
  ->父beforeMount
  ->子beforeCreate
  ->子created
  ->子beforeMount
  ->子mounted
  ->父mounted
```

**更新过程**

```js
父beforeUpdate->子beforeUpdate->子updated->父updated
```

**销毁过程**

```js
父beforeDestroy->子beforeDestroy->子destroyed->父destroyed
```

`keep-alive`可以实现组件缓存，当组件切换时不会对当前组件进行卸载。

### 11、做过哪些 Vue 的性能优化：

参考链接来自知乎：https://zhuanlan.zhihu.com/p/423574920

**1， v-for 遍历避免同时使用 v-if**

在 Vue2 中 `v-for` 优先级更高，所以编译过程中会把列表元素全部遍历生成虚拟 DOM，再来通过 v-if 判断符合条件的才渲染，就会有多余的逻辑判断和造成性能的浪费，因为我们希望的是不符合条件的虚拟 DOM 都不要生成；

在 Vue3 中 `v-if` 的优先级更高，就意味着当判断条件是 v-for 遍历的列表中的属性的话，v-if 是拿不到的；

**2，如果需要使用 v-for 给每项元素绑定事件时使用事件代理**，需要传参的话在节点添加自定义属性； 事件代理作用主要是 2 个 1，将事件处理程序代理到父节点，减少内存占用率 2，动态生成子节点时能自动绑定事件处理程序到父节点

**3，一些数据不做响应式** `Object.freeze()` 冻结一个对象

比如会员列表、商品列表之类的，只是纯粹的数据展示，不会有任何动态改变的场景下，就不需要对数据做响应化处理，可以大大提升渲染速度

**4，一些页面采用 keep-alive 缓存组件**

比如在表单输入页面进入下一步后，再返回上一步到表单页时要保留表单输入的内容、比如在`列表页>详情页>列表页`，这样来回跳转的场景等；

**5，第三方 UI 库按需导入**

**6，列表数据的懒加载 下滑加载数据，不要同时加载太多的数据，配合防抖函数使用**

**7，变量本地化**

简单说就是把会多次引用的变量保存起来，因为每次访问 `this.xx` 的时候，由于是响应式对象，所以每次都会触发 `getter`，然后执行依赖收集的相关代码，如果使用变量次数越多，性能自然就越差；

### **12、计算属性和 watch 有什么区别?以及它们的运用场景?**

**computed** 计算属性：依赖其它属性值，并且 computed 的值有缓存，只有它依赖的属性值发生改变，下一次获取 computed 的值时才会重新计算 computed 的值。

**watch** 侦听器：更多的是观察的作用,无缓存性,类似与某些数据的监听回调,每当监听的数据变化时都会执行回调进行后续操作

**运用场景**

当需要进行数值计算,并且依赖与其它数据时,应该使用 computed,因为可以利用 computed 的缓存属性,避免每次获取值时都要重新计算。

当需要在数据变化时执行异步或开销较大的操作时,应该使用 watch,使用 watch 选项允许执行异步操作（访问一个 API),限制执行该操作的频率，并在得到最终结果前，设置中间状态。这些都是计算属性无法做到的。

**computed 的实现原理：** 待总结

vue 初次运行会对 computed 属性做初始化处理（initComputed），初始化的时候会对每一个 computed 属性用 watcher 包装起来 ，这里面会生成一个 dirty 属性值为 true；然后执行 defineComputed 函数来计算，计算之后会将 dirty 值变为 false，这里会根据 dirty 值来判断是否需要重新计算；如果属性依赖的数据发生变化，computed 的 watcher 会把 dirty 变为 true，这样就会重新计算 computed 属性的值。

### 13、前端两种路由模式的区别 hash 和 history

window.history 属性指向 History 对象，它表示当前窗口的浏览历史，更新 URL 地址不重新发请求。History 对象保存了当前窗口访问过的所有页面网址，它提供的一些方法如下：

| 方法 | 描述 |
| --- | --- |
| back() | 该方法转到浏览器会话历史的上一页，与用户单击浏览器的 Back 按钮的行为相同。等价于 `history.go(-1)`。 |
| forward() | 该方法转到浏览器会话历史的下一页，与用户单击浏览器的 forward 按钮的行为相同。 |
| go() | 该方法从会话历史记录中加载特定页面。你可以使用它在历史记录中前后移动，具体取决于你传的参数值。注意：window.history.go()和 go(0) 都会重新加载当前页面; |
| pushState() | 该方法用于在历史中添加一条记录。pushState()方法不会触发页面刷新，只是导致 History 对象发生变化，地址栏会有变化; |
| replaceState() | 该方法用来修改 History 对象的当前记录，用法与 pushState() 方法一样; |

|          | **hash**                     | **history**               |
| -------- | ---------------------------- | ------------------------- |
| url 显示 | 地址中永远带着#，不美观      | 地址干净、美观            |
| 回车刷新 | 可以加载到 hash 值对应页面   | 可能会出现 404 找不到页面 |
| 支持版本 | 支持低版本浏览器和 IE 浏览器 | HTML5 新推出的 API        |
| 上线部署 | 无                           | 需要设置一下 nginx 的配置 |

process.env.NODE_ENV 在开发时默认是 development 不管你写没写 .env.development 此文件

在本地开发时 process.env.NODE_ENV 为 development 就是开发环境;

当运行 npm run build 打包后 process.env.NODE_ENV 状态就自动改为了 production；也就是生产环境

### 14、什么是单页面应用

只有个一个 html 页面；比如我们使用 vue 写的一个网页会有很多页面，其实是通过监听路由变化，实现对单页面局部内容的显示和隐藏；并没有请求和加载一个新的 html 页面； **优点：** 1，因为数据在开始就提前加载好了，所以页面切换速度快而且流畅，用户体验好，也减少了服务器的压力 2，使前后端的职责更加清晰，前端就负责页面相关和调用后端的接口；后端则负责相关数据的处理 **缺点：** 1，首屏加载慢，易出现几秒的白屏 2，不利于 SEO-搜索引擎优化

### 15、前端跨域的本质和解决方法

开发环境： 跨域问题是浏览器端和服务端才会出现的，我直接在本地开的 node 开的服务端去请求远程服务端，（服务端和服务端是没有跨域请求的），然后远程服务端把数据返回给本地 Node 服务端，再把数据传给浏览器，跨域解决；

但是生产环境把你的包打成 dist 包了，没有 vue 的本地开发服务器了；

生产环境：后端解决：

0，jsonp 解决跨域 只能是 get 请求；

1，nginx 本质上是和 开发环境一样的，nginx 就是一台 web 开发服务器

2，配置身份标识，响应头： Access-Control-Allow-Origin 代表那些域名是我的朋友，配置完成，不再进行拦截

3，把后端服务和前端打包的代码 放到一个域下面，就不存在跨域了

4，谷歌浏览器右键属性设置：**Sec-Fetch-Mode: cors** 也可以解决跨域问题；属于一劳永逸了

**jsonp 跨域原理解析**

由于浏览器`同源策略`的限制，非同源下的请求，都会产生跨域问题，jsonp 即是为了解决这个问题出现的一种简便解决方案;

script 标签的 src 还是 img 标签的 src,可以不受同源策略的影响，本质上来说是一个 get 请求去请求静态资源。既然是个 get 请求，那么服务端一定可以接收到，并做出反馈。

当我们点击按钮的时候，创建了一个 script 标签(即会发送一个 get 请求到 src 指向的地址，也就是后端的服务地址，注意：这里必须使用 scipt 标签，否则返回的数据不会被当作 js 执行)；

```js
<button id="btn">点击</button>
  <script src="https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js"></script>
  <script>
    $('#btn').click(function(){
			var frame = document.createElement('script');
			frame.src = 'http://localhost:3000/article-list?name=leo&age=30&callback=func';
			$('body').append(frame);
		});

		function func(res){
			alert(res.message+res.name+'你已经'+res.age+'岁了');
		}
  </script>
```

注意，这里我们有是那个参数，name,age 和 callback，name 和 age 不说了，这跟我们平时普通的 get 请求参数无异。主要说下**callback**这个参数**，callback**参数就是核心所在。为什么要定义 callback 呢？首先我们知道，这个 get 请求已经被发出去了，那么我们如何接口请求回来的数据呢，callback=func 则可以帮我们做这件事。

接下来，我们看服务端应该如何实现：

```js
router.get("/article-list", (req, res) => {
  console.log(req.query, "123");
  let data = {
    message: "success!",
    name: req.query.name,
    age: req.query.age
  };
  data = JSON.stringify(data);
  res.end("func(" + data + ")");
});
```

接下来当我们点击提交的时候，就获取到了服务端反回的数据。

**总结：**

后端返回的是一个函数的调用，前端提前已经写好了这个函数，当数据返回时，前端可以直接，拿到参数里面的值。

### 16、vite 项目的一些设置

**vite 的预加载解决了三个问题**

依赖预构建：首先 vite 会找到对应的依赖，然后调用 esbuild（对 js 语法处理的一个库），将其他规范的代码转换成 esmodule 的规范，然后放到当前目录下的 node_modules/.vite/deps

注意： [esbuild](https://link.juejin.cn/?target=https%3A%2F%2Fesbuild.github.io%2F) 是一款基于 `Go` 语言开发的 `javascript` 打包工具，它的构建速度是 [webpack](https://so.csdn.net/so/search?q=webpack&spm=1001.2101.3001.7020) 的几十倍。

**他解决了三个问题：**

1，不同的第三方包会有不同的导出格式

2，对路径的处理上可以直接使用.vite/deps，方便路径重写

3，叫做网路多包传输的性能问题（也是原生 esmodeuls 规范不支持 node_modeules 的原因之一）

**2，关于环境的处理（策略模式进行处理）**

build 是生产模式，serve 是开发环境

**3，vite 环境变量配置**

开发环境，测试环境，生产环境

比如百度地图 sdk,小程序 sdk 的 APP_Key： 测试环境和生产环境是不一样的

在 vite 中的环境变量处理：vite 内置 dotenv 这个第三方库会自动读取.env 文件，并解析这个文件中的对应环境变量（以 split 方法进行转换为对象）并注入到 process 对象下；但是 vite 考虑到和其他配置的一些冲突问题，并不会直接注入到 process 对象下,比如：

- root
- envDir 用来配置当前环境变量的文件地址

vite 给我们提供了一些补偿措施：我们可以调用 vite 的 loadEnv 来手动确认 env 文件

```
第一个参数是mode,第二个参数是目录（或者写绝对路径的字符串） prefixes是文件
const env = loadEnv(mode,process.cwd(),prefixes:'.envA')

process.cwd方法：返回当前node 进行的工作目录

.env:所有环境都需要用到的环境变量
.env.development:开发环境用到的环境变量(默认情况下取名为development)
.env.production:生产环境用到的环境变量（默认情况下取名为production）
```

如果是客户端 vite 会将对应的环境变量注入到 import.meta.env 里去;但需要加 VITE\_前缀（如 VITE_APP_BASEURL）;如果不想用 VITE 开头，可以在 vite.config.js 里面 的 envPrefix 配置项配置

```
console.log(import.meta.env)
```

注意：process 是 Node 中的线程容器，每一个 Node 应用会有一个 process，开发者可以通过 process 对象控制和获取当前 Node 的进程

**4，vite 是怎么让浏览器可以识别.vue 文件的**

浏览器不会管.vue 后缀，但是如果服务端匹配到了.vue 文件，响应头就会设置 Content-type(“text/javascript”)，浏览器就会安装 js 去解析你的.vue 文件；

**6，postcsss**

1，对未来 css 属性的一些使用降级问题

2，前缀补全：--webkit

被誉为后处理器，sass 和 less 是预处理器

**使用**

1，安装

```
yarn add postcss
```

2，配置文件

postcss.config.js

```
const postcssPresetEnv = require("postcss-preset-env
modeuls.exports = {
 // 语法降级  编译插件
	plugins:[postcssPresetEnv(/*pluginOptions*/)] // 函数里面可以写插件

}
```

**7，vite 中可以直接配置 postcsss**

1，直接在 css.postcss 中配置，vite.config.js

2，直接使用上面的配置 新建 postcss.config.js

```
const postcssPresetEnv = require("postcss-preset-env
export default defineConfig {
	css:{
		modules:{},//对css模块化的默认行为进行覆盖
		// vite 的诞生一定为让postcss再火一次  不用安装postcss  但要安装预设（postcss-preset-env）
		postcss:{
			plugins:[postcssPresetEnv()]
		}
	}
}
```

**8，vite 中使用 sass**

安装 vite 中使用不需要配置 loader 直接安装即可使用

```
npm i --save-dev sass  // 开发环境时的依赖 可以简写成 -D，生产环境的依赖可简写为 —S
```

src 下新建 assets/styles/global.scss;

```css
$color: #eee;
body {
  user-select: none; //禁止选中文字
  background-color: $color;
}
img {
  -webkit-user-drag: none; //禁止拖动图片
}
```

main.tsx 中引入全局样式：

```
// 全局样式
import "./assets/styles/global.scss"
```

**9，配置路径别名**

目前 ts 对@指向 src 目录的提示是不存在的，vite 默认也是不支持的，所以要手动配置@符号的指向：

vite.config.ts 中添加配置：

```js
import path from 'path';//node环境的内置模块
 resolve:{
    alias:{
      "@":path.resolve(__dirname,'./src')
    }
  }
```

为了解决 ts 报红，需要安装：

```
npm i -D @types/node
```

**配置提示路径**

需要在 tsconfig.josn 中的 compilerOptions 属性下面添加以下配置：

```json
	"compilerOptions": {
        "baseUrl": "./",
        "paths": {
          "@/*": ["src/*"]
        },
    }
```

**8，vite 中的 React 路由配置**

使用路由版本为 V6 版本的好像可以使用 useRoutes 直接配置路由表；

### 17、Object.prototype.toString

**注意**：Number、Boolean、String、Array、Date、RegExp、Function 这几种构造函数生成的对象，通过 toString 转换后会变成相应的字符串的形式，因为这些构造函数上封装了自己的 toString 方法。但是 Object，Math 都是返回该对象的类型` '[object Object]'`。

想要精确类型判断必须要使用 call 或 apply 方法：Object.prototype.toString.call(target)； 不用 call 方法或 apply 方法则会返回`[object Object]`

```javascript
let number = 123;
let string = "123";
let obj = { name: "Eula" };
let arr = [123, 456, 789];
let obj_arr = { age: 20, arr: [100, 1001] };
let boolean = false;
// undefined 和null没有toString()方法
// 打印会报错:nnot read properties of null (reading 'toString')
let undef = undefined;
let nu = null;
console.log("number:", number.toString()); // '123'
console.log("string:", string.toString()); // '123'
console.log("obj:", obj.toString()); // '[object Object]'
console.log("arr:", arr.toString()); // '123,456,789' 相当于 arr.join(',')
console.log("obj_arr:", obj_arr.toString()); // '[object Object]'
console.log("boolean:", boolean.toString()); // 'false'
```

### 18、原型和原型链的理解

**优点**：可以继承到原型链上的所有属性 **缺点：**由于对象的属性都是继承过来的，不能随意更改，不灵活

**前言**

有一个概念需要清楚，只有构造函数才有.prototype 对象，对象是没有这个属性的，\_\_proto\_\_只是浏览器提供的非标准化的访问对象的构造函数的原型对象的一种方式;

**prototype(原型对象)**

函数即对象，每个函数都会有一个 prototype 属性，而这个属性就是原型对象，在原型对象上定义的属性或方法，会被该实例对象所继承，实例对象可以直接访问到原型对象里面的属性或方法。

原型对象相当于创造一种实例的一个模板，里面存放着这种实例的各种属性和方法；

比如：Arrary.prototype 里面存放着所有关于数组的方法；

```
 console.log(Array.prototype);  //  filter,find,map,push,pop,some,sort...
```

对象是没有 prototype 的（感觉这句话有点问题），如下：

```
  console.log("123".prototype); 		// undefined
  console.log({name:'Eula'}.prototype); // undefined
  console.log((123).prototype);			// undefined
  console.log([123].prototype);			// undefined
```

**\_\_proto\_\_（原型链连接）**

不知大家在控制台调试时有没有发现**proto**这个属性，这个属性其实是在实例被创建的时候，JS 引擎为实例自动添加的一个属性，它是绝对等于其构造函数的 prototype 属性的，也就是说，实例的**proto\_就是这个实例的原型对象，但是代码上不推荐直接访问**proto**，**proto\_\_又称为隐式原型对象。

```
	console.log("123".__proto__); 			// String类型
    console.log({ name: "Eula" }.__proto__);// Object类型
    console.log((123).__proto__);			// Number类型
    console.log([123].__proto__);			// Arrary类型
```

其实也就等同于下面的代码：顺序是一一对应的

```
	console.log(String.prototype);
    console.log(Object.prototype);
    console.log(Number.prototype);
    console.log(Array.prototype);
```

**说明** ： js 中万物皆对象，String，Object，Number，Array 等 都是 js 内置的构造函数,在 js 中，由于一切皆接对象，所以它们也可以称为内置对象，都有自己的原型对象，最顶层的原型对象是 Object；

他们的实例化对象 所使用的方法 会向各自的原型对象中逐层查找，直到找到为之；

**其实这就是原型链的概念**：

当实例要访问某一个属性时，首先在实例自身查找，如果没有找到，则继续沿着**proto**对象查找，如果找到最终**proto**对象为 null 时都没找到，就返回属性未找到的错误，如果找到了则返回该属性值。而这个由若干个**proto**对象串联起来的查找路径，就称为原型链。

**实战演示：**

```js
class Person {
  constructor(name) {
    this.name = name;
  }
  say() {
    console.log(this.name + "：这个仇，我记下了。");
  }
}
let Eula = new Person("优菈");
console.log("__proto__:", Eula.__proto__);
console.log("prototype:", Person.prototype);
console.log(Eula.__proto__ === Person.prototype);

// 向原型上面添加属性和方法
// 注意此处添加函数不能使用箭头函数 否则this将指向window
Eula.__proto__.fun = function () {
  console.log("this:", this);
  console.log("我的名字是：", this.name);
};
Person.prototype.age = 18;
console.log(Eula.__proto__.constructor === Person); //true
```

### 19、类型判断 typeof 与 instanceof 的区别

#### 1，typeof

运算符返回一个字符串，表示操作数的类型。

```js
console.log(typeof 42); // number
console.log(typeof "blubber"); // string
console.log(typeof true); // boolean
console.log(typeof undefined); // undefined

console.log(typeof [1, 2, 3]); // object
console.log(typeof { name: "Eula" }); // object
console.log(typeof null); // object
```

缺点也很明显：只能检测简单数据类型，对象、函数和 null 都统一返回 object

#### 2，instanceof

**概念：**

`instanceof`：用于检测构造函数的 `prototype` 属性是否出现在某个实例对象的原型链上；

它有两个必传参数，左侧必须为某个实例对象，右侧必须为某个构造函数。返回值为 **Boolean** 类型;

这说明 instanceof 是与原型和原型链有关系的，在弄懂 instanceof 之前我们就必须要了解什么是原型和原型链；

**prototype(原型)**

函数即对象，每个函数都有一个 prototype 属性，而这个属性就是这个函数的原型对象，在原型对象上定义的属性或方法，会被该函数的实例对象所继承，实例对象可以直接访问到原型对象里面的属性或方法。

**原型链**

当实例要访问某一个属性时，首先在实例自身查找，如果没有找到，则继续沿着\_**proto**对象查找，如果还是没找到，则继续对\_**proto**的\_**proto**对象查找，如果找到最终\_**proto**对象为 null 时都没找到，就返回属性未找到的错误，如果找到了则返回该属性值。而这个由若干个\_\_proto\_\_对象串联起来的查找路径，就称为原型链。

**instanceof 检测原理：**

instanceof 的左侧是被检测的对象，右侧是用来判断实例关系的构造函数，而实例的\_**proto**对象是绝对等于其构造函数的 prototype 属性的，如果存在隔代关系，那么就要沿着\_\_proto\_\_一层一层的去比较。

说白了，只要右测变量的 prototype 在左测变量的原型链上即可。因此，instanceof 在查找的过程中会遍历左边变量的原型链，直到找到右边变量的 prototype，如果查找失败，则会返回 false。

如下：

创建一个构造函数，判断 Eula 是否属于 Person 构造函数；

```
 	function Person() {
        this.name = name;
      }
      let Eula = new Person("优菈");
      console.log("Eula.__proto__:", Eula.__proto__);
      console.log("Person.prototype:", Person.prototype);
      console.log(Eula.__proto__ === Person.prototype); // true
      console.log(Eula instanceof Person); // true
```

可以看出 ： Eula.**proto** === Person.prototype 所以判断成立；

其他常用的判断如下：

js 中 String、Object、Number、Array、Function、Date、Boolean、RegExp、Error 等都是 js 内置的构造函数，在 js 中由于一切皆接对象，所以它们也可以称为内置对象；

```js
// 判断字符串 -- 不能使用自变量创建否则直接返回false 需要 new String()
console.log("123" instanceof String); //false
console.log(new String(123) instanceof String); //true

// 判断数字 --也不能使用自变量创建也会直接返回false 也需要 new Number()
console.log(123 instanceof Number); //false
console.log(new Number(123) instanceof Number); //true

// 判断对象
console.log({ name: "Eula" } instanceof Object); // true

// 判断数组 数组也属于Object类型所以这两个都成立   建议使用Object.prototype.toString来判断数组
console.log([1, 2, 3] instanceof Array); // true
console.log([1, 2, 3] instanceof Object); // true

// 判断日期 Date对象也属于Object 类型
console.log(new Date() instanceof Date); // true
console.log(new Date() instanceof Object); // true

// 函数的判断
function test() {}
console.log(test instanceof Function); // true

// null的判断 发现它竟然不是一个对象 使用typeof判断时它还是一个对象  建议使用typeof 来判断null类型
console.log(null instanceof Object); // false
```

**误区（需要注意）：**使用 instanceof 不能判断简单的数据类型，既使左侧和右侧是完全相等的，也依旧返回 false ，如下：

```js
console.log("123".__proto__ === String.prototype); // true  这是符合instanceof判断原理的
console.log("123" instanceof String); //依旧返回false instanceof好像不允许判断简单数据类型(比如String，Number)

console.log((123).__proto__ === Number.prototype); // true
console.log(123 instanceof Number); //false
```

### 19、Vue 中的 data 为什么是一个函数

当 data 是一个函数时，每个组件实例都有自己的作用域，都会返回一份新的 data，每个实例相互独立，就不会相互影响。这都是因为 js 本身的特性带来的，跟 vue 本身设计无关。

如果写成对象的形式，Object 是引用数据类型，`里面保存的是内存地址`，单纯的`写成对象形式`，就`使得所有组件实例共用了一份data`

**什么是组件？**

组件是可复用的 vue 实例，一个组件被创建好之后，就可能被用在各个地方。组件不管被复用了多少次，组件中的 data 数据都应该是相互隔离，互不影响的。

### 20、this.$nextTick 原理是什么？

建议看一下这篇文章：https://zhuanlan.zhihu.com/p/410608584

平时在做项目的时候，经常会用到$nextTick，简单的理解就是它就是一个 setTimeout 函数，将函数放到异步后去处理；那为什么我们不直接用 setTimeout 呢？让我们深入剖析一下。

**Vue 官网对数据操作是这么描述的:**

Vue 中有一个 watcher，用于观察数据的变化，然后更新 dom。前面我们就知道 Vue 里面不是每一次数据改变都会触发更新 dom，而是将这些操作都缓存在一个队列，在一个事件循环结束之后，刷新队列，统一执行 dom 更新操作。

```
官网描述：
Vue 在更新 DOM 时是异步执行的。只要侦听到数据变化，Vue 将开启一个队列，并缓冲在同一事件循环中发生的所有数据变更。如果同一个 watcher 被多次触发，只会被推入到队列中一次。这种在缓冲时去除重复数据对于避免不必要的计算和 DOM 操作是非常重要的。然后，在下一个的事件循环“tick”中，Vue 刷新队列并执行实际 (已去重的) 工作。Vue 在内部对异步队列尝试使用原生的 Promise.then、MutationObserver 和 setImmediate，如果执行环境不支持，则会采用 setTimeout(fn, 0) 代替。
```

流程如下：

- 把回调函数放入 callbacks 等待执行
- 将执行函数放到微任务或者宏任务中
- 事件循环到了微任务或者宏任务，执行函数依次执行 callbacks 中的回调

其实`nextTick`是一个异步任务（微任务或宏任务），他是放在 vue 更新 dom 这个异步步任务后面的，通常是放在一个事件循环的最后执行。所以 nextTick 就获取到了最新 dom 节点的数据。

### 21、vuex 的执行顺序是

this.$store.dispatch()分发 actions；actions 通过 commit 指派 mutations 里面的方法，而最终 mutations 里面方法来操作 state;

尽量把可控的操作放在 mutations 中，把不可控的状态放到 actions；mutations 只做纯函数的状态改变；

```
  this.$store.commit('user/SET_TOKEN',data.token) ;模块/方法名
```

### 22、下面是 vue 的响应式原理

---

![img](https://img-blog.csdnimg.cn/img_convert/9284ec742bfe8540469555434b98f0db.png)

vue 采用数据劫持配合订阅者和发布者模式的方式 ,

通过 Object.defineProperty 的 setter 和 getter 对数据进行劫持 ,

在数据变化时, 发布消息给依赖器 Dep(订阅者 Dep，应该就是 dependence 的简写，表示依赖关系), 去通知观察者 Watcher 做出对应的回调函数 , 进行视图更新

MVVM 作为绑定入口 , 整合 Observer , Compile 和 Watcher 三者 , Observer 来监听 model 数据变化 ,

Compile 来解析编译模板指令 , 最终利用 Watcher 搭建起 Compile , Observer , Watcher 之间的通信桥梁 ,

达到数据 变化=> 视图更新 ; 视图交互变化 => 数据 model 变更的双向绑定效果

```js
class Watcher {
  //观察者  作用  去观察新值与旧值是否有变化 ,如果有变化则更新
  constructor(vm, expr, cd) {
    //需要vm , expr 来获取旧值和新值是否有更新 , cd为回调 ,进行数据更新
    // 先将形参保存
    this.vm = vm;
    this.expr = expr;
    this.cd = cd;
    //先保存旧值
    this.oldVal = this.getOldVal();
  }
  getOldVal() {
    //获取旧值
    Dep.target = this; //new MVue()时建立watcher , 将watcher挂载到dep上
    const oldval = compileUtil.getVal(this.expr, this.vm);
    Dep.target = null; //获取到旧值后销毁 , 不然每次改变旧值添加新的观察者 , 不易维护
    return oldval;
  }
  updata() {
    //作用 ,判断新值与旧值是否有变化 , 有变化则回调回去更新视图
    const newval = compileUtil.getVal(this.expr, this.vm);
    if (newval !== this.oldval) {
      //旧值与新值不相等
      this.cd(newval);
    }
  }
}

class Dep {
  //作用 , 1.通知watcher更新 , 2.收集watcher
  constructor() {
    //收集依赖 , 不需要传参
    this.subs = []; //用于存储观察者
  }
  //收集观察者
  addSub(watcher) {
    this.subs.push(watcher);
  }
  //通知观察者去更新
  notify() {
    console.log("观察者", this.subs);
    //遍历数组 , 找到对应的观察者进行更新
    this.subs.forEach((w) => w.updata()); //观察者需要有更新视图的方法updata()
  }
}

class Observer {
  constructor(data) {
    this.observer(data);
  }
  observer(data) {
    //data为对象 , 此处只针对对象处理
    if (data && typeof data === "object") {
      //针对对象进行遍历
      Object.keys(data).forEach((key) => {
        this.defineRective(data, key, data[key]);
      });
    }
  }
  defineRective(obj, key, value) {
    //递归遍历
    this.observer(value);
    //劫持数据的时候创建收集依赖器
    const dep = new Dep();
    //劫持
    Object.defineProperty(obj, key, {
      enumerable: true, //是否可遍历
      configurable: false, //是否可更改编写
      get() {
        //获取值时走这里
        //订阅数据变化时 , 往Dep中添加观察者
        Dep.target && dep.addSub(Dep.target); //watcher从哪来?
        //Dep  =>>订阅器
        //订阅消息=>绑定监听   发布消息 =>触发事件
        return value;
      },
      set: (newVal) => {
        //设置值走这里
        this.observer(newVal);
        if (newVal != value) {
          //如果旧值不等于新值 , 则将新值赋给旧值
          value = newVal;
        }
        //更改数据后  通知观察者更新
        dep.notify();
      }
    });
  }
}
```

1.  初始化数据时 , 劫持所有属性 走 Observer 中 Object.defineProperty 的 get 方法 通知订阅者 Dep 去收集每个属性上绑定的观察者 Watcher , 通过 dep.addSub 存放 subs 中

2.更改数据时 , 触发 Observer 中 Object.defineProperty 的 set 方法 , 此时 通知订阅者 Dep , 数据有变化 , 订阅者通过 dep.notify() , 对存在 subs 数组中属性绑定的观察者 Watcher 进行遍历 并触发 Watcher.updata 进行视图更新

### 23、vue3 新特性：

​ 0，定义响应式数据可以使用 reactive 和 ref；reactive 用来定义：对象、数组、set/map 集合等类型数据，ref 通常用来定义基本类型数据 ；

1. vue2 是 options 选项式 api，vue3 是组合式 api composition 要用到 setup（pros,context）；注意是在 created 之前的； 所以是没有 this 的。

2. 响应式系统的更改，Vue 3 中的 reactive 使用了 Proxy 代理对象代替 Object.defineProperty 来实现响应式，这样可以提高应用程序的性能。

3. 是一个新增的内部组件 Teleport，它可以帮助我们在 DOM 树的任意位置渲染子组件（比如全屏的模态框）。

4. vue2 只能有一个根节点 template 、div； vue3 开始可以有多个根节点；简称 Fragments。

5. 有更好的 TypeScript 支持,vue3 是用 Ts 重写的 所以会对 ts 有更好的支持。

6. 去除了 filter 过滤器，这个操作完全可以用计算属性 和 方法来代替 。

7. 使用了 vite 搭建项目替换掉了 webpack；更快的启动和更新，提高了开发体验。

8. vue3 相对于 vue2 最大的不同是 vue 3 的响应式系统不仅不依赖编译，而且跟组件上下文无关，甚至跟 Vue 框架其它部分也是解耦的。同一套系统你可以用在 Vue 组件里，组件外，其他框架里，甚至用在后端。

9. 可以配合 pinia 使用；

10. 虽然你仍然可以通过 `setup` 函数来使用组件内的导航守卫，但 Vue Router 将更新和离开守卫作为 组合式 API 函数公开：

    并且不能在 setup 使用 **beforeRouteEnter**； 这个需要注意

```js
import { onBeforeRouteLeave, onBeforeRouteUpdate } from "vue-router";
```

页面离开时会触发 onBeforeRouteLeave；可以直接获取 this;

动态参数的路径 `/users/:id`，在 `/users/1` 和 `/users/2` 之间跳转的时候，由于会渲染同样的 `UserDetails` 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用，可以直接获取 this;

### 24、vue3 的优点：

逻辑复用能力，vue3 通过封装一些组合式函数从而以较强的扩展性和可维护性来完成功能逻辑。（响应式系统的复用）

**Vue 3 的响应式系统**本身最大的特点是不仅不依赖编译，而且跟组件上下文无关，甚至跟 Vue 框架其它部分也是解耦的。同一套系统你可以用在 Vue 组件里，组件外，其他框架里，甚至用在后端；**React hooks** 跟 [react](https://www.zhihu.com/search?q=react&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra={"sourceType"%3A"answer"%2C"sourceId"%3A2169614031}) 组件上下文强行绑定，hooks 脱离 react 组件就无法使用，更别提脱离 react 框架了。

在无编译的前提下，JS 是不可能做到靠赋值触发更新的。或者说靠赋值触发更新本身就是披着 js 外衣但做着 js 做不到的行为； **Svelte** 是组件内外两套系统并且强依赖编译，Vue 则是基于同一套不依赖编译的系统，并在可以编译的情况下提供改善体验的[语法糖]

### 25、虚拟 DOM

Virtual DOM 就是 虚拟 DOM，是用 JS 对象描述 DOM 节点的数据；并且通过对象与真实 dom 建立了一一对应的关系，那么每次 dom 的更改，我通过找到相应对象，也就找到了相应的 dom 节点，再对其进行更新，这样的话，就能节省性能，因为频繁操作 dom 是很耗费性能的行为；

以往，我们改变更新页面，只能通过首先是查找获取 dom 对象，设置里面的属性来达到目的； 但**这种方式相当消耗计算资源，** `因为每次查询 dom ，都需要遍历整颗 dom 树。`

#### 1，优点：

- `降低浏览器性能消耗` 因为**Javascript 的运算速度远大于 DOM 操作的执行速度**，因此，运用 patching 算法来计算出真正需要更新的节点，最大限度地减少 DOM 操作，从而提高性能。

- `diff算法,减少重绘和重排` 通过 diff 算法，优化遍历，对真实 dom 进行打补丁式的新增、修改、删除，实现局部更新，减少回流和重绘。

  vnode 优化性能核心思想，就是每次**更新 dom 都尽量避免刷新整个页面**，而是有针对性的 去**刷新那被更改的一部分** ，来释放掉被无效渲染占用的 gpu，cup 性能。同时，也减少了大量的 dom 操作，减少了浏览器的回流和重绘。

#### 2，缺点

- `首次显示要慢些`: 首次渲染大量 DOM 时，由于多了一层虚拟 DOM 的计算, 会比 innerHTML 插入慢
- `无法进行极致优化`：虽然虚拟 DOM + 合理的优化，足以应对绝大部分应用的性能需求，但在一些性能要求极高的应用中 无法进行针对性的极致优化。

#### 3，简述虚拟 DOM 实现原理：

虚拟 dom 相当于在 js 和真实 dom **中间**加了一个缓存，利用 dom diff 算法避免了没有必要 的 dom 操作，从而提高性能。

1. 用 JavaScript 对象结构表示 DOM 树的结构，比如说：一个元素对象，包含 TagName、props 和 Children 这些属性。然后根据这个对象构建一个真正的 DOM 节点， 插到文档当中；
2. 当数据状态变更的时候，重新构造一棵新的对象树。通过 diff 算法，比较新旧虚拟 DOM 树的差异。
3. 根据差异，对真正的 DOM 树进行增、删、改。（createElement('ul',null)）appendChild(追加子节点) insertChild(插入节点)

#### 4、Virtual DOM 真的比操作原生 DOM 快吗

采用尤大大的回答：

**这是一个性能 vs 可维护性的取舍**。框架的意义在于为你掩盖底层的 DOM 操作，让你用更声明式的方式来描述你的目的，从而让你的代码更容易维护。

**没有任何框架可以比纯手动的优化 DOM 操作更快**，因为框架的 DOM 操作层需要应对任何上层 API 可能产生的操作，它的实现必须是普适的。

在构建一个实际应用的时候，你难道为每一个地方都去做手动优化吗？出于可维护性的考虑，这显然不可能。框架给你的保证是，你在不需要手动优化的情况下，我依然可以给你提供过得去的性能。

#### 5、为什么操作 dom 性能开销大 ：

并不是查询 dom 树性能开销大，而是因为：

1. dom 树的实现模块 和 js 模块 是分开的，这些跨模块的通讯增加了成本。
2. dom 操作引起修改用户界面，会引发的浏览器的回流和重绘，这个操作对性能开销较大。

其实虚拟 dom 减少了对真实 dom 操作的次数，也就减少了浏览器对页面的重排和重绘，对应的在另一方面增加了对 js 的计算量；js 的计算是很快的；

#### 6、什么是 diff 算法

diff 算法就是进行虚拟 dom 节点对比，也就是两个比较大的 js 对象进行比较；

diff 整体策略为：这就是 diff 的核心算法。采用的是首尾指针法

**深度优先，同层比较**

```
 1. 比较只会在同层级进行，不会跨层级比较
```

    2. 比较的过程中，循环从两边向中间收拢

### 23、vue2 和 3 生命周期对比

```
Vue2---------------Vue3

beforeCreate    --> setup()
created         --> setup()
beforeMount     --> onBeforeMount
mounted         --> onMounted
beforeUpdate    --> onBeforeUpdate
updated         --> onUpdated
beforeDestroy   --> onBeforeUnmount
destroyed       --> onUnmounted
activated       --> onActivated
deactivated     --> onDeactivated
errorCaptured   --> onErrorCaptured
```

### 24、Pinia 使用

Pinia 是 Vue 的存储库，它允许您跨组件/页面共享状态。

**和 vuex 的区别**

1，Pinia 不需要额外的 Map 辅助函数；（setup 和组合式 Api 的使用 Pinia 更容易）； 2，Pinia 相比 vuex 的模块少了 Mutaions 和 Modules;只保留了(State、Getters、Actions 以及新增了 Plugins)； 3，Pinia 是平面结构（利于解构），没有嵌套，可以任意交叉组合；

#### **1，State**

定义 state 是一个箭头函数并返回一个对象；

stores/counts.js

```js
import { defineStore } from "pinia";

const useStore = defineStore("storeId", {
  // 推荐使用 完整类型推断的箭头函数
  state: () => {
    return {
      // 所有这些属性都将自动推断其类型
      counter: 0,
      name: "Eduardo",
      isAdmin: true
    };
  }
});
```

组件中访问 state：您可以通过 `store` 实例访问状态来直接读取和写入状态：

```vue
<script setup>
/* 1，引入对应的store模块 */
import { useStore } from "@/stores/counter";
const store = useStore();
console.log("store:", store.name);
</script>
```

**重置状态** 如果想要---------------数据的时候，pinia 提供了一个方法：`reset()`

```js
const store = useStore();
store.$reset(); // 重置成功
```

**同时修改多个属性**推荐使用 `$patch`

```js
/* 6，同时修改多个对象 */
const patch = () => {
  store.$patch({
    counter: store.counter + 1,
    name: "Abalam"
  });
  console.log("6，同时修改多个对象:", store);
};
```

`$patch` 方法也接受一个函数来批量修改集合内部分对象的情况：推荐这种写法。

```js
const patch = () => {
  store.$patch((state) => {
    state.items.push({ name: "shoes", quantity: 1 });
    state.hasChanged = true;
  });
  console.log("6，同时修改多个对象:", store);
};
```

**替换`state`** 使用 `$state`

您可以通过将其 `$state` 属性设置为新对象来替换 Store 的整个状态:

```js
store.$state = { counter: 666, name: "Paimon" };
```

**订阅状态**使用` $subscribe()`

可以通过 store 的 `$subscribe()` 方法监听状态及其变化；

```js
store.$subscribe(
  () => {
    console.log("我改变了");
    // 每当它发生变化时，将整个状态持久化到本地存储
    localStorage.setItem("piniaState", JSON.stringify(state));
  },
  { detached: true }
);
```

默认情况下，_state subscriptions_ 绑定到添加它们的组件（如果 store 位于组件的 `setup()` 中）。 意思是，当组件被卸载时，它们将被自动删除。 如果要在卸载组件后保留它们，请将 `{ detached: true }` 作为第二个参数传递给 _detach_ 当前组件的 _state subscription_;

#### 2，Getters

Getter 完全等同于 Store 状态的 [计算值](https://v3.vuejs.org/guide/reactivity-computed-watchers.html#computed-values)。 它们可以用 `defineStore()` 中的 `getters` 属性定义。 他们接收“状态”作为第一个参数**以鼓励**箭头函数的使用：

```js
export const useStore = defineStore("main", {
  state: () => ({
    counter: 0
  }),
  getters: {
    doubleCount: (state) => state.counter * 2
  }
});
```

大多数时候，getter 只会依赖状态，但是，他们可能需要使用其他 getter。 正因为如此，我们可以在定义常规函数时通过 `this` 访问到 `整个 store 的实例`;

```js
export const useStore = defineStore("main", {
  state: () => ({
    counter: 0
  }),
  getters: {
    // 自动将返回类型推断为数字
    doubleCount(state) {
      return state.counter * 2;
    },
    // 返回类型必须明确设置
    doublePlusOne(): number {
      return this.counter * 2 + 1;
    }
  }
});
```

然后你可以直接在 store 实例上访问 getter：

```vue
<template>
  <p>Double count is {{ store.doubleCount }}</p>
</template>
<script>
export default {
  setup() {
    const store = useStore();
    return { store };
  }
};
</script>
```

**将参数传递给 getter**

注意：您可以从 _getter_ 返回一个函数以接受任何参数：

```js
  <p class="store">传参的计算属性：{{ store.receiveParams("我的") }}</p>

	/* 3,需要将参数传递给getter 因为getter是计算属性 只能返回一个函数以接收任何参数*/
    receiveParams: (state) => {
      // params 是你调用的时候传进来的值
      return (params) => {
        console.log("params:", params);//我的
        return String(params) + state.name; // 我的优菈
      };
    },

```

**使用其他模块的 getter**

```js
import { defineStore } from "pinia";
// 可以引入其他模块
import { rootSore } from "@/stores/rootState";
  getters: {
    /* 4,可以访问其他store模块的 state 上面先引用 再使用*/
    useOtherStateOfModules: (state) => {
      // 实例化其他模块
      const otherStore = rootSore();
        //使用
      return state.name + "-" + otherStore.age;
    },
  },
```

#### 3，Actions

Actions 相当于组件中的 [methods](https://v3.vuejs.org/guide/data-methods.html#methods)。 它们可以使用 `defineStore()` 中的 `actions` 属性定义，并且它们非常适合定义业务逻辑;

actions 可以是异步的；

```js

/*  注意：这里只能用常规函数 可以通过this进行访问store实例  */
actions: {
    /* 自减函数 */
    induce() {
      this.counter--;
    },
    /* 随机数*/
    randomizeCounter() {
      this.counter = Math.round(100 * Math.random());
    },
  },
```

### 25、liunx 基本命令

| 命令 | 描述 | 其他 |
| --- | --- | --- |
| **cd** | cd / 切换到根目录 ;cd /usr 切换到根目录下的 usr 目录<br/> cd ../ 切换到上一级目录 |  |
| **ls** | 查看当前目录下的所有目录和文件；<br/>ls /dir 查看指定目录下的所有目录和文件 如：ls /usr | -a 可以查看隐藏的文件 |
| ll | l 列表查看当前目录下的所有目录和文件（列表查看，显示更多信息 |  |
| **mkdir** | 创建新的目录 | -m ：配置文件的权限 |
| **rm** | rm 文件 :删除当前目录下的文件<br/>rm -f 文件 :删除当前目录的的文件（不询问）<br/>rm -r aaa 递归删除当前目录下的 aaa 目录<br/>rm -rf :将当前目录下的所有目录和文件全部删除<br/>_rm -rf /_ :【自杀命令！】将根目录下的所有文件全部删除 |  |
| **rmdir** | 删除空的目录也就是空的文件夹 等同于 rm -r 文件夹名 |  |
| **mv** | mv source_file(文件) dest_file(文件)：将源文件名 source_file 改为目标文件名 dest_file<br/>mv source_file(文件) dest_directory(目录)：将文件 source_file 移动到目标目录 dest_directory 中<br/> | -f ：force 强制,不会询问；<br/>-i ：会询问 |
| **cp** | cp -r 目录名称 目录拷贝的目标位置<br/>示例：将/usr/tmp 目录下的 aaa 目录复制到 /usr 目录下面 cp /usr/tmp/aaa /usr<br/>注意：cp 命令不仅可以拷贝目录还可以拷贝文件，压缩包等，拷贝文件和压缩包时不 用写-r 递归 |  |
| **pwd** | 显示目前所在的目录 |  |
| **touch** | 文件不存在，系统会建立一个新的文件 |  |

### **26、nvm（nodejs 版本管理工具）**

启动 vue3 项目如果出现下面这两行报错时，说明你的 node 版本过低，低于 15.0；需要在安装一个高版本的 nodejs，使用 nvm，如下：

```
error when starting dev server:
Error: Cannot find module 'node:url'
```

nvm 全名 node.js version management，顾名思义是一个 nodejs 的版本管理工具。通过它可以安装和切换不同版本的 nodejs。

下载[nvm-setup.zip](https://github.com/coreybutler/nvm-windows/releases/download/1.1.9/nvm-setup.zip) 压缩包—>解压—>安装 exe 安装包 —>使用"windows+R"然后输入"cmd"回车打开命令窗口，npm -v 查看版本（查看 nvm 是否安装成功）

安装包下载地址

```
https://github.com/coreybutler/nvm-windows/releases/download/1.1.9/nvm-setup.zip
```

**查看目前使用的版本**

```
nvm ls
```

**查看 node 的目前的所有版本**

```
nvm list available
```

**下载需要的 node 版本**

```
nvm install 16.16.0
```

**切换版本**

```
 nvm use 16.16.0
```

**nvm 常用命令**

```js
nvm install latest：安装最新稳定版node.js
nvm install [version]：安装指定版本node.js
nvm use [version]：使用某个版本node.js
nvm list：列出当前安装的node.js版本列表
nvm uninstall [version]：卸载指定版本的node.js
nvm node_mirror [url]：配置nvm的镜像
nvm npm_mirror [url]：配置npm的镜像
nvm arch：显示node是运行在32位还是64位。
nvm on：开启node.js版本管理
nvm off：关闭node.js版本管理
```

### 27、vue 与 React 的区别

1，共同点：数据驱动 ；组件化；都使用 Virtual DOM;

2，不同点：

- vue 定位是渐进式框架，比较简单容易上手，还提供了许多指令以及双向绑定，更加注重结果；

react 没有提供这些便利的指令，推崇函数式编程，需要双向绑定的时候需要自己写事件触发；更加注重过程；

- vue 组件的写法使用基本的 html 节点+js+css; react 使用 jsx 的语法来写页面；
- vue 的 template 语法需要自己的编译器再次编译，不得不提供这些语法；但 react 采用的 jsx 语法直接使用 babel 进行编译的；

### 28、前端中的重绘和重排

**重绘**：当一个元素的外观发生改变，但没有改变布局, 浏览器重新把元素外观绘制出来的过程，叫做重绘。

比如：对文本的一些个性化操作字体颜色，字体大小；对背景，透明度，对边框圆角，阴影的一些操作等。

**重排** 当渲染树的一部分必须更新并且节点的尺寸发生了变化 ，需要重新构建 dom 树。

改变元素几何信息（大小和位置），都会引起，如：

        1，添加或删除可见的DOM元素
        2，元素位置改变，或者使用动画
        3，元素的尺寸改变（外边距、内边距、边框厚度、宽高等几何属性）
        4，内容改变（例如：文本改变或图片被另一个不同尺寸的图片替代、在input框输入内容）
        5，浏览器窗口尺寸改变（resize事件发生时）

`重排必定会引发重绘，但重绘不一定会引发重排`。

### 29、vue3 插槽的使用

**1，插槽使用的场景**

我们知道子组件能够接收父组件任意类型的 js 变量为 props 进行使用，那如果父组件想要传递给子组件 html 标签、模板片段、甚至是一个组件，那么子组件改怎么接收呢？

所以插槽的出现就可以解决上面的问题；插槽可以细化分为：默认内容、具名插槽、作用域插槽；

**2，默认内容**

在外部没有提供任何内容的情况下，可以为插槽指定默认内容。比如有这样一个 `SlotButton`组件；

子组件 SlotButton.vue

```
<script setup>
import { reactive, ref, createApp } from "vue";
</script>

<template>
  <button class="btn primary">
    <!-- 插槽出口 -->
    <slot>默认内容</slot>
  </button>  <br>
</template>
```

父组件中使用插槽：

```
 <!-- 只传文本 -->
 <SlotButton> 我是插槽按钮 </SlotButton><br />
```

**6，includes**

includes 可以判断一个数组中是否包含某一个元素，并返回 true 或者 false；

```
      const inc = ["a", "b", "c"].includes("a");
      console.log("inc:", inc); // true
```

该方法的第二个参数表示搜索的起始位置，默认为`0`。如果第二个参数为负数，则表示倒数的位置，如果这时它大于数组长度（比如第二个参数为`-4`，但数组长度为`3`），则会重置为从`0`开始。

```javascript
[1, 2, 3].includes(3, 3); // false
[1, 2, 3].includes(3, -1); // true
```

没有该方法之前，我们通常使用数组的`indexOf`方法，检查是否包含某个值。

```javascript
if (arr.indexOf(el) !== -1) {
  // ...
}
```

`indexOf`方法有两个缺点，一是不够语义化，它的含义是找到参数值的第一个出现位置，所以要去比较是否不等于`-1`，表达起来不够直观。二是，它内部使用严格相等运算符（`===`）进行判断，这会导致对`NaN`的误判。

```javascript
[NaN].indexOf(NaN);
// -1
```

`includes`使用的是不一样的判断算法，就没有这个问题。

```javascript
[NaN].includes(NaN);
// true
```

**7，flat()和 flatMap()**

数组扁平化方法 `Array.prototype.flat()` 也叫数组拉平、数组降维。

- 不传参数时，默认“拉平”一层，可以传入一个整数，表示想要“拉平”的层数。
- 传入 <=0 的整数将返回原数组，不“拉平”。
- Infinity 关键字作为参数时，无论多少层嵌套，都会转为一维数组。
- 如果原数组有空位，Array.prototype.flat() 会跳过空位。

看下面案例：

```
      const arr = [1, ["a", "b"], [2, ["c"], 3]];

      // 1,不传参数时，默认“拉平”一层
      console.log(arr.flat());
      // [1, 'a', 'b', 2, ['c'], 3]

      // 2,传入一个整数参数，整数即“拉平”的层数
      console.log(arr.flat(2));
      //  [1, 'a', 'b', 2, 'c', 3]

      // 3,Infinity 关键字作为参数时，无论多少层嵌套，都会转为一维数组
      console.log(arr.flat(Infinity));
      // [1, 'a', 'b', 2, 'c', 3]

      // 4,传入 <=0 的整数将返回原数组，不“拉平”
      console.log(arr.flat(0));
      console.log(arr.flat(-6));
      // [1, ['a', 'b'], [2, ['c'], 3]]

      // 如果原数组有空位，flat()方法会跳过空位
      console.log([1, 2, 3, 4, 5, 6, ,].flat());
      //  [1, 2, 3, 4, 5, 6]
```

**flatMap：**

`flatMap()`方法对原数组的每个成员执行一个函数（相当于执行`Array.prototype.map()`），然后对返回值组成的数组执行`flat()`方法。该方法返回一个新数组，不改变原数组。

```js
let newFlatList = [
  [2, 4],
  [3, 6],
  [4, 8]
].flatMap((item, index, arr) => {
  console.log("item:", item); //  [2, 4]   [3, 6]  [4, 8]
  return [item[0] * 2, item[1] * 3]; // 第一项*2，第二项*3，每个item都执行这个操作，最后flat扁平化数组并返回
});
console.log("newFlatList:", newFlatList);
// [4, 12, 6, 18, 8, 24]
```

`flatMap()`方法的参数是一个遍历函数，该函数可以接受三个参数，分别是当前数组成员、当前数组成员的位置（从零开始）、原数组。

注意：`flatMap()`只能展开一层数组。

### 31、vue3 - 使用 reactive 定义响应式数据进行列表赋值时，视图没有更新的解决方案

Vue 3.0 中我们使用 reactive() 定义的响应式数据的时候，当是一个数组或对象时，我们直接进行赋值，发现数据已经修改成功，但是页⾯并没有自动渲染成最新的数据；这是为什么呢？

原因就是 reactive 函数会返回一个 Proxy 包装的对象，所以当我们这样直接赋值时：（看下面例子）

```js
import { reactive } from "vue";

let userInfo = reactive([{ name: "Eula" }]);
console.log(userInfo); // Proxy(Array) 打印出来是一个Proxy对象 当然具备响应式

// 直接后端数据进行赋值
userInfo = [{ name: "优菈" }];
console.log(userInfo); // [{name:'优菈'}] 可以看出 就是打印出了一个普通的数组 所以不具备响应式
```

这样赋值的话，就会把 Proxy 对象给覆盖掉，从而无法触发对应的 set 和 get，最终就会导致丢失掉响应性了；

上面的代码 `reactive([{name:'Eula'}]) `创建了一个响应式数组，返回一个 Proxy 包装的对象由`userInfo`变量进行存放，但是后面我又把一个普通的数组（也就是后端返回的数据）赋值给`userInfo`，注意这时`userInfo`这个变量存放的已经是一个普通的数组了，当然也就不具备响应式了；

所以：对于`reactive`创建的响应式数据应该避免直接使用`=`号进行赋值；会覆盖响应式;

**解决方案：**

**第一种方式：再封装一层数据，即定义属性名，在后期赋值的时候，对此属性进行直接赋值**

**第二种方式：使用数组的 splice 来直接更改原数组**

**第三种方式：使用 ref 来定义数据**

## 四、Node.js 相关

常用内置模块：http,fs(文件处理),path，模块化

第三方模块：express（）

### express 框架返回前端数据

```js
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser"); //处理post请求的
const app = express();
// app.use是用来给path注册中间函数的 就是把特定的中间件加载到特定的请求路径下面
app.use(bodyParser.json()); //对post请求的请求体进行解析

// express内置中间函数 进行托管静态文件
app.use("/static", express.static(path.join(__dirname, "public")));
// app.use('/static',express.static('public'))

const port = 3000; // 端口 3000

// 在浏览器上面访问：
app.get("/", (req, res) => {
  res.send("hello world 123");
});

// 登陆接口
app.post("/dev-api/vue-admin-template/user/login", (req, res) => {
  const { username, password } = req.body; // 解构请求的参数
  if (username && password) {
    res.json({
      code: 20000,
      data: "admin-token"
    });
    return;
  }
});
// 用户信息接口
app.post("/dev-api/vue-admin-template/user/info", (req, res) => {
  const { token } = req.body; // 解构请求的参数
  if (token) {
    res.json({
      code: 20000,
      data: {
        roles: ["admin"],
        introduction: "I am a super administrator",
        avatar: "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif",
        name: "Super Admin"
      }
    });
  }
});

app.listen(port, "127.0.0.1", () => {
  console.log("开始启动服务了");
});
```

### 32，vite 为啥那么快

**先说 webpack 慢的原因:**

当我们在开发项目时，通常会遇到少量的代码改动，只要一改动，webpack 就会将项目中所有代码进行重新进行编译打包，然后再通过热更新（Hot Module Replacement, HMR）的方式推送到浏览器页面中，这样做的问题是包速度比较慢，对于稍大的前端项目，项目里可以依赖着上千个第三方库，随着项目增大，webpack 打包速度会越来越慢，造成热更新越来越慢，可能你改一点代码，需要等十几秒钟。

**vite 是怎么做的：**

使用 Vite 构建前端项目时，Vite 会在一开始将项目中的代码分为**依赖和源码**两大类：

1，对于依赖的处理，我们通常称为依赖预构建，Vite 使用 esbuild 来实现依赖预构建，将 ,导入导出全部转为 ES6Module 形式，将构建好的依赖存到 node_modules/.vite /deps/目录中，如果依赖变化（package.json 等文件中依赖变化了）则会重新构建。

2，对于源码，通常就是我们开发项目时自己写的 JS 代码，这些代码时常被修改，但并不是每次修改都需要重新加载所有源码的，Vite 利用浏览器 ES Modules（ESM），当浏览器发起相应模块的请求时，Vite 内置的基于 Koa 构建的 web 服务器会拦截 ES Module 请求，并通过 path 找到想要目录的文件，通过简单的处理再返回给浏览器。

实现开发服务器一直启动，并实时按需引入修改的文件，所以说在浏览器测 vite 是比较快的；

**为什么生产环境使用 rollup 打包：**

esbuild 目前还比较新，虽然重要的功能都有了，但还是有部分功能缺失，如对 CSS 处理还不太好，所以 Vite 目前只是要 esbuild 实现开发期间的构建操作，项目开发完要正式构建时使用的是 rollup，rollup 非常成熟，虽然慢一点，但正式构建在开发过程中不会太频繁。

### 33、性能优化

https://juejin.cn/post/7188894691356573754?searchId=20231018172234482092A6CD01B8B5A508#heading-18

**框架相关：**

1，路由懒加载 和组件懒加载 2，第三方依赖按需引入 3，组件化 分割代码，降低耦合性 4， 父子组件嵌套最好不要超过三层 5，减少 dom 的改动和减少 http 请求并发次数 6，Tree shaking （消除无用的 JS 代码，减少代码体积） 7，vue 中可以冻结对象 ，事件代理

**js 相关：**

浏览器在解析 HTML 的时候，如果遇到一个没有任何属性的 script 标签，就会暂停解析，先发送网络请求获取该 JS 脚本的代码内容，然后让 JS 引擎执行该代码，当代码执行完毕后恢复解析； 1，使用 async 模式或 defer 模式 ：async 是异步加载，加载完即执行， 2，defer 也是异步加载，加载完成后先不执行里面的代码，是最后 html 渲染完才执行；多个 defer 属性会按照书写的顺序进行加载

link 标签也能动态的加载 js

3，prefetch 是利用浏览器的空闲时间，加载页面将来可能用到的资源的一种机制；通常可以用于加载其他页面（非首页）所需要的资源，以便加快后续页面的打开速度 4, preload，实现关键资源的提前加载，preload 加载的资源是在浏览器渲染机制之前进行处理的;

**http 请求相关：**

1，使用强缓存和协商缓存 2，

**图片相关：**

1，对于大图片：可进行图片压缩，webp 格式，或者图片切片；

2，对于列表中的一些稍微大的图片可使用懒加载；

3，对于设计图中较小的图片（小于 100k）可以使用 webpack 打包的 url-loader 配置把图片转为 base64 格式；

4，对于页面上的小图标可以使用字体图标（阿里矢量图）和 svg 格式；

5，对于特别多的图片集合，上百兆和过 G 的图片可以使用 nginx 静态代理的方式访问，减少了请求的压力。

### 34， 项目中遇到的困难

项目中的困哪的话也有很多，比如 ie 低版本浏览器跨域的问题，解决方法使用 jsonp 请求，但需要注意的使用 jsonp 会导致 async:false 属性失效；

另外一个问题是 vue 中处理静态资源的操作，之前做太保的项目测试平台是 cicd 平台，但他有一个限制是最多上传一个 G 的打包文件，否则无法提交到测试流水线里面，然后我们就把 public 下面的静态模版图片这个文件夹统一放到了服务器中，然后使用 nginx 代理这个路径，代理静态资源，达到动静分离的一个效果；

还比如说获取视频截帧的时候 ios 获取的是白屏 ，那么就需要对 ios 机型进行特殊处理，比如禁音播放视频的前几帧然后暂停该视频达到一个封面的效果；

还有就是一个 ios 和安卓的兼容性问题，比如在 ios 的微信浏览器会出现滚动回弹橡皮筋的效果，就是滚动到头还可以拉动，松手会回弹的这么一个效果，体验可能不太好，解决方式是禁掉滚动条也就是组织 touchstaert 的默认行为，这样页面就不会滚动了，然后使用 scrollLeft 和 scrollTop 动态的设置手指滑动的距离进行列表的滚动效果。

还有的话比如小米浏览器的软键盘不能顶起下方的输入框；

### 35，ajax 请求的基本流程

要完整实现一个 AJAX 异步调用通常需要以下几个步骤:

```
1. 创建 XMLHttpRequest 请求对象, 即创建一个异步调用对象。（ new XMLHttpRequest() ）
2. 设置请求地址，指定请求方式（open）
3. 设置发送信息至服务器时的内容编码类型
4. 发送HTTP请求（send）
5. 监听服务器的响应（ readystatechange事件 ）
```

```js
let httpRequest;
// ajax 请求的步骤
if (window.XMLHttpRequest) {
  httpRequest = new XMLHttpRequest();
} else {
  httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
}

// 2,设置请求地址，指定请求方式（open）true (默认值)，即开启异步
httpRequest.open("GET", "http://sss", true);

// 3,设置响应http请求状态变化的函数
httpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

// 4, send发送http请求
httpRequest.send("name=value&anothername=" + encodeURIComponent(myVar) + "&so=on");

// 5,监听请求状态的变化
httpRequest.onreadystatechange = function () {
  //readyState 是请求对象中的一个属性 4表示成功 status 是 http 状态码
  if (httpRequest.readyState == 4 && /^2\d{2}$/.test(httpRequest.status)) {
    console.log(httpRequest.status); //状态码
    console.log(httpRequest.statusText); //状态字符串
    console.log(httpRequest.getAllResponseHeaders()); //所有响应头
    console.log(httpRequest.response); //响应体
  }
};
```

### 36、如何优化首屏加载，减少白屏时间

1，从框架层次来看 使用路由懒加载，组件懒加载；组件抽离封装，第三方库按需引入；还有一个是分段或者延迟进行渲染页面，

如果是 vue 框架的话， 不需要编辑的列表数据进行一个对象冻结，不让响应式系统进行依赖的收集；

2，从 js 来看的话 如果引入的有第三方的 js 比如腾旭地图的位置附加库，几何运算库，这些的话再 script 标签上添加 defer 属性，进行一个异步的加载。

3，从 http 方面说的话 ： 减少 HTTP 请求数量和 请求大小，还可以适当的使用强缓存和协商缓存，让浏览器把数据缓存到本地，就会直接返回给用户。

4，对于静态资源的话：比如图片能压缩的先压缩，或者是图片预加载，真的有很大的图片的话可以图片切片然后前端通过画布进行一个合并也是可以的；

小于 100kb 的图片的话可以使用 webpack 的 url-loader 把图片转为 base64 格式；如果还有更小的图片的话使用 css3 的 fontFace 也就是字体图标（阿里矢量图网站）

### 37，vue 异步更新原理

在 Vue 中，异步更新是通过事件循环机制实现的。当 Vue 组件的响应式状态发生变化时，Vue 会将更新操作推入一个队列中，而不是立即执行更新。然后，在下一个事件循环周期中，Vue 会遍历队列并执行更新操作。

这种异步更新的机制有以下几个好处：

1. 提高性能：将多个状态变化合并为一个更新操作，避免了频繁的 DOM 操作，从而提高了性能。
2. 避免重复更新：如果在同一个事件循环周期内多次修改了同一个状态，Vue 只会执行一次更新操作，避免了重复更新。
3. 避免阻塞 UI 线程：由于更新操作是在下一个事件循环周期中执行的，所以不会阻塞 UI 线程，保持了页面的流畅性。

**也就是说利用了 js 特性；**

数据的异步更新使用了 nextTick 方法(优雅降级)，

```js
// src/observer/scheduler.js

import { nextTick } from "../util/next-tick";
// 定义一个全局的更新队列数组
const queue = [];
// 定义一个标志位，用于表示是否正在执行更新操作
let isUpdating = false;
// 定义一个函数，用于执行更新操作
function flushSchedulerQueue() {
  // 标记为正在执行更新操作
  isUpdating = true;

  // 遍历更新队列中的Watcher对象，并依次执行其更新操作
  for (let i = 0; i < queue.length; i++) {
    const watcher = queue[i];
    watcher.run();
  }

  // 清空更新队列
  queue.length = 0;

  // 标记更新操作已完成
  isUpdating = false;
}

// 定义一个函数，用于将Watcher对象推入更新队列中
function queueWatcher(watcher) {
  // 如果Watcher对象尚未在更新队列中，则将其推入队列中
  if (!queue.includes(watcher)) {
    queue.push(watcher);
  }

  // 如果更新队列为空且当前不处于更新操作中，则执行更新操作
  if (queue.length === 1 && !isUpdating) {
    nextTick();
  }
}
```

### 38，mysql 基本语法 js 算法平方相关（pow）

1，创建数据库

```
CREATE DATABASE DatabaseName;
```

2，删除数据库

```
DROP DATABASE DatabaseName;
```

3，选择数据库

```
USE DatabaseName;
```

1，插入数据

**INSERT INTO**

```
INSERT INTO table_name (column1, column2, column3,...columnN)
VALUES (value1, value2, value3,...valueN);
```

2，查询数据

```
SELECT column1, column2, columnN FROM table_name WHERE conditions;
```

**like**关键字进行模糊匹配：

```
SELECT FROM table_name WHERE column LIKE 'pattern'
```

**distinct**用来去除结果集中所有重复的记录，仅保留唯一的一条记录。

```
SELECT DISTINCT column1, column2,.....columnN FROM table_name WHERE [condition]
```

**order by** 排序 默认升序进行排序的；

ASC：升序，DESC：降序。不写默认升序。

**group by** 对结果集（选取的数据）进行分组
