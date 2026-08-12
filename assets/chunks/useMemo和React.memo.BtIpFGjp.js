const n=`
# useMemo和React.memo

[[toc]]

\`useMemo\` 与 \`React.memo\` 是 React 性能优化中最常搭配使用的两大缓存（Memoization）手段。

虽然它们名称里都包含 \`memo\`，但它们的 **作用对象** 和 **优化维度** 完全不同：

* **\`useMemo\`**：是一个 **Hook**，针对的是组件内部的 **值/计算结果/引用地址**（数据层优化）。
* **\`React.memo\`**：是一个 **高阶组件（HOC）**，针对的是 **组件本身的 UI 重新渲染**（视图层优化）。


## 一、 \`useMemo\` 深度拆解

### 1. 核心作用

\`useMemo\` 用于在多次渲染之间 **缓存计算结果** 或 **保持对象/数组的引用地址不变**。只有当依赖项（Dependency Array）发生变化时，它才会重新调用传入的计算函数。

### 2. 基本语法

\`\`\`tsx
const memoizedValue = useMemo(() => {
  // 执行高昂计算逻辑
  return computeExpensiveValue(a, b);
}, [a, b]); // 依赖项

\`\`\`

### 3. 两大核心应用场景

#### 场景 1：避免高昂计算的重复执行

假设你需要对包含数万条数据的数组进行排序与过滤，如果不使用 \`useMemo\`，只要父组件触发任何无关的 \`re-render\`，这段耗时计算就会重复执行：

\`\`\`tsx
function DataList({ items, filterText }) {
  // ✅ 只有当 items 或 filterText 发生改变时，才会重新运行耗时计算
  const visibleItems = useMemo(() => {
    console.log("执行高昂过滤逻辑...");
    return items
      .filter(item => item.includes(filterText))
      .sort((a, b) => a.localeCompare(b));
  }, [items, filterText]);

  return (
    <ul>
      {visibleItems.map(item => <li key={item}>{item}</li>)}
    </ul>
  );
}

\`\`\`

#### 场景 2：维持复杂数据类型（对象/数组）的引用稳定性

在 JavaScript 中，\`{} === {}\` 为 \`false\`。每次函数组件执行时，直接内联创建的对象都会生成一个新的内存引用。如果这个对象被用作 \`useEffect\` 的依赖项或传给优化过的子组件，就会触发不必要的重新执行：

\`\`\`tsx
function Parent() {
  const [count, setCount] = useState(0);

  // ❌ 每次 Parent 重绘，config 的内存引用都会改变！
  // const config = { theme: 'dark', id: 1 };

  // ✅ 保持 config 对象的内存地址稳定
  const config = useMemo(() => ({
    theme: 'dark',
    id: 1
  }), []); // 空依赖，整个生命周期内存地址保持一致

  return <Child config={config} />;
}

\`\`\`


## 二、 \`React.memo\` 深度拆解

### 1. 核心作用

\`React.memo\` 是一个高阶组件。它会包裹一个子组件，在父组件重新渲染时，对子组件收到的 **新旧 \`props\` 进行浅比较（Shallow Comparison）**。如果 \`props\` 没有任何变化，React 会直接跳过（Skip）该子组件的渲染，复用上一次渲染出的 DOM 节点。

### 2. 基本语法

\`\`\`tsx
// 使用 React.memo 包裹子组件
const ChildComponent = React.memo(function Child({ name, age }: ChildProps) {
  console.log("子组件 Render");
  return <div>{name} - {age}</div>;
});

// 支持传入自定义比较函数 (ArePropsEqual)
const CustomChild = React.memo(ChildComponent, (prevProps, nextProps) => {
  // 返回 true 表示 props 相等（跳过渲染）；返回 false 表示触发渲染
  return prevProps.id === nextProps.id;
});

\`\`\`


## 三、 绝配组合：为什么 \`React.memo\` 经常需要 \`useMemo\` / \`useCallback\`？

在实际开发中，**单独使用 \`React.memo\` 往往是无效的**。

### ❌ 常见的失败案例

\`\`\`tsx
// 被 React.memo 包裹的子组件
const UserCard = React.memo(({ user, onClick }: { user: object; onClick: () => void }) => {
  console.log("UserCard 渲染");
  return <div onClick={onClick}>{user.name}</div>;
});

function Parent() {
  const [count, setCount] = useState(0);

  // ❌ 每次 Parent 重新渲染：
  // 1. userInfo 被重新创建，生成新的对象引用
  // 2. handleClick 被重新创建，生成新的函数引用
  const userInfo = { name: "张三" };
  const handleClick = () => console.log("clicked");

  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>
      {/* 💥 UserCard 的 props 进行浅比较：Object.is(oldUser, newUser) 返回 false */}
      {/* 导致 React.memo 彻底失效，UserCard 依然频繁重绘！ */}
      <UserCard user={userInfo} onClick={handleClick} />
    </div>
  );
}

\`\`\`

### ✅ 正确姿势：配合 \`useMemo\` & \`useCallback\` 稳定引用

\`\`\`tsx
function Parent() {
  const [count, setCount] = useState(0);

  // ✅ 用 useMemo 稳定对象引用
  const userInfo = useMemo(() => ({ name: "张三" }), []);

  // ✅ 用 useCallback 稳定函数引用（useCallback 是 useMemo 返回函数的语法糖）
  const handleClick = useCallback(() => {
    console.log("clicked");
  }, []);

  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>
      {/* 此时 userInfo 和 handleClick 的引用地址均保持不变 */}
      {/* React.memo 判定 props 未变化，成功跳过 UserCard 的 Render！ */}
      <UserCard user={userInfo} onClick={handleClick} />
    </div>
  );
}

\`\`\`

## 四、 避坑指南：什么时候**不应该**用它们？

过度优化（Premature Optimization）是 React 开发中的常见反模式。滥用 \`useMemo\` / \`React.memo\` 会带来额外的内存开销与比较成本：

1. **简单基础类型的计算不需要 \`useMemo**\`：
\`const double = useMemo(() => count * 2, [count]);\`
*原因*：简单乘法计算的开销（微秒级）远远低于调用 \`useMemo\`、闭包创建和对比依赖项数组的开销。
2. **接收 \`children\` 的通用容器组件慎用 \`React.memo**\`：
如果组件内部包含 \`<Card>{children}</Card>\`，由于每次父组件渲染时 \`children\` 都是新的 React 元素（JSX 对象），\`React.memo\` 的浅比较永远为 \`false\`，几乎 100% 拦截失败。
3. **子组件没有被 \`React.memo\` 包裹时，不要给它的 \`props\` 盲目加 \`useMemo**\`：
如果子组件本身每轮都会重新渲染，父组件耗费精力去 \`useMemo\` 传给它的对象就是无用功。


## 五、 对比与选型矩阵

| 维度 | \`useMemo\` | \`React.memo\` |
| --- | --- | --- |
| **本质类型** | React Hook | 高阶组件 (HOC) |
| **优化目标** | 缓存 **计算数值 / 引用地址** | 缓存 **整个组件的 UI 渲染 (DOM)** |
| **触发机制** | 依赖数组 \`[deps]\` 发生改变 | 传入的 \`props\` 浅比较（或自定义比较）发生改变 |
| **适用场景** | 1. 高开销的复杂数据计算<br>

<br>2. 维持对象/数组引用传给子组件或依赖 | 1. 包含大量 DOM / 渲染成本高昂的纯展示子组件<br>

<br>2. 在高频更新的父组件中被频繁调用的子组件 |
`;export{n as default};
