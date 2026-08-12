# 前端常见面试题总结（2024-2026 整合版）

> 本文档基于 2024-2026 年前端招聘的高频考点重新整理，涵盖 **CSS、JavaScript、浏览器与网络、Vue3、React、TypeScript、工程化、性能优化、安全、手写题** 等核心方向。
> 相比旧版，去掉了过时的 `vue-cli`/`webpack 大量细节`/IE 兼容等历史包袱，补充了当下面试更关注的知识点（Hooks、Composition API、Vite、微前端、前端工程化等）。

---

## 目录

1. [一、CSS 相关](#一css-相关)
2. [二、JavaScript 核心](#二javascript-核心)
3. [三、浏览器与网络](#三浏览器与网络)
4. [四、Vue3 相关](#四vue3-相关)
5. [五、React 相关](#五react-相关)
6. [六、Vue 与 React 对比](#六vue-与-react-对比)
7. [七、TypeScript](#七typescript)
8. [八、工程化与构建](#八工程化与构建)
9. [九、性能优化](#九性能优化)
10. [十、前端安全](#十前端安全)
11. [十一、设计模式](#十一设计模式)
12. [十二、高频手写题](#十二高频手写题)
13. [十三、场景题与软技能](#十三场景题与软技能)

---

## 一、CSS 相关

### 1、盒子水平垂直居中的几种方式

父元素：

```css
.container {
  width: 600px;
  height: 600px;
  border: 1px solid red;
  position: relative;
}
```

**方式一：定位 + margin 负值走自身一半**

需要知道子元素尺寸，通过 `top/left: 50%` 再回退自身一半。

```css
.item {
  width: 100px;
  height: 100px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -50px;
  margin-left: -50px;
}
```

**方式二：定位 + margin:auto**

不需要知道子元素尺寸。将 `top/right/bottom/left` 全部设为 0，再 `margin: auto`，浏览器会自动均分剩余空间实现居中。

```css
.item {
  width: 100px;
  height: 100px;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
}
```

**方式三：flex 弹性布局（最推荐）**

无需知道子元素尺寸，主轴与交叉轴都居中。

```css
.container {
  display: flex;
  justify-content: center; /* 主轴居中 */
  align-items: center;     /* 交叉轴居中 */
}
```

**方式四：transform 平移**

利用 `translate` 的百分比是相对于**自身**尺寸的特性，同样适用于未知尺寸的场景。

```css
.item {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
```

**方式五：grid 网格布局**

```css
.container {
  display: grid;
  place-items: center; /* 是 align-items 与 justify-items 的简写 */
}
```

### 2、盒模型介绍

CSS 中有两种盒模型：

- **标准盒模型（content-box）**：`width/height` 只包含 `content`。实际占据宽度 = `width + padding + border`。
- **IE（替代）盒模型（border-box）**：`width/height` 包含 `content + padding + border`。

通过 `box-sizing` 切换：

```css
.box {
  box-sizing: content-box; /* 标准（默认） */
  box-sizing: border-box;  /* IE（替代），更利于布局，常作为全局设置 */
}
```

> 现代项目中常全局设置 `* { box-sizing: border-box; }`，避免手算尺寸。

### 3、BFC（块级格式化上下文）

BFC 是一个独立的渲染区域，内部元素布局不会影响外部。常见特性：

1. 块级元素在垂直方向一个接一个排列。
2. BFC 内上下相邻元素的 `margin` 会重叠；创建新 BFC 可避免外边距塌陷。
3. 计算 BFC 高度时，会包含浮动元素的高度（可用于清除浮动）。
4. BFC 区域不会与浮动的容器重叠。
5. BFC 是独立容器，内部元素不会影响外部。
6. 每个元素的左 `margin` 与容器的左 `border` 接触。

**创建 BFC 的常见方式：**

- `float: left/right`（非 none）
- `position: absolute/fixed`
- `display: inline-block / flex / grid / table-cell`
- `overflow: hidden / auto / scroll`

**经典应用：** 清除浮动、避免 margin 塌陷、两栏布局（右侧 `overflow:hidden` 触发 BFC 不与左浮动重叠）。

### 4、CSS 选择器与优先级

`!important` > 内联 style > `id` > `class / 属性 / 伪类` > `元素 / 伪元素` > 通配符。

> 同优先级时，写在后面的覆盖前面的；`!important` 权重最高，但要慎用，会破坏可维护性。

### 5、两栏布局（左侧固定 + 右侧自适应）

给定结构：

```html
<div class="outer">
  <div class="left">左侧</div>
  <div class="right">右侧</div>
</div>
```

**方式一：浮动 + margin-left**

```css
.outer { height: 100px; }
.left { float: left; width: 200px; height: 100%; background: lightcoral; }
.right { margin-left: 200px; height: 100%; background: lightseagreen; }
```

**方式二：浮动 + BFC**

右侧 `overflow: hidden` 触发 BFC，使其不与浮动元素重叠。

```css
.left { float: left; width: 200px; height: 100%; background: lightcoral; }
.right { overflow: hidden; height: 100%; background: lightseagreen; }
```

**方式三：flex（最推荐）**

```css
.outer { display: flex; height: 100px; }
.left { width: 200px; height: 100%; background: lightcoral; }
.right { flex: 1; height: 100%; background: lightseagreen; }
```

**方式四：绝对定位**（脱离文档流，需父元素 `position: relative`）

```css
.outer { position: relative; height: 100px; }
.left { position: absolute; width: 200px; height: 100%; background: lightcoral; }
.right { margin-left: 200px; height: 100%; background: lightseagreen; }
```

### 6、圣杯布局与双飞翼布局（经典三栏）

目的：**中间一栏最先加载渲染（内容最重要）**；两侧固定，中间自适应；多用于 PC。

核心：使用 `float` + 两侧 `margin` 负值实现横向重叠；圣杯用父容器 `padding` 保护中间，双飞翼用中间内容 `margin` 保护。

**圣杯布局 HTML：**

```html
<div id="container" class="clearfix">
  <p class="center">我是中间</p>
  <p class="left">我是左边</p>
  <p class="right">我是右边</p>
</div>
```

**CSS：**

```css
#container { padding-left: 200px; padding-right: 150px; }
#container p { float: left; }
.center { width: 100%; }
.left {
  width: 200px;
  position: relative;
  left: -200px;
  margin-left: -100%;
}
.right { width: 150px; margin-right: -150px; }
.clearfix::after { content: ""; display: table; clear: both; }
```

**双飞翼布局 HTML：**

```html
<div id="main" class="float">
  <div id="main-wrap">main</div>
</div>
<div id="left" class="float">left</div>
<div id="right" class="float">right</div>
```

**CSS：**

```css
.float { float: left; }
#main { width: 100%; }
#main-wrap { margin: 0 190px; }
#left { width: 190px; margin-left: -100%; }
#right { width: 190px; margin-left: -190px; }
```

> 提示：`margin-left: -100%` 相对的是父元素 **content** 宽度（不含 padding/border）。理解 `margin` 负值是看懂这类布局的关键。

### 7、可以继承的 CSS 属性

- **字体系列**：`font-family`、`font-weight`、`font-size`、`font-style`、`line-height`。
- **文本系列**：`text-indent`、`text-align`、`letter-spacing`、`word-spacing`、`color`、`text-transform`。
- **列表系列**：`list-style`。
- **其他**：`cursor`、`visibility`（继承但不影响布局）等。

### 8、隐藏元素的方法与区别

| 方法 | 是否占位 | 是否响应事件 | 说明 |
| --- | --- | --- | --- |
| `display: none` | 不占位 | 不响应 | 渲染树不包含该节点，触发重排 |
| `visibility: hidden` | 占位 | 不响应 | 仅视觉隐藏，触发重绘 |
| `opacity: 0` | 占位 | **响应** | 常用于淡入淡出动画 |
| `position: absolute` + 移出可视区 | 不占位 | 视情况 | 将元素移出屏幕 |
| `z-index: 负值` | 占位 | 不响应 | 被其他元素遮挡 |
| `clip-path: inset(0)` | 占位 | 不响应 | 裁剪隐藏 |
| `transform: scale(0)` | 占位 | 不响应 | 缩放为 0 |

> 面试常追问：`display:none` 与 `visibility:hidden` 的区别（是否占位、是否重排/重绘）。

### 9、`link` 与 `@import` 的区别

- `link` 是 HTML 标签，可加载 CSS 也可加载其他资源（RSS/favicon）；`@import` 是 CSS 语法，只能加载 CSS。
- `link` 页面加载时**并行**加载 CSS；`@import` 需等页面完全加载后才加载，会阻塞渲染。
- `link` 无兼容性问题，支持 JS 动态控制 DOM 改变样式；`@import` 低版本 IE 不支持。
- 现代项目主要用 `link`。

### 10、CSS 新特性 / 现代 CSS 高频点

- **布局**：Flexbox、Grid、多列 `column-count`。
- **选择器**：`:not()`、`:is()`、`:where()`、属性选择器、`:nth-child()`。
- **视觉效果**：`border-radius`、`box-shadow`、`text-shadow`、`filter`、渐变 `linear-gradient`、`backdrop-filter`。
- **动画**：`transition`、`animation`、`@keyframes`、`transform`。
- **响应式**：媒体查询 `@media`、`clamp()`、`min()/max()`、容器查询 `@container`。
- **其他**：CSS 变量（`--var`）、`aspect-ratio`、`gap`、`content-visibility`、`scroll-snap`。

> 面试加分点：CSS 变量实现主题切换、`clamp()` 实现流式字体大小、`aspect-ratio` 保持宽高比。

### 11、物理像素、逻辑像素与像素密度

- **物理像素**：屏幕硬件实际发光的点，如 iPhone XS 为 1242×2688。
- **逻辑像素（CSS 像素）**：开发时使用的 `px` 单位，如 iPhone XS 宽 414px。
- **DPR（像素密度比）** = 物理像素 / 逻辑像素 = 1242 / 414 = 3，即 3 倍屏。

**为什么需要 @2x/@3x 图：** 图片 1 个像素至少对应 1 个物理像素才不会模糊。若原图 500×300px，在 3 倍屏上需提供 1500×900px 的图，否则会被拉伸发虚。

### 12、`margin` 与 `padding` 的使用场景

- 需要在 `border` **外侧**加空白、空白处**不需要背景**时用 `margin`。
- 需要在 `border` **内侧**加空白、空白处**需要背景**时用 `padding`。

### 13、单行 / 多行文本溢出隐藏

**单行：**

```css
overflow: hidden;
text-overflow: ellipsis;
white-space: nowrap;
```

**多行（-webkit 内核）：**

```css
overflow: hidden;
text-overflow: ellipsis;
display: -webkit-box;
-webkit-box-orient: vertical;
-webkit-line-clamp: 3; /* 显示行数 */
```

> 注意：`line-clamp` 目前属于实验性/需前缀，兼容性需关注。

### 14、浮动引起的问题与清除方式

**问题：** 父元素高度塌陷（无法被浮动子元素撑开），影响同级元素布局。

**清除方式：**

- 给父级定义 `height`（不灵活）。
- 在末尾加空元素并设 `clear: both`（会多一个无用 DOM）。
- 父级设 `overflow: hidden/auto`（触发 BFC）。
- 使用 `::after` 伪元素 + `clear: both`（推荐）。

```css
.clearfix::after {
  content: "";
  display: block;
  clear: both;
}
```

> 现代布局已用 flex/grid 替代浮动，但理解清除浮动原理仍是考点。

### 15、margin 塌陷（外边距折叠）

**描述：** 垂直方向上相邻（或父子）元素的 `margin` 会合并为较大的一个。脱离文档流的元素（浮动、绝对定位）不会塌陷；塌陷只发生在**垂直方向**。

**计算原则：** 正正取最大、一正一负做减法、负负取绝对值大者。

**解决：**

- 兄弟之间：底部元素改 `inline-block`、浮动或定位。
- 父子之间：父元素加 `overflow: hidden`、加透明 `border`、子元素改 `inline-block` 或定位。

### 16、画一条 0.5px 的线

```css
.line {
  transform: scale(0.5, 0.5);
  transform-origin: left top;
}
```

> 更常见的是通过 `transform: scaleY(0.5)` 或使用背景渐变、伪元素实现。

### 17、CSS 变量（自定义属性）与主题切换

```css
:root {
  --primary: #409eff;
  --bg: #fff;
}
.btn {
  background: var(--primary);
}
/* 暗色主题切换 */
[data-theme="dark"] {
  --bg: #1e1e1e;
}
```

> 通过切换根节点 `data-theme` 实现主题，无需重写样式，是 2024+ 面试加分项。

---

## 二、JavaScript 核心

### 1、数据类型与存储

**基本类型（原始值，存栈内存）：** `Number`、`String`、`Boolean`、`Null`、`Undefined`、`Symbol`、`BigInt`。

**引用类型（存堆内存，栈存指针）：** `Object`、`Array`、`Function`、`Date`、`RegExp`、`Map`、`Set` 等。

- **浅拷贝**：只复制引用，新旧对象共享引用类型值。
- **深拷贝**：递归复制，新旧对象完全独立。

> 记忆：栈 = 后进先出（LIFO）；堆内存用于动态分配。

### 2、作用域与作用域链

- **全局作用域**：整个脚本内生效。
- **函数作用域（局部）**：函数内部生效，形参可视为局部变量。
- **块级作用域**：`let`/`const` 声明，在 `{}`（`if`/`for`/`switch`/`try-catch` 的 `catch`）内生效。

**作用域链（就近原则）：** 内部函数访问变量时，沿自身 → 父函数 → ... → 全局逐层向上查找。

```js
var num = 22;
function fn() {
  var num = 33;
  function fun() {
    console.log(num); // 33，就近取到外层 fn 的 num
  }
  fun();
}
fn();
```

### 3、变量提升与闭包

**变量提升：** `var` 声明会被提升到作用域顶部（只提升声明，不提升赋值），`let/const` 存在暂时性死区（TDZ）。

```js
var a = 1;
function foo() {
  console.log('a', a); // undefined（var a 被提升但未赋值）
  var a = 2;
}
foo();
```

**闭包：** 函数内返回一个函数，内层函数可以访问外层函数作用域中的变量。外层函数执行完毕，因内层函数仍引用其活动对象，该活动对象不会被 GC 回收。

**闭包的应用：** 柯里化、防抖节流、模块封装（私有变量）、循环中保存变量。

**闭包的内存问题：** 不恰当使用会导致变量长期无法释放，需注意及时置空引用。

### 4、`call` / `apply` / `bind` 区别与实现

三者都用于改变函数执行时 `this` 的指向：

- `call(thisArg, arg1, arg2...)`：参数列表，**立即执行**。
- `apply(thisArg, [argsArray])`：参数数组，**立即执行**。
- `bind(thisArg, arg1...)`：**返回新函数**，不立即执行，之后可再传参调用。

**call 实现：**

```js
Function.prototype.myCall = function (context, ...args) {
  context = context ?? window;
  const key = Symbol('fn');
  context[key] = this;
  const res = context[key](...args);
  delete context[key];
  return res;
};
```

**apply 实现：**

```js
Function.prototype.myApply = function (context, arr) {
  context = context ?? window;
  const key = Symbol('fn');
  context[key] = this;
  const res = Array.isArray(arr) ? context[key](...arr) : context[key]();
  delete context[key];
  return res;
};
```

**bind 实现：**

```js
Function.prototype.myBind = function (context, ...args) {
  const fn = this;
  return function (...innerArgs) {
    return fn.apply(context, [...args, ...innerArgs]);
  };
};
```

> 补充：`arguments` 是类数组，转真数组可用 `[...arguments]`、`Array.from(arguments)` 或 `[].slice.call(arguments)`。

### 5、箭头函数与普通函数的区别

- 箭头函数是匿名函数，**不能作为构造函数**，不能用 `new`。
- 箭头函数**没有自己的 `this`**，`this` 继承外层作用域，且不能通过 `call/apply/bind` 修改。
- 没有 `arguments`，可用 `...rest` 替代。
- 没有 `prototype`。
- 不能当作 `Generator` 函数（不能用 `yield`）。
- 写法简洁，可省略 `return`。

### 6、`reduce` 方法

`reduce(callback, initialValue)` 将数组元素累加/汇总为单个值。`callback` 有四个参数：`preValue`（上一次结果）、`currentValue`（当前值）、`index`、`array`。若不传初始值，第一次 `preValue` 为数组第 0 项。

**常见应用：**

```js
// 1. 累加
[1, 2, 3, 4, 5].reduce((pre, cur) => pre + cur, 0); // 15

// 2. 累加对象数组（必须给初始值）
[{ x: 1 }, { x: 2 }, { x: 3 }].reduce((pre, cur) => pre + cur.x, 0); // 6

// 3. 二维数组转一维
[[0, 1], [2, 3]].reduce((pre, cur) => pre.concat(cur), []); // [0,1,2,3]

// 4. 多维数组扁平化（递归）
const flat = (arr) =>
  arr.reduce((pre, cur) => pre.concat(Array.isArray(cur) ? flat(cur) : cur), []);
flat([[0, 1], [4, [1, 23]]]); // [0,1,4,1,23]
```

### 7、`Set` 与 `Map`

**Set（类数组，值唯一）：** `add` / `has` / `delete` / `clear` / `size`，可 `for...of` / `forEach` 迭代。

**Map（任意类型键）：** `set` / `get` / `has` / `delete` / `clear` / `size`。

**对象与 Map 的区别：**

| 对比项 | Object | Map |
| --- | --- | --- |
| 键类型 | 字符串/Symbol | 任意类型 |
| 迭代 | 需 `Object.keys()` 等 | 可直接 `for...of` |
| 键顺序 | 不保证 | 保持插入顺序 |
| JSON | 支持 | 不支持（序列化后为空对象） |
| 场景 | 普通对象/JSON | 频繁增删、复杂键 |

### 8、`some` / `every` / `find` / `includes`

- `some`：有一项满足即 `true`，短路。
- `every`：全部满足才 `true`，有一项不满足即短路返回 `false`。
- `find`：返回第一个满足条件的元素（本身）。
- `includes`：判断是否包含某值，内部用 `SameValueZero`（能正确识别 `NaN`），比 `indexOf` 语义更清晰。

```js
[NaN].includes(NaN); // true
[NaN].indexOf(NaN);  // -1
```

### 9、类型检测的几种方式

- `typeof`：适合基本类型，但 `null`、数组、对象都返回 `object`。
- `instanceof`：检测引用类型在原型链上是否匹配，**无法判断基本类型**，且跨 iframe 会失效。
- `constructor`：可判断类型，但对象原型被改写后会失真。
- `Object.prototype.toString.call()`：**最精确**，返回 `[object Type]`。

```js
Object.prototype.toString.call([]);        // '[object Array]'
Object.prototype.toString.call(null);      // '[object Null]'
Object.prototype.toString.call(new Date()); // '[object Date]'
```

### 10、类数组（array-like）转真数组

```js
Array.prototype.slice.call(arrayLike);
[].slice.call(arguments);
Array.from(arrayLike);        // 推荐
[...arrayLike];               // 需有迭代器
```

> `arguments` 没有 `slice`，借数组的 `slice` 让 `this` 指向 `arguments` 即可处理。

### 11、`Promise` 的理解

Promise 用于解决异步回调（回调地狱）问题。有 `pending`（进行中）、`fulfilled`（成功）、`rejected`（失败）三态，状态一旦改变不可逆。`.then` 处理成功，`.catch` 处理失败。

**`Promise.all`：** 接收 promise 数组，全部成功才 resolve，结果按顺序返回；只要一个失败就 reject（快速失败）。

**`Promise.race`：** 返回最快 settle 的那个，其余结果不关心。

**`Promise.allSettled`（ES2020）：** 等待所有结束，返回每个的结果（含成功/失败），不会因单个失败而中断。

**`Promise.any`（ES2021）：** 返回第一个成功的结果；全部失败才 reject。

> 2024+ 高频追问：`all` 与 `allSettled` 的区别、`race` 用于超时控制。

### 12、`async/await`

`async/await` 是基于 Promise 的语法糖。`async` 函数总是返回一个 Promise；`await` 等待 Promise 的 resolve 值，reject 需用 `try/catch` 捕获；`await` 只能在 `async` 函数内使用。

### 13、事件循环 EventLoop

JavaScript 单线程，通过事件循环处理异步。**执行顺序：同步代码 → 微任务 → 宏任务。**

| 微任务 | 宏任务 |
| --- | --- |
| Promise.then/catch、queueMicrotask | setTimeout、setInterval |
| MutationObserver | DOM 事件、ajax、I/O |

**流程：** 调用栈执行同步代码 → 遇到异步交给 Web API → 栈空后，先清空微任务队列 → 再取一个宏任务执行 → 再清空微任务 → 循环。

> 高频手写题：说出 `setTimeout/Promise/async` 组合的输出顺序。核心是**每次宏任务后都要清空微任务**。

### 14、`new` 操作符做了什么

1. 创建一个新对象。
2. 将新对象的 `__proto__` 指向构造函数的 `prototype`。
3. 将构造函数内 `this` 指向新对象并执行（绑定属性和方法）。
4. 若构造函数返回对象则返回它，否则返回新对象。

```js
function myNew(Constructor, ...args) {
  const obj = Object.create(Constructor.prototype);
  const result = Constructor.apply(obj, args);
  return result && (typeof result === 'object' || typeof result === 'function')
    ? result
    : obj;
}
```

### 15、原型与原型链

- **`prototype`**：只有**函数**才有，存放被实例共享的属性和方法（如 `Array.prototype` 有 `map/push` 等）。
- **`__proto__`**：每个对象都有（非标准，浏览器实现），指向其构造函数的 `prototype`，即 `实例.__proto__ === 构造函数.prototype`。
- **原型链**：访问属性时先查自身，再沿 `__proto__` 逐层向上，直到 `Object.prototype`（其 `__proto__` 为 `null`）。

```js
class Person {
  constructor(name) { this.name = name; }
  say() { console.log(this.name); }
}
const p = new Person('Tom');
p.__proto__ === Person.prototype; // true
```

### 16、`instanceof` 原理与手写

原理：遍历左侧对象原型链，看是否等于右侧函数的 `prototype`。

```js
function myInstanceof(target, origin) {
  if (typeof target !== 'object' || target === null) return false;
  if (typeof origin !== 'function') throw new TypeError('origin must be function');
  let proto = Object.getPrototypeOf(target);
  while (proto) {
    if (proto === origin.prototype) return true;
    proto = Object.getPrototypeOf(proto);
  }
  return false;
}
```

> 注意：`123 instanceof Number` 为 `false`（基本类型不能 instanceof）；需 `new Number(123)` 才行。

### 17、深拷贝（手写）

```js
function deepClone(obj, map = new WeakMap()) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof RegExp) return new RegExp(obj);
  if (map.has(obj)) return map.get(obj); // 解决循环引用

  const clone = Array.isArray(obj) ? [] : {};
  map.set(obj, clone);
  for (const key of Object.keys(obj)) {
    clone[key] = deepClone(obj[key], map);
  }
  return clone;
}
```

> 追问：`JSON.parse(JSON.stringify())` 的缺点——丢失 `undefined`/`function`/`Symbol`、Date 变字符串、无法处理循环引用、无法复制不可枚举属性。

### 18、防抖与节流（手写）

**防抖（debounce）：** 连续触发时只在最后一次触发后等待 `delay` 再执行。

```js
function debounce(fn, delay = 300) {
  let timer = null;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}
```

**节流（throttle）：** 固定间隔内最多执行一次。

```js
function throttle(fn, interval = 300) {
  let last = 0;
  return function (...args) {
    const now = Date.now();
    if (now - last >= interval) {
      last = now;
      fn.apply(this, args);
    }
  };
}
```

> 适用场景：防抖——输入框搜索、窗口 resize；节流——滚动加载、按钮防重复点击。

### 19、函数柯里化（Currying）

将接收多参数的函数转换成一系列只接收单个参数的函数。

```js
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return (...more) => curried.apply(this, [...args, ...more]);
  };
}
function add(a, b, c) { return a + b + c; }
const curriedAdd = curry(add);
curriedAdd(1)(2)(3); // 6
```

### 20、数组去重

```js
// Set（最简洁）
[...new Set(arr)];

// filter + indexOf
arr.filter((item, index, self) => self.indexOf(item) === index);

// reduce
arr.reduce((acc, cur) => (acc.includes(cur) ? acc : [...acc, cur]), []);
```

### 21、判断对象为空

```js
Object.keys(obj).length === 0;
JSON.stringify(obj) === '{}';
Reflect.ownKeys(obj).length === 0; // 包含不可枚举属性
```

### 22、字符串翻转 / 求出现最多字符 / 冒泡排序

```js
// 翻转字符串
str.split('').reverse().join('');

// 出现最多的字符
function findMax(str) {
  const count = {};
  for (const c of str) count[c] = (count[c] || 0) + 1;
  return Object.entries(count).sort((a, b) => b[1] - a[1])[0][0];
}

// 冒泡排序
function bubbleSort(arr) {
  for (let i = 0; i < arr.length; i++)
    for (let j = 0; j < arr.length - i - 1; j++)
      if (arr[j] > arr[j + 1]) [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
  return arr;
}
```

### 23、内存泄漏的常见原因

1. 未清理的**定时器**（`setInterval`/`setTimeout`）。
2. **未移除的事件监听器**（`addEventListener` 持有目标引用）。
3. 不恰当使用**闭包**导致变量无法回收。
4. 全局变量/`window` 上的临时引用。
5. `Map`/`Set` 中保存已无用的对象（可用 `WeakMap`/`WeakSet` 避免）。
6. 分离的 DOM 节点仍被 JS 引用。

### 24、ES6+ 高频新特性

`let/const`、模板字符串、解构赋值、箭头函数、`class`、模块（`import/export`）、`Promise`、`Generator`、`Set/Map`、`Proxy`、`Symbol`、`BigInt`、可选链 `?.`、空值合并 `??`、展开/剩余运算符、`for...of`、`Array.from/find/findIndex`、`Object.assign/entries`、数组 `flat/flatMap/includes` 等。

> 2024+ 加分：`?.` 与 `??`、`Object.hasOwn`、`Array.prototype.at`、`Promise.allSettled/any`、`structuredClone` 原生深拷贝。

---

## 三、浏览器与网络

### 1、浏览器工作原理（渲染流程）

1. **导航**：输入 URL → DNS 解析 → 建立 TCP 连接 → 发送 HTTP 请求 → 接收响应。
2. **解析 HTML** 构建 DOM 树；**解析 CSS** 构建 CSSOM 树。
3. 合并 DOM 与 CSSOM 生成 **渲染树（Render Tree）**（只包含可见节点）。
4. **布局（Layout/Reflow）**：计算节点尺寸与位置。
5. **绘制（Paint）**：将渲染树绘制为屏幕像素。
6. 展示页面并监听交互。

> 重点追问：DOM/CSSOM 构建、`script` 阻塞、`defer/async`、关键渲染路径（CRP）。

### 2、重排（Reflow）与重绘（Repaint）

- **重排**：节点几何尺寸/位置变化，需要重新计算布局（如增删 DOM、改尺寸、窗口 resize、内容改变）。
- **重绘**：仅外观变化（颜色、背景、圆角、阴影、透明度），不影响布局。

**原则：`重排必定引起重绘，重绘不一定引起重排`。**

**减少重排重绘：**

- 合并样式修改 / 用 `class` 切换。
- 使用 `transform`/`opacity` 做动画（GPU 加速，不触发重排）。
- 批量操作 DOM（`DocumentFragment`）。
- 避免频繁读取布局属性（如 `offsetHeight`），读写分离。
- `will-change` / `content-visibility`。

### 3、浏览器缓存（强缓存 + 协商缓存）

**强缓存：** 命中后不发请求，直接用本地缓存。字段：

- `Expires`（HTTP/1.0，绝对时间，易受本地时间影响）。
- `Cache-Control: max-age=xxx`（HTTP/1.1，相对时间，优先级更高）。`no-cache` 表示要协商，`no-store` 表示不缓存。

**协商缓存：** 需要与服务器验证是否可用缓存。

- 请求头 `If-Modified-Since` ↔ 响应头 `Last-Modified`（基于时间）。
- 请求头 `If-None-Match` ↔ 响应头 `ETag`（基于内容指纹，更精确）。
- 服务器返回 `304` 则用缓存；返回 `200` 则更新缓存。

> 高频问答：强缓存优先于协商缓存；`Cache-Control` 优先于 `Expires`；`ETag` 优先于 `Last-Modified`。

### 4、从 URL 输入到页面展示的完整过程

1. 检查强缓存，命中则直接使用。
2. DNS 解析域名 → IP。
3. 建立 TCP 连接（**三次握手**）。
4. 发送 HTTP 请求，服务器返回 HTML。
5. 解析 HTML → 构建 DOM、CSSOM → 生成渲染树 → 布局 → 绘制。
6. 四次挥手断开连接。

> 加分：`HTTP/1.1` 长连接、`HTTP/2` 多路复用、`HTTP/3`（QUIC）的区别。

### 5、`HTTP/1.1`、`HTTP/2`、`HTTP/3` 对比

| 版本 | 特点 |
| --- | --- |
| HTTP/1.1 | 长连接、管线化；但队头阻塞、一个连接串行请求 |
| HTTP/2 | 多路复用（一个连接并发多个请求）、头部压缩（HPACK）、二进制分帧、服务端推送；仍存在 TCP 层队头阻塞 |
| HTTP/3 | 基于 UDP 的 QUIC，彻底解决队头阻塞，连接建立快（0-RTT），更适合弱网 |

### 6、HTTP 常见状态码

- `200`：成功；`204`：无内容。
- `301`：永久重定向；`302`：临时重定向；`304`：协商缓存命中。
- `400`：请求错误；`401`：未认证；`403`：禁止访问；`404`：不存在。
- `500`：服务器错误；`502`：网关错误；`503`：服务不可用；`504`：网关超时。

### 7、`Content-Type`

告诉服务端如何解析请求数据、告诉客户端如何解析响应数据。

- `application/x-www-form-urlencoded`：`key1=val1&key2=val2`，中文/特殊字符会 URL 编码，常用于表单提交，不支持文件。
- `application/json;charset=UTF-8`：当前最常用，序列化 JSON 字符串放入请求体。
- `multipart/form-data`：用于**文件上传**。

### 8、跨域的本质与解决方式

**同源策略：** 协议、域名、端口任一不同即跨域。浏览器默认拦截跨域响应。

**常见解决：**

1. **CORS（推荐）**：后端设置响应头 `Access-Control-Allow-Origin`，浏览器放行。分简单请求与预检请求（`OPTIONS`，针对非简单请求）。
2. **代理**：开发环境 Vite/Webpack `proxy`；生产环境 Nginx 反向代理。
3. **JSONP**：利用 `script` 标签 `src` 不受同源限制，仅支持 `GET`。
4. **同域部署**：前后端放到同一域名下。
5. `postMessage`（跨文档通信）、`WebSocket`（不受同源限制）。

**JSONP 原理：** 动态创建 `script`，`src` 指向带 `callback` 参数的服务端地址；服务端返回 `callback(data)` 的调用，前端已提前定义好该函数，从而拿到数据。

### 9、正向代理与反向代理

- **正向代理（为客户端服务）**：客户端知道目标，代理代表客户端去请求目标。场景：翻墙、隐藏客户端 IP、缓存。即"帮客户端干活"。
- **反向代理（为服务端服务）**：客户端不知道真实服务器，请求打到代理，代理分发到内部服务器。场景：负载均衡、安全、SSL 加速、缓存。

> 一句话：正向代理隐藏客户端，反向代理隐藏服务器。

### 10、浏览器存储方式

| 方式 | 容量 | 持久 | 作用域 | 说明 |
| --- | --- | --- | --- | --- |
| Cookie | 4KB | 按过期时间 | 域名 | 自动随请求携带，可用于会话 |
| localStorage | 5MB+ | 永久 | 同源 | 适合持久化业务数据 |
| sessionStorage | 5MB+ | 关闭标签页清空 | 同标签页 | 适合一次性会话数据 |
| IndexedDB | 大 | 永久 | 同源 | 结构化大数据/离线应用 |

> 高频问答：`localStorage` 与 `sessionStorage` 区别；Cookie 的 `HttpOnly`/`Secure`/`SameSite` 属性（安全相关）。

### 11、`Event Loop`（浏览器侧）深挖

- **调用栈**执行同步代码。
- 微任务：`Promise.then`、`MutationObserver`、`queueMicrotask`。
- 宏任务：`setTimeout`、`setInterval`、`I/O`、UI 渲染。
- **每执行完一个宏任务，都会先清空整个微任务队列，再进行下一次宏任务。**

```js
setTimeout(() => console.log(1), 0);
Promise.resolve().then(() => console.log(2));
console.log(3);
// 输出顺序：3, 2, 1
```

### 12、浏览器垃圾回收机制

- **标记清除（Mark-Sweep）**：从根对象（`window`/全局）出发，标记可达对象，清除不可达对象。这是主流策略。
- **引用计数**：早期策略，存在循环引用问题（A 引用 B、B 引用 A 无法回收），已基本弃用。
- **V8 分代回收**：新生代（对象小、存活短，用 Scavenge 算法）与老生代（对象大、存活长，用标记-清除/整理）。
- **V8 优化：** 增量标记、并行回收、延迟清理，减少 GC 停顿对性能的影响。

> 手动协助回收：解除不再使用的引用、移除事件监听、`WeakMap`/`WeakSet` 作为键时不计入引用。

### 13、`JWT`（JSON Web Token）认证

**流程：**

1. 客户端用用户名/密码登录。
2. 服务端验证通过后签发 token 返回客户端。
3. 客户端存储 token（localStorage 或 Cookie）。
4. 每次请求在 Header（`Authorization: Bearer <token>`）中携带。
5. 服务端验证 token，通过则返回数据。

**优点：** 支持跨域（token 不依赖 Cookie）、适合移动端/非浏览器、无状态（服务器无需存 session）。

**缺点：** token 一旦签发难撤销（无状态双刃剑）、体积较大。

### 14、`Object.prototype.toString` 与类型判断

构造函数生成的实例（`Number/String/Boolean/Array/Date/RegExp/Function`）重写了自身的 `toString`，会返回对应字符串；但 `Object`、`Math` 返回 `[object Object]`。精确判断需用：

```js
Object.prototype.toString.call(value); // 精确到 [object Type]
```

---

## 四、Vue3 相关

### 1、Vue2 与 Vue3 的响应式区别

**Vue2 用 `Object.defineProperty`：**

- 只能劫持**已有属性**，新增/删除属性无法检测（需 `Vue.set`/`this.$set`）。
- 数组通过重写原型方法（`push/pop/shift/unshift/splice/sort/reverse`）实现，无法通过索引或修改 `length` 触发。
- 初始化时递归遍历所有属性，性能代价大。

**Vue3 用 `Proxy`：**

- 可以拦截**所有操作**（get/set/has/deleteProperty），支持动态新增属性、删除属性。
- 支持**数组索引与 length** 变化的拦截。
- 可拦截 `Map`/`Set` 等。
- 惰性响应，性能更好。

```js
// Vue2 新增属性
Vue.set(obj, 'key', value); // 或 this.$set(...)

// Vue3 直接赋值即可
state.newKey = value;
```

### 2、`ref` 与 `reactive` 的区别

| 对比 | ref | reactive |
| --- | --- | --- |
| 支持类型 | 基本类型 + 对象 | 仅对象/数组/集合 |
| 访问 | `.value` | 直接访问 |
| 模板自动解包 | 是 | 否 |
| 解构 | 丢失响应性（需 `toRefs`） | 直接解构丢失响应性 |

**何时用谁：**

- 基本类型数据 → `ref`。
- 对象/数组 → 两者均可；复杂嵌套对象常用 `reactive`。
- 需要解构保留响应性 → `toRefs`。

> 高频坑：`reactive` 直接整体赋值会丢失响应性（因为覆盖了 Proxy）。解决：外层包一层属性、用 `Object.assign` 合并、或改用 `ref`。

```js
// 错误：userInfo = [...] 会覆盖 Proxy，丢失响应
const list = reactive([]);
list.push(...data); // 正确

// ref 整体赋值无此问题
const list = ref([]);
list.value = data; // 正确
```

### 3、Composition API（组合式 API）与 Options API

- **Options API**：Vue2 风格，按 `data/computed/methods/watch` 分类。逻辑分散，组件复杂时"按逻辑横切"不便复用。
- **Composition API**：Vue3 引入，在 `setup` 中按**逻辑关注点**组织代码。配合 `ref/reactive/computed/watch`，可封装自定义 Hook（`composables`）实现逻辑复用。

**setup 执行时机：** 在 `beforeCreate` 之前执行，`this` 不可用（指向 undefined）。

```js
import { ref, onMounted } from 'vue';

function useUser() {
  const name = ref('');
  const load = async () => { name.value = 'Tom'; };
  onMounted(load);
  return { name };
}
```

### 4、Computed 与 Watch 的区别

- **`computed`（计算属性）**：依赖其他响应式数据，有**缓存**，仅依赖变化时重新计算。适合**同步、纯计算**场景。
- **`watch`（侦听器）**：无缓存，监听的数据变化时执行回调。适合**异步、开销大、需要副作用**的场景（如防抖请求）。

```js
const double = computed(() => count.value * 2);

watch(count, async (newVal, oldVal) => {
  // 异步请求、防抖等
});
```

> 追问：`watch` 与 `watchEffect` 区别——`watch` 需指定来源且惰性；`watchEffect` 自动追踪依赖立即执行。

### 5、Vue3 生命周期（对比 Vue2）

| Vue2 | Vue3 |
| --- | --- |
| beforeCreate | setup() |
| created | setup() |
| beforeMount | onBeforeMount |
| mounted | onMounted |
| beforeUpdate | onBeforeUpdate |
| updated | onUpdated |
| beforeDestroy | onBeforeUnmount |
| destroyed | onUnmounted |
| activated | onActivated |
| deactivated | onDeactivated |

**父子组件挂载顺序：** 父 `beforeMount` → 子 `beforeMount` → 子 `mounted` → 父 `mounted`（子先完成挂载）。

**父子更新顺序：** 父 `beforeUpdate` → 子 `beforeUpdate` → 子 `updated` → 父 `updated`。

### 6、`v-if` 与 `v-show` 的区别

- `v-if`：**条件渲染**，不满足则元素不渲染（销毁/重建），有更高的切换开销；适合**不常切换**的场景。
- `v-show`：始终渲染，用 `display:none` 切换，有更高的初始渲染开销；适合**频繁切换**。

### 7、`v-for` 中的 `key` 作用

`key` 用于帮助 diff 算法识别节点，精准地复用/移动/删除元素。不使用 `key` 时 Vue 会尽力就地复用，可能导致状态错乱。

**为什么不用 index 作 key：** 当列表进行增删或重排时，index 会变化，导致 Vue 误判节点复用关系，引发组件状态错乱或渲染错误。应使用稳定且唯一的 id。

### 8、`v-model` 的原理

`v-model` 是语法糖，本质是 `value`（或 `modelValue`）+ 事件：

```vue
<input v-model="msg" />
<!-- 等价于 -->
<input :value="msg" @input="msg = $event.target.value" />
```

自定义组件：

```vue
<Child v-model="val" />
<!-- 等价于 -->
<Child :modelValue="val" @update:modelValue="val = $event" />
```

### 9、插槽（Slot）

用于父组件向子组件传入模板内容：

- **默认插槽**：`<slot>默认内容</slot>`。
- **具名插槽**：`<slot name="header" />`，父用 `<template #header>`。
- **作用域插槽**：子组件把数据传给插槽，父可拿到。

```vue
<!-- 子组件 -->
<slot :user="user">{{ user.name }}</slot>

<!-- 父组件 -->
<Child #default="{ user }">{{ user.name }}</Child>
```

### 10、Vue3 组件通信方式

1. **props / emit**：父子通信（单向数据流 + 事件）。
2. `v-model`：父子双向绑定。
3. **provide / inject**：祖先传后代（跨层级）。
4. **ref**：父拿子组件实例/方法。
5. **事件总线**（`mitt`，Vue3 中 `$on/$emit` 已移除）。
6. **状态管理**：Pinia（跨组件共享）。
7. **插槽**：父传模板给子。

### 11、`nextTick` 原理

Vue 更新 DOM 是**异步**的（同一事件循环内的多次数据变更会合并到一次更新队列）。`nextTick(cb)` 在 DOM 更新完成后执行回调，用于获取更新后的 DOM。

**实现：** 优先使用 `Promise`，依次降级 `MutationObserver`、`setImmediate`、`setTimeout(fn, 0)`，将回调放入微任务（或宏任务）队列。

### 12、Vue 性能优化

1. 路由懒加载 + 组件懒加载（异步组件 `defineAsyncComponent`）。
2. 第三方库**按需引入**。
3. 大数据列表用**虚拟滚动**。
4. `keep-alive` 缓存组件。
5. 列表数据用 `Object.freeze()` 冻结，跳过响应式（只读展示数据）。
6. 大量静态内容用 `v-once` / `v-memo`。
7. 函数式组件 / 合理拆分组件。
8. 避免 `v-for` 与 `v-if` 同用。
9. 事件代理、防抖节流。
10. 合理使用 `shallowRef`/`shallowReactive` 减少深度代理。

### 13、Pinia 状态管理

Pinia 是 Vue3 官方推荐的状态库，相比 Vuex：

- **去掉了 Mutations**（Actions 直接改状态），更简洁。
- **扁平化模块**，无需嵌套命名空间。
- 原生支持组合式 API 与 TypeScript。

**核心三件套：**

```js
export const useStore = defineStore('main', {
  state: () => ({ count: 0 }),
  getters: {
    double: (state) => state.count * 2,
  },
  actions: {
    increment() { this.count++; },
  },
});
```

**常用 API：** `$patch`（批量修改）、`$reset`（重置）、`$subscribe`（订阅变化）、`$state`（替换状态）。

### 14、Vue 路由：Hash 与 History 模式

| 对比 | hash | history |
| --- | --- | --- |
| URL | 带 `#`，不美观 | 干净美观 |
| 刷新 | 正常 | **需服务端配置**，否则 404 |
| 兼容 | 兼容低版本 | 依赖 HTML5 History API |
| 原理 | 监听 `hashchange` | 监听 `popstate` + `pushState/replaceState` |

> 生产用 history 需在 Nginx 配置 `try_files $uri $uri/ /index.html`（SPA fallback）。

### 15、虚拟 DOM 与 Diff 算法

**虚拟 DOM（VNode）：** 用 JS 对象描述 DOM 节点，建立与真实 DOM 的映射。更新时通过 diff 找出差异，最小化真实 DOM 操作。

**优点：** 减少不必要的 DOM 操作、跨端渲染（SSR/原生渲染）、可预测。
**缺点：** 首次渲染多一层 VNode 计算，比手写 DOM 略慢（但换来可维护性）。

**Diff 算法（同层比较）：**

- **深度优先、同层比较**，不跨层级。
- 采用**双端（头尾）指针**比较。
- 列表 diff 依赖 `key` 提升复用率。

> 尤雨溪观点：框架的价值是"可维护性 vs 性能"的取舍，没有任何框架能快过手动优化的 DOM，但能保证普通场景下过得去的性能。

### 16、Vue3 新特性总结

1. Composition API（组合式 API）。
2. 基于 `Proxy` 的响应式系统。
3. 多个根节点（Fragments）。
4. `<script setup>` 语法糖。
5. `Teleport`（传送门，渲染到任意 DOM 位置）。
6. `Suspense`（异步组件加载）。
7. 更好的 TypeScript 支持（Vue3 用 TS 重写）。
8. 移除 `filter`（用计算属性替代）。
9. `v-memo`、`shallowRef` 等性能优化能力。
10. 生态：Pinia、Vue Router 4、Vite。

---

## 五、React 相关

### 1、React 的核心思想与特点

- **组件化**：UI 由组件组合而成，组件是函数/类。
- **声明式**：描述"UI 应该长什么样"，React 负责更新 DOM。
- **单向数据流**：props 从父到子传递。
- **虚拟 DOM + 协调（Reconciliation）**：通过 diff 高效更新。
- **函数式**：推崇纯函数、不可变数据、Hooks 组合。

### 2、函数组件与类组件

| 对比 | 类组件 | 函数组件 |
| --- | --- | --- |
| 定义 | `class` + `render` | 函数返回 JSX |
| this | 有 this | 无 this |
| 状态 | `this.state` / `setState` | `useState` |
| 生命周期 | 生命周期方法 | Hooks（`useEffect` 等） |
| 现状 | 官方已不推荐 | **现代 React 主流** |

> React 团队明确**推荐函数组件 + Hooks**，类组件仅维护存量项目。

### 3、Hooks 有哪些（高频）

- **`useState`**：声明状态。
- **`useEffect`**：处理副作用（数据请求、订阅、DOM 操作）。
- **`useContext`**：跨层读取上下文。
- **`useReducer`**：复杂状态逻辑（类似 Redux 的 reducer）。
- **`useMemo`**：缓存计算结果，依赖变化才重算。
- **`useCallback`**：缓存函数引用，避免子组件无意义重渲染。
- **`useRef`**：保存可变值 / 访问 DOM，不触发渲染。
- **`useLayoutEffect`**：在浏览器绘制前同步执行。
- **自定义 Hook**：以 `use` 开头，复用逻辑。

```js
import { useState, useEffect } from 'react';

function useCountdown(initial) {
  const [count, setCount] = useState(initial);
  useEffect(() => {
    const timer = setInterval(() => setCount((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, []);
  return count;
}
```

### 4、`useEffect` 的依赖与清理

- `useEffect(fn)`：每次渲染后执行。
- `useEffect(fn, [])`：仅挂载后执行一次（模拟 `mounted`）。
- `useEffect(fn, [dep])`：依赖变化时执行。
- **清理函数**：`return () => {}`，在卸载或下次 effect 前执行，用于清除定时器/取消订阅，防止内存泄漏。

```js
useEffect(() => {
  let ignore = false;
  fetchData().then((data) => { if (!ignore) setData(data); });
  return () => { ignore = true; };
}, []);
```

### 5、`useMemo`、`useCallback`、`memo` 的区别

- `useMemo`：缓存**计算结果**。
- `useCallback`：缓存**函数引用**。
- `memo`（`React.memo`）：对**组件**做浅比较缓存，props 未变则跳过重渲染。

**使用原则：** 不要过度优化。只在子组件重渲染开销大且依赖稳定时才使用。`useCallback` 常与 `memo` 配合，避免父组件每次渲染都传新函数导致子组件重渲染。

### 6、`useRef` 与 `useState` 的区别

- 修改 `ref.current` **不会触发重新渲染**。
- 修改 `state` 会触发重新渲染。
- `ref` 常用于保存不会引起渲染的可变值（计时器 id、DOM 引用）。

### 7、React 渲染流程与 Re-render

**渲染触发条件：** ① props/state 变化；② 父组件重渲染（默认会连带子组件，除非 memo）；③ 强制刷新。

**避免不必要的渲染：**

- `React.memo` 包裹子组件。
- `useMemo`/`useCallback` 稳定 props。
- 合理拆分组件，状态尽量下沉。

### 8、`useEffect` 与 `useLayoutEffect` 的区别

- `useEffect`：**异步**执行，不阻塞浏览器绘制，适合数据请求、非关键副作用。
- `useLayoutEffect`：在 DOM 更新后、浏览器**绘制前**同步执行，可避免闪烁，适合需要同步读取/修改布局的场景（测量 DOM）。

> 平时优先用 `useEffect`；需要在首屏绘制前完成布局相关操作时用 `useLayoutEffect`。

### 9、React 的 Diff 与 Key

React 采用**同层比较**策略：不同类型元素直接重建；同类型比较 props；列表用 `key` 优化。`key` 不稳定或使用 index 会导致状态错乱或性能下降。

### 10、React 合成事件

React 的事件是**合成事件（SyntheticEvent）**，统一包装了浏览器原生事件，跨浏览器一致。事件绑定通过事件委托（挂在根容器）实现，减少内存占用。

### 11、React 状态管理

- **本地状态**：`useState`/`useReducer`。
- **Context**：跨层级共享，但频繁更新会引发大面积重渲染。
- **Redux / Redux Toolkit**：全局状态，单一数据源，通过 action + reducer 更新，适合大型复杂应用。
- **Zustand**：轻量、基于 Hooks、无样板代码，近年流行。
- **MobX**：基于响应式（类似 Vue），声明式更新。

> 2024+ 趋势：中小应用优先 Zustand，大应用用 Redux Toolkit，避免滥用 Context 导致性能问题。

### 12、React 路由

`react-router-dom` v6：

- `BrowserRouter`（history）/ `HashRouter`。
- 核心：`Routes`、`Route`、`Link`/`NavLink`、`useNavigate`、`useParams`、`useLocation`。
- **懒加载**：`React.lazy` + `Suspense`。
- 路由守卫可通过 `useEffect` 或封装组件实现。

### 13、受控组件与非受控组件

- **受控组件**：表单值由 React state 控制，通过 `value` + `onChange`。
- **非受控组件**：表单值由 DOM 自身维护，用 `ref` 读取。

> 推荐受控组件，可预测且便于校验。

### 14、React 服务端渲染（SSR）/ 框架

- **Next.js**：React 的元框架，支持 SSR/SSG/ISR，路由文件系统式，App Router（Server/Client Components）。
- 优点：SEO 友好、首屏更快。
- 挑战：服务端不能访问 DOM、需处理水合（hydration）。

> 2024+ 高频：Next.js App Router 中 Client/Server Component 的区别、`use client` 指令。

### 15、React 18/19 新特性

- **并发特性**：`startTransition`、`useDeferredValue`（标记非紧急更新）。
- **`useId`**：生成唯一 ID（用于无障碍、label 关联）。
- **自动批处理**：异步/事件中多处 setState 自动合并。
- **Server Components**（19 稳定）：组件在服务端渲染。
- `useOptimistic`、`useFormStatus`、`useActionState` 等新 Hook。

---

## 六、Vue 与 React 对比

### 1、共同点

- 组件化开发。
- 数据驱动视图（声明式 UI）。
- 都使用虚拟 DOM + diff 优化更新。

### 2、不同点

| 对比项 | Vue | React |
| --- | --- | --- |
| 定位 | 渐进式框架，上手简单，提供指令 | 库，更自由，需搭配生态 |
| 模板 | HTML 模板 + 指令 | JSX（JS 语法扩展） |
| 数据 | **响应式**（Proxy），自动追踪 | 显式 setState，需要手动优化 |
| 状态更新 | 自动收集依赖 | 需 `memo`/`useMemo`/`useCallback` 优化 |
| 组件状态 | Options API / Composition API | 函数组件 + Hooks |
| 风格 | 模板语法，声明式更强 | 函数式，更接近 JS |
| 生态 | Pinia/Vue Router | Redux/Zustand/Next.js |

### 3、响应式与状态更新机制的本质差异

- **Vue**：基于 Proxy 的**响应式**，修改数据自动触发依赖更新，开发者心智负担小。
- **React**：`setState` 后**重新执行整个组件函数**，通过 diff 更新，需要开发者主动优化避免多余渲染。

> 一句话：Vue 自动精准更新，React 重新渲染后 diff 收敛。

### 4、如何选择

- 项目/团队熟悉 Vue、需要快速上手、模板语法 → 选 **Vue**。
- 追求灵活、函数式、生态（Next.js 全栈）、大厂环境 → 选 **React**。
- 2024+ 两者都是主流，面试往往要求**至少精通一个 + 了解另一个的对比**。

---

## 七、TypeScript

### 1、TypeScript 是什么，为什么要用

TypeScript 是 JavaScript 的**类型超集**，编译为 JS。提供**静态类型检查**，在编译期发现错误、提升代码可维护性与 IDE 提示。

### 2、基础类型与类型推断

`number/string/boolean/null/undefined/any/unknown/void/never/object/array/tuple/enum`。

- `any`：放弃类型检查（少用）。
- `unknown`：安全的 any，需收窄后才能使用。
- `void`：无返回值。
- `never`：永不返回（抛错/死循环）。
- 元组 `[number, string]`、联合类型 `A | B`、交叉类型 `A & B`。

```ts
let a: number = 1;
type Status = 'success' | 'error';
const s: Status = 'success';
```

### 3、接口（interface）与类型别名（type）

| 对比 | interface | type |
| --- | --- | --- |
| 用途 | 描述对象/函数/类结构 | 任意类型（联合/交叉/映射） |
| 扩展 | 同名自动合并 | 不支持同名合并 |
| 继承 | `extends` | `&` 交叉 |

> 优先用 `interface` 定义对象结构；需要联合/工具类型时用 `type`。

### 4、泛型（Generics）

允许定义类型参数，增强复用性：

```ts
function identity<T>(arg: T): T {
  return arg;
}
// 约束
function getLength<T extends { length: number }>(arg: T): number {
  return arg.length;
}
```

### 5、类型收窄（Narrowing）

通过条件判断让 TS 更精确推断类型：

```ts
function fn(x: string | number) {
  if (typeof x === 'string') {
    return x.toUpperCase(); // 收窄为 string
  }
  return x.toFixed(2); // 收窄为 number
}
```

### 6、内置工具类型（高频）

- `Partial<T>`：全部可选。
- `Required<T>`：全部必选。
- `Readonly<T>`：全部只读。
- `Pick<T, K>`：选取部分属性。
- `Omit<T, K>`：剔除部分属性。
- `Record<K, T>`：构造键值对类型。
- `ReturnType<T>`：取函数返回类型。
- `Parameters<T>`：取函数参数类型。
- `Exclude/Extract`、`NonNullable`。

### 7、`tsconfig.json` 常用配置

`strict`（严格模式，推荐开启）、`target`（编译目标）、`module`、`moduleResolution`、`paths`（路径别名）、`baseUrl`、`esModuleInterop`、`include/exclude`。

### 8、`declare` 与类型声明

为第三方 JS 库或全局变量声明类型：`.d.ts` 文件，使用 `declare module` / `declare global`。`.vue`、图片等资源需声明模块类型才能在 TS 中使用。

---

## 八、工程化与构建

### 1、Webpack 的核心理念

Webpack 是一个**模块打包器**：从入口出发，分析模块依赖，通过 **Loader** 处理非 JS 资源、通过 **Plugin** 扩展功能，最终产出优化后的 bundle。

**核心概念：** `entry`（入口）、`output`（出口）、`module.rules`（loader）、`plugins`、`resolve`（解析）、`optimization`（代码分割/压缩）、`devServer`。

**Loader 与 Plugin 的区别：**

- **Loader**：让 webpack 能加载并转换**非 JS 文件**（`babel-loader`、`ts-loader`、`style-loader`、`css-loader`、`file-loader`、`sass-loader`）。作用于单个文件。
- **Plugin**：扩展 webpack **整体功能**（压缩、代码分割、html 生成、环境注入）。作用范围更广，可影响整个构建流程。

### 2、Webpack 构建流程

1. 初始化参数、实例化 compiler。
2. 从入口开始**解析依赖**，递归构建模块图。
3. 通过 loader 转换模块。
4. 打包输出 chunk / bundle。
5. 优化（压缩、Tree shaking、代码分割）。

### 3、Vite 为什么快（对比 Webpack）

**Webpack 慢的原因：** 修改代码后需要**重新打包整个依赖图**（打包 + 编译），项目越大越慢。

**Vite 的思路：**

- **依赖预构建**：用 esbuild（Go 编写）把第三方依赖预打包为 ESM，秒级完成。
- **源码按需加载**：利用浏览器原生 **ES Modules**，开发时不做整体打包，只对浏览器**请求的模块**做按需转换，启动快、热更新快（HMR 毫秒级）。

**生产构建：** 用 **Rollup**（成熟稳定、支持 tree-shaking/代码分割）。

**Vite 与 Webpack 对比：**

| 对比 | Webpack | Vite |
| --- | --- | --- |
| 开发原理 | 全量打包 | 基于 ESM 按需加载 |
| 启动速度 | 慢 | 快 |
| HMR | 较慢 | 快 |
| 生产构建 | 自带 | 用 Rollup |

> 2024+ 主流新项目基本都用 Vite；面试常问"Vite 为何快"。

### 4、Tree Shaking

**Tree Shaking（摇树）**：打包时移除未使用的代码。前提是使用 **ES Module**（静态导入导出），结合 `sideEffects` 配置与压缩工具实现。Rollup/Webpack 均支持。

### 5、代码分割（Code Splitting）

将代码拆分为多个 chunk，按需加载，减少首屏体积。方式：

- 路由懒加载（动态 `import()`）。
- 手动拆包（`splitChunks`）。
- 第三方库单独 vendor chunk。

### 6、模块化规范

- **CommonJS（CJS）**：`require`/`module.exports`，Node 环境，**同步**加载。
- **ES Module（ESM）**：`import`/`export`，浏览器原生，**静态分析、按需加载**，支持 tree-shaking。
- **AMD/UMD**：历史规范（require.js 等），已少用。

### 7、微前端

将一个大应用拆分为多个**独立开发、独立部署**的小应用，运行时聚合。

**主流方案：**

- **single-spa**：最基础的微前端框架。
- **qiankun（乾坤）**：基于 single-spa，解决样式/JS 隔离，使用方便。
- **Module Federation（webpack 5）**：运行时共享模块。

**核心难点：** 应用隔离（JS 沙箱、样式隔离）、通信机制、路由整合、依赖共享。

> 2024+ 高频：qiankun 的 JS 沙箱原理（Proxy 模拟全局）、样式隔离（scoped/前缀）。

### 8、CI/CD 与部署

- **CI/CD**：持续集成/持续部署。代码提交后自动触发构建、测试、部署。
- 常见平台：GitHub Actions、GitLab CI、Jenkins。
- 前端部署到 **Nginx** 静态服务器 / **CDN** / 云平台。
- SPA history 路由需配置 Nginx fallback；静态资源加 hash 指纹与强缓存。

### 9、代码规范与质量

- **ESLint**：代码规范检查。
- **Prettier**：代码格式化。
- **Husky + lint-staged**：Git 提交前自动检查。
- **TypeScript**：类型约束。
- 单测（Jest/Vitest）、E2E（Playwright/Cypress）。

---

## 九、性能优化

### 1、加载性能优化（首屏/白屏）

**网络层：**

- 减少 HTTP 请求（合并/按需/雪碧图）。
- 强缓存 + 协商缓存、CDN 加速。
- 开启 Gzip/Brotli 压缩、HTTP/2。
- 小图片转 base64、图片压缩/webp 格式、图片懒加载。

**资源层：**

- JS/CSS 压缩、代码分割、Tree shaking。
- 路由/组件懒加载，首屏只加载关键资源。
- `preload`（提前加载关键资源）、`prefetch`（空闲加载后续资源）。
- 第三方库按需引入、`defer`/`async` 处理 `<script>`。

**渲染层：**

- 减少 DOM 层级与重排重绘。
- `requestAnimationFrame` 做动画、`will-change`。
- 大数据列表虚拟滚动。

**框架层：**

- Vue：`keep-alive`、`Object.freeze`、`v-once`、`shallowRef`。
- React：`memo`、`useMemo`、`useCallback`、`React.lazy`。
- 长列表虚拟化。

### 2、运行时性能优化

- 避免内存泄漏（清理定时器/监听器）。
- 防抖节流处理高频事件。
- 优化长任务（拆分任务、`requestIdleCallback`）。
- 减少 `console.log`、DOM 查询缓存。

### 3、如何用工具定位性能问题

- **Chrome DevTools Performance**：录制分析渲染/脚本耗时。
- **Lighthouse**：给出性能/SEO/无障碍评分。
- **Network 面板**：分析资源大小、加载瀑布、阻塞点。
- **React DevTools Profiler / Vue DevTools**：定位组件重渲染。
- **Web Vitals**：`LCP`（最大内容绘制）、`FID/INP`（交互）、`CLS`（布局偏移）。

### 4、Web Vitals 核心指标

- **LCP**：首屏最大元素加载时间（2.5s 内良好）。
- **INP**（替代 FID）：交互到下一次绘制延迟（200ms 内良好）。
- **CLS**：布局偏移累积（0.1 内良好）。
- **FCP**：首次内容绘制。

---

## 十、前端安全

### 1、XSS（跨站脚本攻击）

**原理：** 攻击者注入恶意脚本，用户浏览器执行后被窃取 cookie/token 或篡改页面。

**类型：** 存储型（存服务器）、反射型（URL 参数）、DOM 型。

**防御：**

- 对用户输入做**转义/编码**（HTML 实体）。
- 前端框架默认转义（React/Vue 的 `{{}}` 默认转义）。
- 设置 Cookie `HttpOnly`（JS 无法读取）。
- CSP（内容安全策略）限制可加载的脚本来源。
- 对富文本等需慎用 `v-html`/`dangerouslySetInnerHTML`。

### 2、CSRF（跨站请求伪造）

**原理：** 攻击者诱导用户点击，利用用户已登录的 Cookie 向目标站点发起请求。

**防御：**

- 校验 `Referer`/`Origin`。
- 使用 **CSRF Token**（请求携带服务端签发的随机 token）。
- Cookie 设置 `SameSite`。
- 双重 Cookie 校验。

### 3、SQL 注入与点击劫持

- **SQL 注入**：拼接 SQL 导致被注入恶意语句。防御：参数化查询/预编译、白名单校验。
- **点击劫持**：透明 iframe 覆盖诱导点击。防御：设置 `X-Frame-Options`、`frame-ancestors`。

### 4、其他安全实践

- 传输加密：HTTPS。
- 敏感信息不硬编码在前端。
- 文件上传校验类型与大小、限制执行。
- 依赖漏洞扫描（`npm audit`）。
- CSP、`SRI`（子资源完整性）等响应头加固。

---

## 十一、设计模式

### 1、常见设计模式（前端视角）

- **单例模式**：全局只有一个实例（如 `window`、状态管理 store、Toast/Message 组件）。
- **工厂模式**：通过工厂函数/类统一创建对象，隐藏创建细节。
- **观察者模式 / 发布订阅模式**：对象状态变化时通知订阅者。Vue 响应式、事件总线、浏览器事件都基于此。
- **代理模式**：为对象提供代理以拦截访问（Vue3 Proxy、图片懒加载占位）。
- **装饰器模式**：动态增强功能（高阶组件 HOC、Vue 指令、`@Decorator`）。
- **策略模式**：将算法封装并灵活替换（表单校验、动画缓动、支付方式）。

### 2、观察者模式 vs 发布订阅模式

- **观察者模式**：观察者与被观察者**直接关联**（Vue 的 Dep/Watcher）。
- **发布订阅模式**：通过**事件中心**解耦（EventEmitter/mitt），发布者与订阅者互不感知。

### 3、单例模式示例

```js
class Singleton {
  static instance;
  constructor() {
    if (Singleton.instance) return Singleton.instance;
    Singleton.instance = this;
  }
}
```

### 4、代理模式示例（实现缓存/拦截）

```js
const handler = {
  get(target, key) {
    if (key === 'secret') return undefined;
    return target[key];
  },
};
const proxy = new Proxy(target, handler);
```

---

## 十二、高频手写题

> 手写题是 2024+ 面试的"必考"部分，重点在于**边界处理与思路清晰**。

### 1、手写 `new`

```js
function myNew(Ctor, ...args) {
  const obj = Object.create(Ctor.prototype);
  const res = Ctor.apply(obj, args);
  return (res && typeof res === 'object') || typeof res === 'function' ? res : obj;
}
```

### 2、手写 `instanceof`

```js
function myInstanceof(target, origin) {
  if (typeof target !== 'object' || target === null) return false;
  let proto = Object.getPrototypeOf(target);
  while (proto) {
    if (proto === origin.prototype) return true;
    proto = Object.getPrototypeOf(proto);
  }
  return false;
}
```

### 3、手写 `call/apply/bind`

```js
Function.prototype.myCall = function (ctx, ...args) {
  ctx = ctx ?? window;
  const key = Symbol();
  ctx[key] = this;
  const res = ctx[key](...args);
  delete ctx[key];
  return res;
};
Function.prototype.myApply = function (ctx, arr) {
  ctx = ctx ?? window;
  const key = Symbol();
  ctx[key] = this;
  const res = Array.isArray(arr) ? ctx[key](...arr) : ctx[key]();
  delete ctx[key];
  return res;
};
Function.prototype.myBind = function (ctx, ...args) {
  const fn = this;
  return function (...rest) {
    return fn.apply(ctx, [...args, ...rest]);
  };
};
```

### 4、手写防抖 / 节流

```js
function debounce(fn, delay = 300) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}
function throttle(fn, interval = 300) {
  let last = 0;
  return function (...args) {
    const now = Date.now();
    if (now - last >= interval) {
      last = now;
      fn.apply(this, args);
    }
  };
}
```

### 5、手写深拷贝

```js
function deepClone(obj, map = new WeakMap()) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof RegExp) return new RegExp(obj);
  if (map.has(obj)) return map.get(obj);
  const clone = Array.isArray(obj) ? [] : {};
  map.set(obj, clone);
  for (const key of Object.keys(obj)) clone[key] = deepClone(obj[key], map);
  return clone;
}
```

### 6、手写 `Promise.all`

```js
Promise.myAll = function (promises) {
  return new Promise((resolve, reject) => {
    if (!promises || !promises[Symbol.iterator]) return reject(new TypeError('not iterable'));
    if (promises.length === 0) return resolve([]);
    const results = [];
    let count = 0;
    promises.forEach((p, i) => {
      Promise.resolve(p).then(
        (v) => {
          results[i] = v;
          if (++count === promises.length) resolve(results);
        },
        reject
      );
    });
  });
};
```

### 7、手写 `Promise.race`

```js
Promise.myRace = function (promises) {
  return new Promise((resolve, reject) => {
    for (const p of promises) Promise.resolve(p).then(resolve, reject);
  });
};
```

### 8、手写数组扁平化

```js
function flat(arr, depth = 1) {
  if (depth === 0) return arr;
  return arr.reduce(
    (acc, cur) => acc.concat(Array.isArray(cur) ? flat(cur, depth - 1) : cur),
    []
  );
}
```

### 9、手写柯里化

```js
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) return fn.apply(this, args);
    return (...rest) => curried.apply(this, [...args, ...rest]);
  };
}
```

### 10、手写 `Object.create`

```js
function myCreate(proto) {
  function F() {}
  F.prototype = proto;
  return new F();
}
```

### 11、手写发布订阅（EventEmitter）

```js
class EventEmitter {
  constructor() { this.events = {}; }
  on(name, cb) { (this.events[name] ||= []).push(cb); }
  emit(name, ...args) { (this.events[name] || []).forEach((cb) => cb(...args)); }
  off(name, cb) {
    if (!cb) delete this.events[name];
    else this.events[name] = (this.events[name] || []).filter((f) => f !== cb);
  }
  once(name, cb) {
    const wrapper = (...args) => { cb(...args); this.off(name, wrapper); };
    this.on(name, wrapper);
  }
}
```

### 12、手写数组去重

```js
// Set
[...new Set(arr)];
// 对象键（保留类型）
arr.filter((v, i, a) => a.indexOf(v) === i);
```

### 13、手写节流/防抖变体（防抖立即执行版）

```js
function debounceImmediate(fn, delay = 300) {
  let timer;
  let immediate = true;
  return function (...args) {
    if (immediate) { fn.apply(this, args); immediate = false; }
    clearTimeout(timer);
    timer = setTimeout(() => { immediate = true; }, delay);
  };
}
```

---

## 十三、场景题与软技能

### 1、常见场景题

- **实现一个轮询 / 长连接 / WebSocket 断线重连**。
- **大文件分片上传 + 断点续传**（切片、`progress`、服务端合并）。
- **实现虚拟滚动（仅渲染可视区）**。
- **实现一个 Promise 控制并发数**（如最多同时 5 个请求）。
- **设计一个防抖搜索框**（debounce + 取消过期请求）。
- **移动端适配**（`rem`/`vw` + `viewport`、`postcss-pxtorem`）。
- **实现主题切换**（CSS 变量 + `data-theme`）。
- **埋点/性能上报**（`sendBeacon`、`performance`）。
- **实现一个懒加载图片**（`IntersectionObserver`）。

### 2、手写"控制 Promise 并发"

```js
async function concurrencyLimit(tasks, limit) {
  const results = [];
  let index = 0;
  const workers = Array.from({ length: limit }, async () => {
    while (index < tasks.length) {
      const i = index++;
      results[i] = await tasks[i]();
    }
  });
  await Promise.all(workers);
  return results;
}
```

### 3、项目难点 / 亮点怎么讲（STAR 法则）

按 **S（背景）→ T（任务）→ A（行动）→ R（结果）** 组织，突出**难点、你的思考、最终量化结果**。示例思路：

- 首屏优化：把 LCP 从 3s 降到 1.5s（懒加载 + 缓存 + 代码分割）。
- 大数据列表：用虚拟滚动支撑 10 万条数据流畅渲染。
- 状态管理重构：从 Vuex/Redux 迁移到 Pinia/Zustand，减少样板代码。
- 微前端改造：qiankun 拆分应用，实现独立部署。
- 全栈/工程化：搭建 CI/CD、接入 ESLint/单测，提升团队交付效率。

### 4、谈一谈你对前端未来的理解

- **AI 辅助开发**：AI 编码工具（如 CodeBuddy）提升开发效率，前端要掌握"如何把需求拆解给 AI + 如何审查 AI 产物"。
- **全栈化**：Next.js/边缘函数/Serverless 让前端能处理更多后端逻辑。
- **性能与体验**：Web Vitals、Core Web Vitals 成为硬指标。
- **跨端**：React Native、Flutter、小程序多端统一。
- **工程化与质量**：类型安全、测试、可观测性成为标配。

---

> **总结建议：**
> 面试前按"**基础原理 → 框架 → 工程化 → 性能 → 安全 → 手写 → 场景**"的路径系统复习，结合本笔记的**高频手写题**多敲几遍，并把每个知识点都能**结合自己的项目经历**讲出来，往往比死记硬背更打动面试官。






