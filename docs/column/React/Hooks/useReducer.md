# 深入理解 React 的 useReducer Hook

[[toc]]

## 一、什么是 useReducer？

`useReducer` 是 React 提供的一个状态管理 Hook，它适合管理包含多个子值的复杂状态逻辑。它借鉴了 Redux 的核心概念，但更加轻量级，内置于 React 中。

```javascript
const [state, dispatch] = useReducer(reducer, initialState);
```

::: tip 为什么需要 useReducer？

当你的组件状态变得复杂时，`useState` 可能会遇到以下问题：

1. **状态逻辑复杂**：当更新逻辑涉及多个子值或相互依赖的状态
2. **深层更新**：需要处理嵌套对象的状态更新
3. **可维护性**：希望将状态逻辑从组件中抽离
4. **可预测性**：想要更结构化的状态更新方式

:::

`useReducer` 通过引入 Redux 风格的状态管理解决了这些问题。

## 二、基本概念

### 1. Reducer 函数

Reducer 是一个纯函数，接收当前状态和一个 action，返回新状态：

```javascript
function reducer(state, action) {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 };
    case "decrement":
      return { count: state.count - 1 };
    default:
      throw new Error();
  }
}
```

### 2. Action 对象

Action 是一个描述发生了什么的对象，通常有 `type` 属性：

```javascript
{ type: 'increment' }
{ type: 'add', payload: 5 }
```

### 3. Dispatch 函数

`dispatch` 函数用于触发状态更新：

```javascript
dispatch({ type: "increment" });
```

## 三、基本用法

### 1. 简单计数器示例

```javascript
import { useReducer } from "react";

function reducer(state, action) {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 };
    case "decrement":
      return { count: state.count - 1 };
    default:
      throw new Error();
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });

  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({ type: "decrement" })}>-</button>
      <button onClick={() => dispatch({ type: "increment" })}>+</button>
    </>
  );
}
```

### 2. 带 payload 的示例

```javascript
function reducer(state, action) {
  switch (action.type) {
    case "add":
      return { count: state.count + action.payload };
    // ...其他 cases
  }
}

// 使用
dispatch({ type: "add", payload: 5 });
```

## 四、高级用法

### 1. 惰性初始化

可以传递初始化函数作为第三个参数：

```javascript
function init(initialCount) {
  return { count: initialCount };
}

function reducer(state, action) {
  switch (action.type) {
    case "reset":
      return init(action.payload);
    // ...其他 cases
  }
}

function Counter({ initialCount }) {
  const [state, dispatch] = useReducer(reducer, initialCount, init);
  // ...
}
```

### 2. 与 useContext 结合

实现小型全局状态管理：

```javascript
const MyContext = React.createContext();

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <MyContext.Provider value={{ state, dispatch }}>
      <ChildComponent />
    </MyContext.Provider>
  );
}

function ChildComponent() {
  const { state, dispatch } = useContext(MyContext);
  // ...
}
```

## 五、与 useState 的比较

| 特性         | useState     | useReducer            |
| ------------ | ------------ | --------------------- |
| **适用场景** | 简单状态     | 复杂状态逻辑          |
| **状态结构** | 单个值       | 可以是复杂对象        |
| **更新逻辑** | 直接在组件中 | 集中在 reducer 函数中 |
| **可测试性** | 较难测试     | 容易测试（纯函数）    |
| **代码量**   | 较少         | 较多（但更结构化）    |

::: tip 实际应用场景

1. **表单处理**：管理包含多个字段的复杂表单状态
2. **多步骤流程**：如向导或注册流程
3. **全局状态**：结合 Context API 实现小型应用状态管理
4. **复杂交互**：如图形编辑器、游戏状态等

:::

## 示例：待办事项列表

```javascript
function todosReducer(state, action) {
  switch (action.type) {
    case "add":
      return [...state, { text: action.text, completed: false }];
    case "toggle":
      return state.map((todo, i) => (i === action.index ? { ...todo, completed: !todo.completed } : todo));
    case "remove":
      return state.filter((_, i) => i !== action.index);
    default:
      return state;
  }
}

function TodoList() {
  const [todos, dispatch] = useReducer(todosReducer, []);
  const [text, setText] = useState("");

  function handleAdd() {
    dispatch({ type: "add", text });
    setText("");
  }

  return (
    <div>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <button onClick={handleAdd}>Add</button>
      {todos.map((todo, i) => (
        <div key={i}>
          <span style={{ textDecoration: todo.completed ? "line-through" : "" }}>{todo.text}</span>
          <button onClick={() => dispatch({ type: "toggle", index: i })}>Toggle</button>
          <button onClick={() => dispatch({ type: "remove", index: i })}>Remove</button>
        </div>
      ))}
    </div>
  );
}
```
