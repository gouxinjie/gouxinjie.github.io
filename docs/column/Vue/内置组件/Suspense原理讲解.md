# Suspense原理讲解

[[toc]]

在 Vue 3 中，**`<Suspense>`** 是一个内置的控制流组件。它的核心使命是：**协调（Coordinate）管理其组件树深处所有异步依赖（异步组件、`async setup()`）的加载状态，避免页面出现“打地鼠式”的多次闪烁，实现平滑的一次性整体渲染。**

要理解它的底层原理，可以拆解为 **状态机切换**、**异步依赖收集（Promise 抛出与捕获）** 以及 **双 VNode 树（离屏渲染）** 三个维度。


## 一、 核心原理解析

### 1. 状态机：3 种状态与 2 个插槽

`<Suspense>` 内部维护了一个简单的状态机：

```
       [ Pending (加载中) ]
             /        \
            /          \  (所有异步依赖 resolve)
   (出现错误)           \
          ▼              ▼
     [ Rejected ]   [ Resolved (挂载完成) ]

```

* **`#default` 插槽**：包含真正的业务组件树（可能嵌套了深层的 `async setup()` 或异步组件）。
* **`#fallback` 插槽**：加载中（Pending 状态）时展示的骨架屏或 Loading 占位组件。


### 2. 异步依赖收集机制：巧用“Promise 抛出与捕获”

`<Suspense>` 是如何知道它子孙组件里有哪些东西是异步的？

#### ① `async setup()` 的原理

在 Vue 3 中，如果一个组件的 `setup()` 是 `async` 的（或者使用了顶级 `await`），它在执行时**本质上会返回一个 Promise**：

```typescript
// 编译后的 setup 函数
setup() {
  // 当组件内部有 await 时， setup 会返回一个 Promise
  return doAsyncStuff().then(() => {
    return () => h('div', 'Data loaded')
  })
}

```

#### ② 依赖收集流程

1. 当 Vue 渲染组件树，遇到一个返回 Promise 的组件（或开启了 `suspensible` 的异步组件）时，**当前组件的挂载会被暂停**。
2. 该 Promise 会被**向上冒泡（Bubble up）**，直到被最近的父级 `<Suspense>` 组件捕获（Captured）。
3. `<Suspense>` 内部有一个数组/计数器，用来追踪所有捕获到的异步 Promise：
```typescript
// 源码核心思路示意
suspense.deps++ // 发现一个未完成的异步依赖，计数器 +1
promise.then(() => {
  suspense.deps-- // 完成一个，计数器 -1
  if (suspense.deps === 0) {
    suspense.resolve() // 全部完成，触发状态切换！
  }
})

```

### 3. 双 VNode 树与离屏渲染（Off-screen / Buffer）

这是 `<Suspense>` 实现“无缝平滑切换”最关键的物理机制。

如果你在已经渲染好的页面上，因为某些响应式参数变化重新触发了子组件的异步加载，`<Suspense>` **不会立刻把当前旧页面撕掉变白**！

1. **离屏 DOM 树（Subtree Buffer）**：
当状态变为 Pending 时，`<Suspense>` 会在**内存中**继续渲染新的 `#default` 树（离屏 DOM）。
2. **继续展示旧视图 / 展示 Fallback**：
* 如果是**首次加载**：直接在真实 DOM 上展示 `#fallback` 骨架屏。
* 如果是**更新加载**：真实 DOM 依然展示旧的 `#default` 内容，新页面的渲染全在内存中进行。


3. **原子化替换（Atomic Swap）**：
只有当内存中新的 `#default` 树里**所有的异步 Promise 全部 `resolve**` 之后，Vue 才会执行一次 DOM 替换，把内存中的 DOM 树一次性挂载到真实 DOM 上，并销毁旧视图。

> **效果**：用户要么看到完整的旧页面，要么看到完整的新页面，绝对不会看到半加载状态的残缺页面。


## 二、 简易版源码逻辑模拟

为了让你更直观地理解，我们可以用一个简化版的组件来模拟 `<Suspense>` 的控制逻辑：

```typescript
import { defineComponent, ref, h } from 'vue'

export const MySuspense = defineComponent({
  name: 'MySuspense',
  setup(props, { slots }) {
    const isResolved = ref(false)
    const pendingDeps = ref(0)

    // 提供给子孙组件调用的注册接口（实际源码中通过 internal instance 边界捕获）
    const registerDep = (promise: Promise<any>) => {
      pendingDeps.value++
      isResolved.value = false

      promise
        .then(() => {
          pendingDeps.value--
          if (pendingDeps.value === 0) {
            // 所有异步依赖已全部解决
            isResolved.value = true
          }
        })
        .catch((err) => {
          console.error('Suspense caught error:', err)
        })
    }

    return () => {
      // 如果全部完成，渲染 #default 插槽，否则渲染 #fallback 插槽
      if (isResolved.value) {
        return slots.default ? slots.default() : null
      } else {
        return slots.fallback ? slots.fallback() : h('div', 'Loading...')
      }
    }
  }
})

```


## 三、 与 `defineAsyncComponent` 的协同原理

前面提到过，`defineAsyncComponent` 配置项中有 `suspensible: true`（默认值）：

```
[ Async Component (defineAsyncComponent) ]
                   │
         (检查父级是否有 Suspense)
                   │
         ┌─────────┴─────────┐
         ▼                   ▼
  [ 有 Suspense ]      [ 无 Suspense ]
         │                   │
  把加载 Promise       自己接管状态，
  向上抛给 Suspense    渲染自己的 loadingComponent

```

* **当存在 `<Suspense>` 时**：`defineAsyncComponent` 产生的组件在执行 `loader()` 时，会把返回的 Promise 注册给上层的 Suspense 节点，自己不再独立渲染 `loadingComponent`。
* **当不存在 `<Suspense>` 时**：它退化为独立的代理组件，通过内部的 `ref(loaded)` 自行切换 `loadingComponent` 和目标组件。


## 四、 总结一览

`<Suspense>` 的原理可以概括为 10 个字：**“捕获 Promise，离屏渲染 DOM”**。

1. **依赖收集**：利用组件 `setup` 返回 Promise 或异步组件抛出 Promise 的特性，在父级拦截并统计未完成的异步任务数量。
2. **状态等待**：在所有 Promise 完成前，维持 `#fallback` 骨架屏或保持旧视图不跳变。
3. **一次性替换**：通过内存离屏 DOM 树，在所有依赖准备就绪后，以原子操作的方式一次性挂载新组件树。
