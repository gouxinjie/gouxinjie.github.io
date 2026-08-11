const n=`
# React 严格模式下组件渲染两次的原因及解决方案

[[toc]]

![](../images/StrictMode.png)

在 React 中，如果你开启了 **严格模式（\`<React.StrictMode>\`）**，组件在开发环境（Development）下确实会被重复渲染两次。

这并不是 Bug，而是 React **故意为之的设计**，旨在帮助开发者提前暴露代码中的隐患（如副作用泄露、非纯函数渲染等）。


## 一、为什么会渲染两次？（底层原因）

React 严格模式的双重渲染机制主要分为以下两个阶段：

### 1. 检查 Render 阶段的“纯洁性”（Pure Rendering）

React 要求组件的渲染函数（组件本身、\`useState\` 的初始函数、\`useReducer\` 等）必须是**纯函数（Pure Function）**。纯函数的特点是：**相同的输入（Props & State），永远输出相同的 JSX，且不产生任何副作用**。

在开发模式下，React 会故意**调用两次**以下函数：

* 函数组件的正文（Component Body）
* \`useState\` / \`useMemo\` / \`useReducer\` 的初始函数或更新函数

> **目的**：如果你在组件渲染主体中写了副作用（例如修改全局变量、直接操作 DOM、\`array.push\` 突变原数据），两次渲染会让这些错误成倍显现，方便你发现并修正。

### 2. 检查 Effect 的清理与恢复逻辑（React 18+ 特性）

从 React 18 开始，为了支持未来如 **Offscreen / Activity（后台组件缓存）** 等并发特性（组件可能会被多次挂载、卸载、重新挂载），严格模式会在组件首次挂载时，按如下顺序执行：

$$\\text{Mount (挂载)} \\longrightarrow \\text{Unmount (卸载)} \\longrightarrow \\text{Remount (重新挂载)}$$

具体表现为：

1. 执行 \`useEffect\` 的 setup 逻辑
2. **立即执行 \`useEffect\` 的 cleanup 清理逻辑**
3. 再次执行 \`useEffect\` 的 setup 逻辑

> **目的**：测试你的 \`useEffect\` 是否具备完善的**销毁清理机制**（Cleanup Function）。如果清理逻辑不完善，组件在卸载重挂时就会出现定时器叠加、事件重复监听、内存泄漏等问题。

---

> ⚠️ **注意**：双重渲染**只在开发模式（Development）生效**，打包发布到**生产环境（Production）时会自动关闭**，绝不会影响线上性能。


## 二、常见问题与解决方案

### 场景 1：\`useEffect\` 中的 API 请求发了两次

#### ❌ 错误/问题表现

\`\`\`tsx
useEffect(() => {
  // 严格模式下，这个请求在开发环境中会被发送 2 次
  fetchData().then(data => setData(data));
}, []);

\`\`\`

#### ✅ 解决方案

**方案 A：添加清理函数（取消未完成的请求）**
使用 \`AbortController\` 或取消标志位（Ignore flag），保证只有最后一次请求生效：

\`\`\`tsx
useEffect(() => {
  let ignore = false;
  const controller = new AbortController();

  async function startFetching() {
    const res = await fetch('/api/user', { signal: controller.signal });
    const data = await res.json();
    if (!ignore) {
      setData(data);
    }
  }

  startFetching();

  return () => {
    ignore = true; // 忽略旧请求
    controller.abort(); // 取消未完成的 HTTP 请求
  };
}, []);

\`\`\`

**方案 B：使用专业的请求库（推荐）**
使用 **TanStack Query (React Query)**、**SWR** 或 **RTK Query** 等现代数据请求库。它们原生处理了严格模式和组件重挂载的情况，具备自动去重和缓存机制。


### 场景 2：组件正文里修改了外部变量（违反纯函数原则）

#### ❌ 错误示例

\`\`\`tsx
let count = 0; // 外部全局变量

function MyComponent() {
  count++; // ❌ 错误：在渲染过程中改变了外部变量！
  // 严格模式下两次渲染会让 count 每次递增 2，逻辑直接错乱
  return <div>Count: {count}</div>;
}

\`\`\`

#### ✅ 解决方案

渲染必须保持纯净，把副作用移入 \`useEffect\` 或事件处理函数中：

\`\`\`tsx
function MyComponent() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(prev => prev + 1); // ✅ 状态更新交由 React 管理
  };

  return <button onClick={handleClick}>Count: {count}</button>;
}

\`\`\`


### 场景 3：定时器或事件监听重复注册

#### ❌ 错误示例

\`\`\`tsx
useEffect(() => {
  // 没有清理函数，两次挂载会导致注册了 2 个定时器
  setInterval(() => {
    console.log("Tick");
  }, 1000);
}, []);

\`\`\`

#### ✅ 解决方案

务必在 \`useEffect\` 的返回函数中清空副作用：

\`\`\`tsx
useEffect(() => {
  const timer = setInterval(() => {
    console.log("Tick");
  }, 1000);

  // ✅ 清理函数：第二次渲染前会先销毁上一次的定时器
  return () => clearInterval(timer);
}, []);

\`\`\`


## 三、如何关闭严格模式？（不推荐）

虽然严格模式能极大提升代码健壮性，但在接入某些老旧第三方库（不支持二次挂载/未做清理）时，你可以选择暂时关闭它。

在项目的入口文件（如 \`index.tsx\` 或 \`main.tsx\` / \`App.tsx\`）中，移除 \`<React.StrictMode>\` 包裹即可：

\`\`\`tsx
// 移除前：
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// 移除后（仅普通渲染，开发环境不再执行两次）：
root.render(
  <App />
);

\`\`\`


## 四、总结对比

| 检查阶段 | 严格模式行为 | 触发两次的原因 | 最佳实践 |
| --- | --- | --- | --- |
| **Render 阶段** | 双重调用组件函数/ initializer | 检测渲染函数中是否存在突变或副作用 | 保持组件为纯函数，不要在 Render 期间修改外部变量 |
| **Effect 阶段** (React 18+) | \`Mount -> Unmount -> Mount\` 循环 | 检验 \`useEffect\` 的销毁函数是否健全 | 必须补全 \`useEffect\` 的清理函数（\`return () => ...\`） |
`;export{n as default};
