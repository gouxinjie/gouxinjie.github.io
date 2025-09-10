# useMemo 和 React.memo

---

[[toc]]

## 一、React.memo

`React.memo` 是一个 React API，用于优化性能。它通过记忆上一次的渲染结果，仅当 props 发生变化时才会重新渲染, 避免重新渲染。

使用 `React.memo `包裹组件[一般用于子组件]，可以避免组件重新渲染。

**用法：**

```tsx
import React, { memo } from "react";
const MyComponent = React.memo(({ prop1, prop2 }) => {
  // 组件逻辑
});
const App = () => {
  return <MyComponent prop1="value1" prop2="value2" />;
};
```

### 使用场景

1. 当子组件接收的 props 不经常变化时
2. 当组件重新渲染的开销较大时
3. 当需要避免不必要的渲染时

**优点：**

1. 通过记忆化避免不必要的重新渲染
2. 提高应用性能
3. 减少资源消耗

## 二、useMemo

`useMemo` 允许你在组件渲染期间缓存计算结果，只有当依赖项发生变化时才会重新计算。这类似于 Vue 中的计算属性(computed property)。

**用法：**

```tsx
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

第一个参数：计算函数，返回需要缓存的值<br/> 第二个参数：依赖项数组，只有这些依赖变化时才重新计算

### 使用场景

**问题**：每次点击按钮触发重新渲染时，即使 `list` 没有变化，`ExpensiveComponent` 都会重新执行所有计算。

```tsx
function ExpensiveComponent({ list }) {
  // 每次渲染都会重新执行这个昂贵的计算
  const processedList = (): Array<any> => {
    console.log("执行昂贵计算"); // 只有 list 变化时才会打印
    const sortedList = [...list].sort((a, b) => a.value - b.value);
    const filteredList = sortedList.filter((item) => item.active);
    return filteredList.map((item) => ({
      ...item,
      doubleValue: item.value * 2
    }));
  };

  useEffect(() => {
    console.log("重新计算耗时操作"); // 每次渲染都会打印
  });

  return (
    <ul>
      {processedList().map((item) => (
        <li key={item.id}>
          {item.name} - {item.doubleValue}
        </li>
      ))}
    </ul>
  );
}

function App() {
  const [count, setCount] = useState(0);
  const [list] = useState([
    { id: 1, name: "A", value: 3, active: true },
    { id: 2, name: "B", value: 1, active: false },
    { id: 3, name: "C", value: 2, active: true }
  ]);

  useEffect(() => {
    console.log("父组件DidMount");
  });

  return (
    <div>
      <Button type="primary" onClick={() => setCount((c) => c + 1)}>
        点击计数: {count}
      </Button>
      <ExpensiveComponent list={list} />
    </div>
  );
}

export default App;
```

现在的效果是：每一次点击技术按钮 ，`ExpensiveComponent`子组件就会打印一次 "执行昂贵计算"。

**解决方案：**

使用 `useMemo` 缓存计算结果，如果`useMemo`所依赖的数据不变，那么就不会执行重新计算；代码改动如下:

```tsx
const processedList = useMemo(() => {
  console.log("执行昂贵计算"); // 只有 list 变化时才会打印
  const sortedList = [...list].sort((a, b) => a.value - b.value);
  const filteredList = sortedList.filter((item) => item.active);
  return filteredList.map((item) => ({
    ...item,
    doubleValue: item.value * 2
  }));
}, [list]); // 依赖项：只有 list 变化时才重新计算
```
