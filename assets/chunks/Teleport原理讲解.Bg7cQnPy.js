const n=`# Teleport原理讲解

在 Vue 3 中，**\`<Teleport>\`**（传送门）是另一个非常实用的内置组件。

如果用一句话总结它的使命，那就是：**“逻辑上留在原地，物理上穿梭出去。”**


## 一、 解决什么真实痛点？

在没有 \`<Teleport>\` 之前，我们在父组件里写一个嵌套极深的模态框（Modal）或抽屉（Drawer）时，DOM 结构往往是层层嵌套的：

\`\`\`html
<!-- 父组件 App.vue -->
<div class="page-container" style="position: relative; overflow: hidden; z-index: 1;">
  <div class="sidebar">...</div>
  <div class="content">
    <!-- 嵌套在深处的弹窗组件 -->
    <div class="modal">我是弹窗</div>
  </div>
</div>

\`\`\`

**这会引发极具破坏性的 CSS 样式灾难：**

1. **\`overflow: hidden\` 截断**：如果父级元素设置了 \`overflow: hidden\`，弹窗内容超出父级部分就会被尴尬地裁切掉。
2. **\`z-index\` 层叠上下文（Stacking Context）失效**：即使给 \`.modal\` 设置了 \`z-index: 9999\`，只要它的某个祖先元素的 \`z-index\` 很低，或者带有 \`transform\` / \`filter\` 属性，这个弹窗就永远被压在最底下，无法盖住全屏。


## 二、 Teleport 的优雅解法

通过 \`<Teleport to="body">\`，我们可以把组件写在业务逻辑最顺手的地方，而它的**真实 DOM 节点却会被瞬间“传送”到 \`<body>\` 或任意指定的 DOM 节点下**：

\`\`\`html
<!-- 深层组件内部 -->
<template>
  <button @click="open = true">打开弹窗</button>

  <!-- 逻辑上依然在这个组件里，共享响应式状态 open -->
  <!-- 物理上它的 DOM 会被直接渲染并挂载到 <body> 标签下 -->
  <Teleport to="body">
    <div v-if="open" class="modal-backdrop">
      <div class="modal-content">
        <p>我是不受任何父级 z-index 或 overflow 限制的全屏弹窗！</p>
        <button @click="open = false">关闭</button>
      </div>
    </div>
  </Teleport>
</template>

\`\`\`


## 三、 底层实现原理

\`<Teleport>\` 的底层实现并不神秘，它的核心在于 **Vue 渲染器（Renderer）对其赋予的“特殊挂载逻辑”**。

在 Vue 3 源码中，\`<Teleport>\` 被定义为一个带有特殊标识（\`__isTeleport: true\`）的**内部系统对象**，渲染器在进行虚拟 DOM (VNode) 的 \`patch\`（打补丁/挂载）操作时，一旦识别到这个标识，就会**绕过标准的父子 DOM 挂载流程**。

### 1. 核心流程 3 步走

\`\`\`
[ 渲染器 Patch 阶段 ]
         │
  识别到 Teleport VNode
         │
  ┌──────┴────────────────────────────────────────┐
  ▼                                               ▼
【1. 寻求物理目标 (Target)】                     【2. 挂载锚点 (Anchors)】
使用 document.querySelector(to)                  在组件原位置插入“隐形”
寻找目标挂载节点 (如 body)                       注释节点 (Comment VNode)
  │                                               │
  └──────────────────────┬────────────────────────┘
                         │
                         ▼
             【3. 改变挂载宿主 (Mount)】
             将子节点的真实 DOM 直接插入到
             物理目标节点 (Target) 内部

\`\`\`

#### 第 1 步：解析物理目标节点（Target Query）

当 \`<Teleport to="#target">\` 挂载时，Vue 会首先解析 \`to\` 属性。

* 如果 \`to\` 是字符串（如 \`"body"\`、\`"#modal-container"\`），Vue 内部会调用原生的 \`document.querySelector(to)\` 去获取真实的宿主 DOM 元素。
* 如果 \`to\` 动态改变了，Vue 内部会触发 \`move\` 逻辑，把已生成的真实 DOM 整体“搬家”到新的宿主节点下。

#### 第 2 步：原位留下“隐形锚点”（Comment Nodes）

虽然 DOM 节点被搬走了，但 Vue 的虚拟 DOM 树依然需要维持原有的组件层级关系。
Vue 会在 \`<Teleport>\` **原本所在的父组件 DOM 位置**，插入两个“隐形”的原生 DOM 注释节点（Comment Node），作为占位锚点：

* \`<!--teleport start-->\`
* \`<!--teleport end-->\`

> **这两个占位符有什么用？**
> 1. **确定组件位置**：将来如果 Teleport 组件被销毁（\`unmount\`），或者要插入兄弟节点，Vue 能精确知道它在原逻辑树上的位置。
> 2. **更新与卸载**：Vue 只需要沿着这两个锚点找到 Teleport 的 VNode，就能顺藤摸瓜找到被传送到了远端的目标 DOM。
>
>

#### 第 3 步：改变宿主，将真实 DOM 插入远端

标准的 Vue 组件在创建完真实 DOM 后，会调用 \`parent.appendChild(child)\` 插入到父级 DOM 中。

而 \`<Teleport>\` 重写了这个挂载函数：**它直接将创建好的子 DOM 节点调用 \`target.appendChild(child)\`，强制插入到第 1 步寻找到的物理目标节点（如 \`document.body\`）中。**


## 四、 关键细节解析

理解了底层挂载逻辑后，有 3 个经常让人困惑的细节就迎刃而解了：

### 1. 逻辑关系不变（组件通信完全不受影响）

虽然 DOM 被传送到几万米以外的 \`<body>\` 下了，但**它依然是当前 Vue 组件树上的合法子节点**：

* 属性传参（\`Props\`）、自定义事件（\`Emits\`）依然像普通组件一样正常工作。
* \`provide\` / \`inject\` 依赖注入依然可以跨越 Teleport 正常向上查找。
* 在 Vue Devtools 中观察，它的组件层级结构依然留在原处。

> **原理**：因为 Vue 的响应式系统和组件实例树（Component Internal Instance Tree）是独立于真实 DOM 结构的。逻辑层面的父子关系在 Virtual DOM 建立时就已经绑定好了。


### 2. 事件冒泡（Event Bubbling）机制

如果我在被 Teleport 传送出去的弹窗里点击了一个按钮，父组件上绑定的 \`@click\` 能够捕获到这个点击事件吗？

* **Vue 合成事件 / 组件事件**：**可以正常冒泡！**
因为 Vue 组件的事件冒泡是沿着虚拟 DOM / 组件树（VNode Tree）向上向上传递的，不受真实 DOM 结构影响。
* **原生 DOM 事件（如直接在父 DOM 上使用 \`addEventListener\`）**：**无法冒泡到原父 DOM。**
因为原生 DOM 事件冒泡严格遵循真实 DOM 的祖先路径（\`button\` ➔ \`.modal\` ➔ \`body\` ➔ \`document\`）。


### 3. 禁用传送（\`disabled\` 属性）

\`<Teleport>\` 支持一个 \`disabled\` 属性：

\`\`\`html
<Teleport to="body" :disabled="isMobile">
  <div class="dialog">...</div>
</Teleport>

\`\`\`

当 \`disabled="true"\` 时，Vue 会**跳过改变挂载宿主的步骤**，直接把子 DOM 渲染并挂载在原来的锚点位置（即普通组件的默认挂载行为）。这在响应式移动端/桌面端适配时极其方便。


## 五、 总结对比

| 维度 | 普通 Vue 组件 | \`<Teleport>\` 组件 |
| --- | --- | --- |
| **逻辑层级 (VNode)** | 属于当前父组件 | 属于当前父组件 |
| **物理层级 (DOM)** | 严格嵌套在父组件 DOM 内部 | 挂载到 \`to\` 指定的远端 DOM (如 \`body\`) |
| **原位占位** | 无特殊占位 | 原位留下 \`<!--teleport-->\` 注释节点锚点 |
| **核心用途** | 构建基本 UI 页面结构 | 脱离父级 CSS 限制（全屏 Modal、Notification、Tooltip 等） |

简单来说，\`<Teleport>\` 的原理就是：**Vue 帮你管着逻辑，但在挂载 DOM 时，偷偷把 \`parent.appendChild\` 换成了 \`target.appendChild\`。**
`;export{n as default};
