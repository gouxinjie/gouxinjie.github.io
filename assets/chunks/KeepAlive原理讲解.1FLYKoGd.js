const n=`# KeepAlive原理讲解


Vue 中的 \`<KeepAlive>\` 是一个**内置抽象组件**（Abstract Component），它本身不会渲染具体的 DOM 节点，也不体现在父子组件链中。它的核心功能是在组件切换时**缓存组件的虚拟 DOM（VNode）及真实 DOM 节点**，避免重复创建和销毁消耗性能。

## 一、核心原理拆解

### 1. 内部缓存机制与 LRU 策略

\`<KeepAlive>\` 内部维护了两个核心数据结构：

* **\`cache\` 映射**：存储组件标识 \`key\` 到组件实例 / VNode 的映射关系。
* **\`keys\` 集合/队列**：记录 \`key\` 的访问顺序，用于实现 **LRU（Least Recently Used，最近最少使用）** 缓存淘汰算法。

当设置了 \`max\` 属性且缓存数量达到上限时，\`<KeepAlive>\` 会删除最久未访问的组件实例，并调用其真正的销毁逻辑（\`unmount\`）。

### 2. 渲染拦截与 VNode 复用

在 \`<KeepAlive>\` 的 \`render\` / \`setup\` 处理流程中：

1. **提取子节点**：获取默认插槽（\`slots.default\`）中的第一个子组件 VNode。
2. **规则匹配**：检测组件名称是否匹配 \`include\` / \`exclude\`。若不匹配，直接返回原 VNode，不走缓存。
3. **缓存命中**：
* **未命中**：将该 VNode / 组件实例存入 \`cache\`，并将其 \`key\` 压入 \`keys\` 队列尾部（表示最新使用）。
* **已命中**：直接复用已有组件实例 \`vnode.component = cachedVNode.component\`，并将 \`key\` 更新到 \`keys\` 队列的最新位置。


4. **设置标记**：为 VNode 标记特殊标识（如 Vue 3 的 \`ShapeFlags.COMPONENT_KEPT_ALIVE\`），指示渲染器在卸载该节点时“只隐藏不销毁”。

### 3. DOM 节点的保留与挂载

在 Vue 的渲染器（Renderer）层面，\`<KeepAlive>\` 的组件挂载与卸载逻辑被重写：

* **失活（Deactivate）**：当切出缓存组件时，渲染器不会销毁它，而是将其对应的真实 DOM 转移到一个**在内存中挂载的隐藏容器**中，同时触发组件的 \`deactivated\` 生命周期钩子。
* **激活（Activate）**：当再次切回该组件时，渲染器直接将内存中已有的 DOM 节点重新插入到目标父容器中，同时触发 \`activated\` 生命周期钩子，绕过了重新创建组件和重新渲染 DOM 的开销。


## 二、简单案例描述

为了简单易懂，我把那些专业的术语（比如“VNode”、“LRU 算法”）全部抛开，用**一个现实生活中的“展柜”例子**来通俗解释：


### 1. 传统组件 vs \`<KeepAlive>\` 组件

* **传统组件（不加 KeepAlive）**：
就像**现场砌砖造房子**。
当你切到 Tab B 时，Tab A 这栋房子会被**直接强拆**（触发 \`unmounted\` 销毁）；
当你再切回 Tab A 时，又必须**重新从打地基开始建房子**（触发 \`created\`/\`mounted\`），之前里面住的人、填的数据全部清空。
* **加了 \`<KeepAlive>\` 的组件**：
就像**把整个房子放进了一个“保鲜后台”**。
当你切到 Tab B 时，Tab A 的房子**不拆**，只是搬到了一个“看不见的后台仓库”藏起来（触发 \`deactivated\`）；
当你切回 Tab A 时，直接把整个房子**从仓库搬回前台**（触发 \`activated\`），里面的输入框文字、滚动位置、组件状态**完好无损**。


### 2. Vue 在底层具体做了什么？（三步走）

为了做到这一点，Vue 内部只做了 3 件事：

1. **准备一个小本本和一个仓库**：
* **仓库（cache 缓存）**：用来存那些不需要强拆的组件实例（以及它们的真实 DOM 节点）。
* **小本本（keys 队列）**：记录谁最近被使用过。如果规定仓库最多只能装 3 个组件，当进第 4 个时，就把最久没用过的那个**彻底扔掉强拆**（这就是 LRU 淘汰机制）。


2. **拦截“销毁”动作**：
* 正常情况下，切换掉组件时 Vue 会调用 \`unmount()\` 销毁 DOM。
* 但如果外面套了 \`<KeepAlive>\`，Vue 看到标记后，就会改用 \`deactivate()\`：**把组件的 DOM 节点从当前页面拔下来，塞进内存隐藏容器里**，组件实例依然活着。


3. **重新切回时直接“粘贴”**：
* 当你再次切换回这个组件时，Vue 先去仓库里找。
* 找到了！直接把刚才藏在内存里的 DOM 节点**重新插入到页面上**，省去了重新渲染、重新调接口、重新初始化变量的所有时间。

### 3. 一张图对比生命周期

\`\`\`text
【不加 KeepAlive 的切换流程】
进入组件 A ➔ [ created ] ➔ [ mounted ] (显示)
离开组件 A ➔ [ unmounted ] (彻底销毁，状态丢失)

【加了 KeepAlive 的切换流程】
首次进入 A ➔ [ created ] ➔ [ mounted ] ➔ [ activated ] (显示)
离开组件 A ➔ [ deactivated ] (不销毁！藏进仓库)
再次切回 A ➔ [ activated ] (从仓库直接拿出来，状态完好)

\`\`\`

通过这种方式，\`<KeepAlive>\` 既节省了 DOM 创毁的性能消耗，又保留了用户的页面输入状态。


## 三、 核心三大疑问深度拆解

### 疑问 1：DOM 是怎么“缓存到内存中”的？

在浏览器中，**DOM 节点本质上就是普通的 JavaScript 对象**。

根据 JavaScript 的**垃圾回收（GC）机制**：只要一个对象还被某个变量引用着，垃圾回收器就不会销毁它。

\`<KeepAlive>\` 内部维护了一个 \`cache\` 映射（Map）：

\`\`\`javascript
// 1. 假设这是你的组件 DOM
const myComponentDom = document.createElement('div');
myComponentDom.innerHTML = '<input value="用户输入的内容">';

// 2. 页面切走了，正常情况下会执行 removeChild 销毁：
// parent.removeChild(myComponentDom); // 如果没有变量引用它，就被垃圾回收了

// 3. KeepAlive 的做法：把它存到一个对象（Map）里！
const cache = new Map();
cache.set('MyComponent', myComponentDom); // 👈 关键：建立引用！

// 4. 从页面移除，但因为它在 cache 映射里被引用着，它依然保存在内存中
myComponentDom.remove();
\`\`\`

在 Vue 中，\`<KeepAlive>\` 组件内部有一个 cache 对象。当组件“失活”时，Vue 只是执行了 parent.removeChild(el) 把 DOM 从页面树上拔下来，但这个 el（真实 DOM）一直被 Vue 的缓存 Map 引用着。所以它全貌（包括内部的绑定事件、状态数据）都安安静静地躺在内存里。

**结论**：Vue 并没有什么魔术，它只是用一个 Map 变量“强行引用”了组件实例和真实 DOM 节点，阻止了浏览器的垃圾回收。

---

### 疑问 2：重新插入 DOM 时，难道不需要渲染吗？

**答案是：需要渲染，但开销相差了上百倍！**

我们把一个组件呈现在屏幕上拆分为两个阶段：

1. **【JS 计算与 DOM 创建阶段】**（大头消耗）
2. **【浏览器重排重绘阶段】**（渲染绘制）

对比一下两者的差异：

| 阶段 / 行为 | 普通切换（重新新建） | KeepAlive 切换（复用缓存） |
| --- | --- | --- |
| **JS 数据初始化** | 执行 \`setup()\` / \`data()\`，重新初始化变量 | **跳过** ⚡ |
| **网络请求** | 重新发送 API 请求获取数据 | **跳过** ⚡ |
| **生成 VNode** | 重新运行 \`render()\`，构建整棵 VNode 树 | **跳过**（复用缓存的 VNode） ⚡ |
| **创建 DOM** | 递归调用 \`document.createElement\` 造 DOM | **跳过** ⚡ |
| **绑定事件** | 重新绑定各种 \`addEventListener\` | **跳过** ⚡ |
| **插入 DOM 树** | 将新造好的 DOM 插入页面 | **仅执行 \`parent.appendChild(el)**\` |
| **浏览器绘制** | Layout & Paint（重排重绘） | Layout & Paint（重排重绘） |

**结论**：\`<KeepAlive>\` 重新插入 DOM 时，彻底省去了最昂贵的 **“JS 计算与 DOM 从零构建”** 过程，仅保留了极轻量的“已有 DOM 节点搬家”**和**“浏览器绘制”。

---

### 疑问 3：滚动条的位置为什么能保留？

滚动条保留的真相，需要分为两种场景来看：

#### 场景 A：组件内部的容器滚动（如 \`<div class="scroll-box">\`）

* **原理**：滚动条的当前位置，本质上是该 DOM 节点的 \`scrollTop\` 和 \`scrollLeft\` **属性值**。
* **过程**：因为整个 DOM 节点被完整保存在内存中，它的 \`scrollTop\` 属性并没有被重置。当该 DOM 被重新 \`appendChild\` 挂载回页面时，浏览器渲染它时会直接读取原本的 \`scrollTop\`，因此滚动位置丝毫不变。

#### 场景 B：最外层浏览器窗口滚动（\`window\` / \`document.body\`）

* **原理**：当组件 DOM 从 \`body\` 拔下时，页面变矮，\`window\` 滚动条通常会弹回顶部。
* **解决**：Vue Router 或 KeepAlive 在底层做了防丢处理：
1. **离开前（deactivated）**：通过 \`window.scrollY\` 记录下当前的滚动像素值（例如 \`350px\`）。
2. **切回后（activated）**：在 DOM 重新插入后，自动调用一次 \`window.scrollTo(0, 350)\` 恢复视角。


## 四、 踩坑细节与解决方案

### 1. 组件命名陷阱（\`include\` / \`exclude\` 无效）

当使用 \`include\` 或 \`exclude\` 筛选缓存组件时，Vue 是根据**组件的 \`name\` 选项**进行匹配的，而不是路由的 \`name\`！

* **避坑做法**：确保被缓存的组件显式定义了 \`name\` 属性。
\`\`\`vue
<!-- 错误：没有 defineOptions 指定名字，或者文件名与 include 匹配不上 -->
<script setup>
// Vue 3.3+ 推荐写法
defineOptions({
  name: 'UserProfile' // 👈 这里的名字必须与 include="UserProfile" 一致！
})
<\/script>

\`\`\`

### 2. 定时器与全局事件导致的“内存泄漏”

这是 \`<KeepAlive>\` 最常见的问题！组件失活（\`deactivated\`）时，**它并没有被销毁**，如果在 \`onMounted\` 里注册了事件或定时器，它们会**一直在后台运行**，极易引发内存泄漏或逻辑异常。

* **错误现象**：在 Tab A 挂载了一个 \`setInterval\` 轮询，切到 Tab B 后，后台还在频繁发请求。
* **避坑做法**：把监听器/定时器的“创建和清除”绑定到 \`onActivated\` 和 \`onDeactivated\` 上。

\`\`\`javascript
import { onActivated, onDeactivated } from 'vue'

let timer = null

onActivated(() => {
  // 切回前台：开启定时器 / 绑定 window 事件
  timer = setInterval(() => { fetchData() }, 2000)
  window.addEventListener('resize', handleResize)
})

onDeactivated(() => {
  // 移到后台：及时暂停定时器 / 解绑事件！
  clearInterval(timer)
  window.removeEventListener('resize', handleResize)
})

\`\`\`
### 3. 与 \`<Transition>\` 过渡动画结合时的嵌套顺序

如果你在路由切换时同时使用了 \`<router-view>\`、\`<KeepAlive>\` 和 \`<Transition>\` 动画，**结构顺序绝对不能错**，否则会导致动画失效或 DOM 渲染异常！

* **正确结构（Vue 3 标准嵌套）**：
\`\`\`vue
<router-view v-slot="{ Component }">
  <transition name="fade">
    <!-- KeepAlive 必须在 transition 内部，包装具体的 component -->
    <keep-alive :max="10">
      <component :is="Component" />
    </keep-alive>
  </transition>
</router-view>

\`\`\`

### 4. 数据更新策略：从“什么时候调接口”说起

使用了 \`<KeepAlive>\` 的组件，第二次进入时**再也不会触发 \`onMounted**\`。如果你希望用户每次切回该页面时数据都是最新的，调接口的时机必须做出调整：

* ❌ **不推荐**：把数据加载仅放在 \`onMounted\`（切回时不更新）。
* ✅ **推荐做法**：
* **场景 A**：只有需要实时刷新的数据（如最新通知），放在 \`onActivated\` 中请求。
* **场景 B**：通过路由参数监听（如 \`watch(() => route.params.id)\`）判断参数是否改变，变了才重新发请求，没变就继续复用缓存。

### 5. 性能陷阱：什么时候**绝对不要**用 KeepAlive？

\`<KeepAlive>\` 并非万能药，盲目添加会严重拖慢性能：

1. **含有大量 DOM 节点或超长列表的组件**：
* 缓存 10 个包含 2000 行表格数据的组件，相当于把几万个真实 DOM 节点死死锁在 RAM 内存里，会导致整张网页卡顿。


2. **安全敏感页面**：
* 如支付界面、个人隐私设置、修改密码页面。缓存会导致用户切出后，表单敏感数据依然停留在内存中，有安全风险。


3. **没有频繁切换需求的单次操作页**：
* 如“新增用户”表单页，用户填完提交就走，不需要保留状态，直接使用常规组件卸载流程即可。


## 总结

\`<KeepAlive>\` 的设计精妙之处在于对**底层 DOM 引用**和**生命周期拦截**的精准把控：

* **存得巧**：利用 JS 引用机制将真实 DOM 驻留内存，规避 GC 垃圾回收。
* **查得快**：跳过 JS 逻辑与 DOM 创建，将渲染开销降至最低。
* **细节全**：利用 DOM 原生属性或主动恢复机制，完美保留滚动位置与用户输入状态。
`;export{n as default};
