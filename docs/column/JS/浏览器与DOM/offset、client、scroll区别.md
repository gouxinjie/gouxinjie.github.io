
# offset、client、scroll区别

[[toc]]

在前端开发中，`offset`、`client` 和 `scroll` 是三组极易混淆的 DOM 尺寸与位置属性。它们的主要区别在于：**包含的区域范围（是否包含边框、滚动条、内边距）不同**，以及**用途各异**。


### 一、 核心三要素对比

| 属性前缀 | 包含区域范围 | 核心用途 | 是否包含滚动条？ | 是否只读？ |
| --- | --- | --- | --- | --- |
| **`offset`** | 内容 (content) + 内边距 (padding) + **边框 (border)** + 滚动条 | 获取元素的**实际物理可视外尺寸**及偏移位置 | **包含** | 只读 |
| **`client`** | 内容 (content) + 内边距 (padding) | 获取元素的**内部可视区域大小**（不含边框） | **不包含** | 只读 |
| **`scroll`** | **实际总内容 (含溢出未显示部分)** + 内边距 (padding) | 获取元素的**整体滚动内容大小**及当前滚动距离 | **不包含** | `scrollLeft/scrollTop` **可读写**，其余只读 |


### 二、 尺寸属性解析（Width / Height）

假设某个 HTML 元素的 `width`、`padding`、`border` 和 `overflow: scroll` 属性均已设置：

#### 1. `offsetWidth` / `offsetHeight` (外尺寸)

* **计算公式**：`width + padding(左右) + border(左右) + 垂直滚动条宽度`
* **应用场景**：获取元素在页面中实际占用的真实空间大小（包括边框与滚动条）。

#### 2. `clientWidth` / `clientHeight` (内尺寸)

* **计算公式**：`width + padding(左右) - 垂直滚动条宽度`
* **应用场景**：计算元素内部“真正能给内容显示”的区域大小（如获取视口/容器可容纳内容的宽高度）。

#### 3. `scrollWidth` / `scrollHeight` (实际内容总尺寸)

* **计算公式**：
* 无溢出滚动时：通常等于 `clientWidth`（即 `width + padding`）。
* 有溢出滚动时：等于 `内部所有子元素撑开的总真实大小 + padding`。


* **应用场景**：判断内容是否超出容器产生滚动条，或动态设置展开/收起组件的全量高度。


### 三、 位置属性解析（Top / Left / Parent）

除了宽高尺寸，三者对应的位置属性差异更为关键：

#### 1. `offsetLeft` / `offsetTop`

* **含义**：当前元素外边框相对于其定位父元素（`offsetParent`）内边框的偏移距离。
* **注意**：`offsetParent` 是指离当前元素最近的具有定位属性（`relative` / `absolute` / `fixed`）的祖先元素。

#### 2. `clientLeft` / `clientTop`

* **含义**：元素的内边距边缘（padding-box）相对于外边框边缘（border-box）的距离。
* **本质**：**就是上边框 `border-top` 和左边框 `border-left` 的宽度**。若存在左侧滚动条（如阿拉伯语阿拉伯文等 RTL 布局），`clientLeft` 会加上滚动条宽度。

#### 3. `scrollLeft` / `scrollTop`

* **含义**：元素内容顶部/左侧被卷去（向上/向左滚动超出视口）的像素距离。
* **特点**：**这是三组属性中唯一可修改（可写）的属性**。修改 `element.scrollTop = 0` 可以直接将滚动条重置回顶部。


### 四、 代码实例与常见使用场景

```javascript
const box = document.getElementById('myBox');

// 场景 1：获取页面视口/窗口的宽度（不含滚动条）
const viewportWidth = document.documentElement.clientWidth;

// 场景 2：判断一个元素是否出现了垂直滚动条
const hasScroll = box.scrollHeight > box.clientHeight;

// 场景 3：判断元素是否已经滚动到底部
const isAtBottom = Math.ceil(box.scrollTop + box.clientHeight) >= box.scrollHeight;

// 场景 4：实现“回到顶部”的平滑滚动
function scrollToTop(element) {
  element.scrollTop = 0; // 修改 scrollTop 实现滚动位置重置
}

```
