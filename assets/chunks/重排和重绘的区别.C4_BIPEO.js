const n=`# 前端重排和重绘的区别

[[toc]]

## 一、什么是重排（Reflow）和重绘（Repaint）

浏览器渲染页面的核心流程为：**解析 HTML 生成 DOM 树 → 解析 CSS 生成 CSSOM 树 → DOM + CSSOM 合成渲染树 → 布局（Layout）→ 绘制（Paint）→ 合成（Composite）**。

- **重排（Reflow / Layout）**：当元素的**几何属性**（位置、尺寸）发生变化，浏览器需要重新计算元素的几何信息，这个过程叫重排。重排一定会触发后续的重绘。
- **重绘（Repaint）**：当元素的**外观样式**（颜色、背景、阴影等）发生变化，但不影响布局时，浏览器只需要重新绘制受影响的部分，不需要重新计算布局。

简单记忆：

\`\`\`
重排 = 重新布局 + 重新绘制  （成本高）
重绘 = 只重新绘制          （成本低）
\`\`\`

## 二、什么操作会触发重排

任何影响元素**几何信息**的操作都会引起重排：

### 2.1 DOM 操作

| 操作 | 说明 |
|------|------|
| 添加/删除可见 DOM 元素 | 改变文档流 |
| 改变元素位置 | \`top\`、\`left\`、\`margin\`、\`padding\` 等 |
| 改变元素尺寸 | \`width\`、\`height\`、\`border\` |
| 改变元素内容 | 文本变化影响尺寸 |
| 改变字体大小 | 影响行高和容器尺寸 |

### 2.2 读取特定属性

以下属性的读取会**强制同步重排**（因为浏览器需要返回最新值）：

\`\`\`js
// 读取这些属性会强制刷新渲染队列（Forced Synchronous Layout）
element.offsetTop / offsetLeft / offsetWidth / offsetHeight
element.scrollTop / scrollLeft / scrollWidth / scrollHeight
element.clientTop / clientLeft / clientWidth / clientHeight
element.getComputedStyle()
element.getBoundingClientRect()
\`\`\`

### 2.3 其他触发场景

- 浏览器窗口尺寸改变（\`resize\`）
- 修改 \`display: none\` ↔ \`display: block\`
- \`:hover\` 伪类触发的尺寸变化
- 获取 \`getComputedStyle()\` 计算后的样式值

## 三、什么操作只会触发重绘

只改变**视觉表现**但不影响几何信息的操作：

\`\`\`css
/* 以下属性修改只会触发重绘 */
color
background / background-color
visibility
outline / outline-color
box-shadow（部分浏览器）
border-radius
text-decoration
\`\`\`

需要注意的是：\`visibility: hidden\` 只触发重绘，而 \`display: none\` 会触发重排。

## 四、减少重排的优化策略

### 4.1 批量读写操作

**错误做法**（多次重排）：

\`\`\`js
// 读写交替，每次都会触发重排
const h1 = document.querySelector('h1')
h1.style.width = '100px'       // 写
console.log(h1.offsetHeight)   // 读（强制重排）
h1.style.height = '200px'      // 写（再次重排）
console.log(h1.offsetWidth)    // 读（再次强制重排）
\`\`\`

**正确做法**（先读后写）：

\`\`\`js
// 批量读取，再批量写入（只触发一次重排）
const h1 = document.querySelector('h1')
const height = h1.offsetHeight   // 读
const width = h1.offsetWidth     // 读
h1.style.width = '100px'         // 写
h1.style.height = '200px'        // 写
\`\`\`

### 4.2 使用 class 代替内联样式

\`\`\`js
// ❌ 多次 style 修改 → 多次重排
element.style.width = '100px'
element.style.height = '200px'
element.style.margin = '10px'

// ✅ 一次 class 切换 → 一次重排
element.className = 'new-layout'
\`\`\`

### 4.3 离线 DOM 操作

使用 \`DocumentFragment\` 或先 \`display: none\` 再操作：

\`\`\`js
// 使用 DocumentFragment（不会引起页面重排）
const fragment = document.createDocumentFragment()
for (let i = 0; i < 100; i++) {
  const li = document.createElement('li')
  li.textContent = \`item \${i}\`
  fragment.appendChild(li)
}
document.querySelector('ul').appendChild(fragment)  // 一次性插入，一次重排
\`\`\`

\`\`\`js
// 先隐藏再操作
const ul = document.querySelector('ul')
ul.style.display = 'none'   // 离开文档流，不会触发后续重排
// ... 大量 DOM 操作
ul.style.display = 'block'  // 恢复，只触发一次重排
\`\`\`

### 4.4 脱离文档流

对于频繁变动的元素，使用 \`position: absolute\` 或 \`position: fixed\` 让其脱离文档流，这样它的变化不会影响其他元素。

### 4.5 动画使用 transform 和 opacity

\`\`\`css
/* ❌ 改变 left/top → 触发重排 */
.element {
  transition: left 0.3s;
}

/* ✅ 使用 transform → 只触发合成，不触发重排/重绘 */
.element {
  transition: transform 0.3s;
}
\`\`\`

\`transform\` 和 \`opacity\` 在 GPU 合成层上处理，不会触发重排和重绘，性能最优。

### 4.6 节流 resize / scroll

\`\`\`js
let ticking = false
window.addEventListener('resize', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      // 执行操作
      ticking = false
    })
    ticking = true
  }
})
\`\`\`

## 五、性能对比

\`\`\`
从高到低的渲染成本：

重排（Reflow）          >  重绘（Repaint）  >  合成（Composite）
    ↓                           ↓                  ↓
触发几何重新计算            只重新绘制像素      仅 GPU 合成层变化
影响周围所有元素            只影响自己          transform / opacity
\`\`\`

| 属性 | 触发 |
|------|------|
| \`width\`、\`height\`、\`left\`、\`margin\`、\`padding\`、\`font-size\` | 重排 |
| \`color\`、\`background\`、\`visibility\`、\`box-shadow\` | 重绘 |
| \`transform\`、\`opacity\` | 仅合成（最优） |

## 六、总结

1. **重排必定引起重绘，重绘不一定引起重排**
2. 减少重排的核心思路：**批量操作、离屏修改、缓存读取值**
3. 高频动画优先使用 \`transform\` + \`opacity\`，避免 \`left\`/\`top\`/\`width\` 等
4. 谨慎在循环中读写 DOM 属性，规避强制同步布局
`;export{n as default};
