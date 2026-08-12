const n=`# React 18 并发特性核心：\`useTransition\` 深度拆解

在 React 18 之前，组件的状态更新都是 **同步且不可中断** 的。一旦触发了复杂的重绘逻辑（例如筛选几千条数据或渲染复杂图表），主线程就会被卡死，导致用户的输入、点击等交互毫无响应。

为了解决这一痛点，React 18 引入了 **并发渲染（Concurrent Rendering）**，而 \`useTransition\` 就是让我们能够在代码中 **“显式标记低优先级更新”** 的核心 Hook。

![](../images/useTransition.png)


## 一、 为什么需要 \`useTransition\`？（痛点分析）

在传统的 React 渲染模型中，所有状态更新的优先级是平等的。

考虑以下常见的搜索过滤场景：

\`\`\`jsx
function SearchApp() {
  const [query, setQuery] = useState("");
  const [list, setList] = useState([]);

  const handleChange = (e) => {
    // 1. 输入框更新（快速）
    setQuery(e.target.value);
    // 2. 耗时的高频列表过滤（慢速）
    setList(filterHeavyData(e.target.value));
  };

  return (
    <div>
      <input value={query} onChange={handleChange} />
      <List data={list} />
    </div>
  );
}

\`\`\`

### 💥 核心痛点

1. **主线程卡死**：每次打字，\`filterHeavyData\` 都会触发成千上万个 DOM 节点的渲染，耗时可能长达数百毫秒。
2. **掉帧与输入延迟**：在此期间，浏览器主线程被计算完全占用，用户连续打字时输入框会卡顿、掉帧，甚至没有任何反应。


## 二、 \`useTransition\` 核心解法与 API 语法

React 18 将更新划分为两类：

* **紧急更新（Urgent Updates）**：直接反映物理交互的操作（如打字、点击、选中），需要毫秒级响应。
* **过渡更新（Transition Updates）**：将视图从一个状态切换到另一个状态（如列表筛选、图表切换），可以接受短暂延迟。

\`useTransition\` 允许我们 **降级非紧急更新**，优先保证紧急更新的畅通。

### 📘 基本语法

\`\`\`tsx
const [isPending, startTransition] = useTransition();

\`\`\`

| 返回值/函数 | 类型 | 说明 |
| --- | --- | --- |
| **\`isPending\`** | \`boolean\` | 是否有正处于后台“过渡状态”的更新。可用于展示加载反馈。 |
| **\`startTransition\`** | \`(callback) => void\` | 高阶函数。将其内部的 \`setState\` 标记为“低优先级过渡更新”。 |


## 三、 代码重构：用 \`useTransition\` 解决卡顿

通过将耗时的 \`setList\` 放入 \`startTransition\` 中，我们可以实现输入框即时响应与列表异步渲染的解耦：

\`\`\`jsx
import React, { useState, useTransition } from "react";

function SearchApp() {
  const [query, setQuery] = useState("");
  const [list, setList] = useState([]);

  // 1. 引入 useTransition
  const [isPending, startTransition] = useTransition();

  const handleChange = (e) => {
    const value = e.target.value;

    // ✅ 紧急更新：立刻更新输入框受控值，保证打字极致流畅
    setQuery(value);

    // ⏳ 非紧急更新：标记为 Transition，后台并发渲染
    startTransition(() => {
      setList(filterHeavyData(value));
    });
  };

  return (
    <div className="search-container">
      <input
        value={query}
        onChange={handleChange}
        placeholder="请输入关键字搜索..."
      />

      {/* 使用 isPending 给用户优雅的过渡反馈 */}
      {isPending && <span className="loading-spinner">正在更新列表...</span>}

      {/* 列表渲染：后台渲染期间，UI 会保持旧列表展示并降低透明度 */}
      <div style={{ opacity: isPending ? 0.6 : 1, transition: 'opacity 0.2s' }}>
        <List data={list} />
      </div>
    </div>
  );
}

\`\`\`


## 四、 底层原理解析：并发调度与“可中断渲染”

\`useTransition\` 的底层建立在 React 18 的 **Fiber 架构** 与 **Lane 优先级模型** 之上：

\`\`\`text
[用户连续输入 'A' -> 'AB']

 1. 'A' 触发 ──> 紧急更新：setQuery('A') [高优先级] ──> 立刻绘制输入框
               └─> 过渡更新：setList('A')  [低优先级] ──> 开始后台渲染... (被打断!)

 2. 'AB' 触发 ──> 紧急更新：setQuery('AB') [高优先级] ──> 立刻绘制输入框
                └─> 丢弃 'A' 的渲染，重新开始 setList('AB') 的后台渲染 ──> 完成绘制

\`\`\`

### 🧠 核心机制

1. **优先级降级**：包裹在 \`startTransition\` 中的 \`setState\` 会被赋予较低的 \`TransitionLane\` 优先级。
2. **可中断渲染（Interruptible Rendering）**：当 React 在后台计算低优先级的 \`setList\` 时，如果用户又敲击了键盘，React 会 **暂停/放弃当前的渲染任务**，优先处理键盘输入的紧急更新。
3. **跳过无用渲染**：如果用户连续打字，中间多次的 Transition 渲染会被直接放弃，只保留最后一次计算，极大节省了 CPU 算力。


## 五、 核心应用场景

### 1️⃣ 高频搜索与数据过滤（最常见）

在处理大量本地数据过滤或密集计算时，使用 useTransition 可以在不阻塞用户连续输入的前提下，完成后台计算：

\`\`\`jsx
import React, { useState, useTransition } from "react";

// 模拟 10,000 条长列表数据
const mockList = Array.from({ length: 10000 }, (_, i) => \`Item \${i + 1} - 响应式渲染测试\`);

function HeavySearchExample() {
  const [query, setQuery] = useState("");
  const [filteredList, setFilteredList] = useState(mockList);
  const [isPending, startTransition] = useTransition();

  const handleSearch = (e) => {
    const val = e.target.value;

    // 1. 紧急更新：输入框立刻高亮显示输入的文字
    setQuery(val);

    // 2. 非紧急更新：后台进行 10000 条数据的筛选与大面积 DOM 准备
    startTransition(() => {
      const result = mockList.filter((item) =>
        item.toLowerCase().includes(val.toLowerCase())
      );
      setFilteredList(result);
    });
  };

  return (
    <div style={{ padding: 20 }}>
      <input
        value={query}
        onChange={handleSearch}
        placeholder="搜索 10,000 条数据..."
        style={{ padding: '8px 12px', width: 300 }}
      />

      {/* 状态提示：通知用户后台正在计算 */}
      {isPending && <span style={{ marginLeft: 10, color: '#888' }}>正在计算更新...</span>}

      {/* 视觉反馈：后台计算时降低旧视图透明度，计算完成后自动恢复 */}
      <ul style={{ opacity: isPending ? 0.4 : 1, transition: "opacity 0.2s", marginTop: 15 }}>
        {filteredList.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

\`\`\`



### 2️⃣ 复杂 Tab 与路由页面切换

在 Tab 或路由切换时，如果新页面组件过于庞大，可以使用 \`startTransition\` 避免界面假死：

\`\`\`jsx
const [activeTab, setActiveTab] = useState('home');
const [isPending, startTransition] = useTransition();

const handleTabChange = (nextTab) => {
  startTransition(() => {
    setActiveTab(nextTab); // 切换复杂组件页面
  });
};

\`\`\`

### 3️⃣ 与 Suspense 协同，防止 UI 闪烁 (Blink)

在结合 Suspense 加载异步数据/组件时，普通的 setState 会立即卸载当前界面并展示 fallback（如骨架屏），产生界面闪烁 (Blink)。

使用 useTransition 可以让用户停留在当前旧页面，直到新页面的数据/代码彻底加载完毕后再进行无缝切换：

\`\`\`jsx
import React, { useState, useTransition, Suspense, use } from "react";

// 模拟异步数据请求资源
function fetchPageData(pageId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(\`这是页面 \${pageId} 的异步加载数据内容\`);
    }, 1500); // 模拟 1.5 秒网络延迟
  });
}

// 模拟支持 Suspense 的异步组件 (React 19 / Suspense 兼容模式)
function AsyncPageContent({ resource }) {
  const data = use(resource); // 读取 Promise
  return <div className="page-box">{data}</div>;
}

export function SmoothTabSwitch() {
  const [pageId, setPageId] = useState(1);
  const [resource, setResource] = useState(() => fetchPageData(1));
  const [isPending, startTransition] = useTransition();

  const handleSwitchTab = (nextPageId) => {
    const nextResource = fetchPageData(nextPageId);

    // 💡 关键点：使用 startTransition 包裹新资源的更新
    startTransition(() => {
      setPageId(nextPageId);
      setResource(nextResource);
    });
  };

  return (
    <div>
      {/* Tab 选项卡按钮 */}
      <div style={{ display: 'flex', gap: 10 }}>
        {[1, 2, 3].map((id) => (
          <button
            key={id}
            onClick={() => handleSwitchTab(id)}
            disabled={isPending && pageId === id}
            style={{ fontWeight: pageId === id ? 'bold' : 'normal' }}
          >
            切换到 Tab {id}
          </button>
        ))}
        {/* 在按钮旁边展示加载状态，而不是直接切走整个页面 */}
        {isPending && <span> 新页面加载中...</span>}
      </div>

      <hr />

      {/*
        如果不加 startTransition：点击按钮会瞬间清空视图，展示 1.5 秒的 "加载中..." 骨架屏。
        加上 startTransition 后：用户会继续看到当前旧 Tab 的内容（带有 0.6 透明度），直到新 Tab 数据就绪才切换！
      */}
      <Suspense fallback={<div>首次挂载骨架屏...</div>}>
        <div style={{ opacity: isPending ? 0.6 : 1, transition: 'opacity 0.2s' }}>
          <AsyncPageContent resource={resource} />
        </div>
      </Suspense>
    </div>
  );
}

\`\`\`


## 六、 关键对比：\`useTransition\` vs \`useDeferredValue\` vs 防抖 (Debounce)

在实际开发中，这三者经常被拿来做性能优化，但它们的适用机制完全不同：

| 维度 | \`useTransition\` | \`useDeferredValue\` | 防抖 (Debounce) |
| --- | --- | --- | --- |
| **触发机制** | **主动触发**：直接包裹状态更新函数 \`setState\` | **被动延迟**：传入一个 state/prop，生成其延迟副本 | **定时器延时**：基于 \`setTimeout\` 强制等待 |
| **响应速度** | CPU 一旦空闲 **立刻** 渲染，无需硬编码等待时间 | CPU 一旦空闲 **立刻** 渲染，无需硬编码等待时间 | 无论 CPU 是否空闲，必须等待固定时间（如 300ms） |
| **中断能力** | **支持**（渲染可被紧急更新打断） | **支持**（渲染可被紧急更新打断） | 不支持（触发渲染后仍会同步阻塞主线程） |
| **最佳场景** | 能直接访问并控制 \`setState\` 调用的地方 | 无法控制 \`setState\`（例如来自父组件的 \`props\`） | 减少高频 **网络 HTTP 请求** 压力 |

> 💡 **选型口诀**：
> * 优化 CPU 渲染开销 + 能拿到 \`setState\` ──> **\`useTransition\`**
> * 优化 CPU 渲染开销 + 只拿到 \`props\` / \`value\` ──> **\`useDeferredValue\`**
> * 减少 API 接口调用频率 ──> **\`Debounce 防抖\`**
>
>


## 七、 最佳实践与避坑指南

### ❌ 误区 1：把输入框受控值放入 \`startTransition\`

\`\`\`jsx
// ❌ 错误示范：将输入框自身的受控值降级
startTransition(() => {
  setQuery(e.target.value);
});

\`\`\`

* **后果**：这会导致输入框本身也变成低优先级更新，用户打字时会感觉到明显的按键延迟。

### ❌ 误区 2：在 \`startTransition\` 中包含异步逻辑 (React 18 标准)

\`\`\`jsx
// ❌ 错误示范 (React 18)
startTransition(async () => {
  const res = await fetchData();
  setData(res); // 此时已经脱离了同步执行上下文，更新无法被捕获为 Transition
});

// ✅ 正确示范：先等待异步返回，再包裹 setState
const res = await fetchData();
startTransition(() => {
  setData(res);
});

\`\`\`

### ❌ 误区 3：用来替代接口防抖

* \`useTransition\` 解决的是 **CPU 渲染渲染卡顿**，而不是网络请求过载。如果是为了防止用户输入时频繁发请求打击后端，依然需要使用 **防抖 (Debounce)**。


## 八、 总结

1. **定位**：\`useTransition\` 是 React 18 并发渲染能力的开放 API，本质是 **“用空间与优先级调度换取 UI 流畅度”**。
2. **两件套**：\`isPending\` 负责状态反馈（如 Loading / 降低透明度），\`startTransition\` 负责状态降级。
3. **核心优势**：比传统防抖更智能，因为它不需要硬编码等待毫秒数，而是根据用户的硬件性能和 CPU 空闲状态动态调度渲染。
`;export{n as default};
